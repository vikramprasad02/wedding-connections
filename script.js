const words = [
  "Blue", "Red", "Green", "Yellow",
  "Beagle", "Poodle", "Dalmatian", "Boxer",
  "Waffle", "Pancake", "Muffin", "Bagel",
  "Fiddle", "Middle", "Riddle", "Diddle"
];

// Base64-encoded word groups
const encodedAnswers = [
  "Qmx1ZSxSZWQsR3JlZW4sWWVsbG93",                            // Colors
  "QmVhZ2xlLFBvb2RsZSxEYWxtYXRpYW4sQm94ZXI=",                // Dog breeds
  "V2FmZmxlLFBhbmNha2UsTXVmZmluLEJhZ2Vs",                    // Breakfast foods
  "RmlkZGxlLE1pZGRsZSxSaWRkbGUsRGlkZGxl"                     // Rhyming words
];

// (Optional) Encoded category labels — in case you show them later
const encodedCategories = [
  "Q29sb3Jz",               // "Colors"
  "RG9ncyBCcmVlZHM=",       // "Dogs Breeds"
  "QnJlYWtmYXN0IEZvb2Rz",   // "Breakfast Foods"
  "UnloaW1pbmcgV29yZHM="    // "Rhyming Words"
];

// Decode them
const answers = encodedAnswers.map(group => atob(group).split(","));
const categoryLabels = encodedCategories.map(label => atob(label));

const colors = ["#fff176", "#81c784", "#64b5f6", "#ba68c8"]; // yellow, green, blue, purple

let solvedGroups = 0;
let matchedGroups = [];

function startGame() {
  document.getElementById("landing").style.display = "none";
  document.getElementById("game").style.display = "block";
  renderGrid();
}

const grid = document.getElementById("grid");

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function renderGrid() {
  grid.innerHTML = "";
  shuffle(words).forEach(word => {
    const div = document.createElement("div");
    div.className = "cell";
    div.innerText = word;
    div.onclick = () => toggleSelect(div);
    grid.appendChild(div);
  });
}

function toggleSelect(cell) {
  if (cell.classList.contains("correct")) return;

  cell.classList.toggle("selected");
  const selectedCells = document.querySelectorAll(".cell.selected");
  if (selectedCells.length > 4) {
    selectedCells[0].classList.remove("selected");
  }

  if (selectedCells.length === 4) {
    setTimeout(submitGuess, 150);
  }
}

function submitGuess() {
  const selectedCells = [...document.querySelectorAll(".cell.selected")];
  const selectedWords = selectedCells.map(cell => cell.innerText);

  const matchedIndex = answers.findIndex(group =>
    group.every(word => selectedWords.includes(word)) &&
    !matchedGroups.includes(group.toString())
  );

  if (matchedIndex !== -1) {
    matchedGroups.push(answers[matchedIndex].toString());

    // Create solved card
    const card = document.createElement("div");
    card.className = "solved-card";
    card.style.backgroundColor = colors[matchedIndex];

    const title = document.createElement("div");
    title.className = "solved-title";
    title.innerText = categoryLabels[matchedIndex];

    const items = document.createElement("div");
    items.className = "solved-items";

    answers[matchedIndex].forEach(word => {
      const w = document.createElement("div");
      w.className = "solved-word";
      w.innerText = word;
      items.appendChild(w);
    });

    card.appendChild(title);
    card.appendChild(items);
    document.getElementById("solved").appendChild(card);

    // Remove matched words
    selectedCells.forEach(cell => cell.remove());

    solvedGroups++;
  } else {
    selectedCells.forEach(cell => {
      cell.classList.remove("selected");
      cell.classList.add("shake");
      setTimeout(() => cell.classList.remove("shake"), 400);
    });
  }
}

function reshuffleGrid() {
  const allCells = [...document.querySelectorAll(".cell:not(.correct)")];
  shuffle(allCells).forEach(cell => grid.appendChild(cell));
}
