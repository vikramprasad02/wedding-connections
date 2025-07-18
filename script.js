const words = [
  "Blue", "Red", "Green", "Yellow",
  "Beagle", "Poodle", "Dalmatian", "Boxer",
  "Waffle", "Pancake", "Muffin", "Bagel",
  "Fiddle", "Middle", "Riddle", "Diddle"
];

const answers = [
  ["Blue", "Red", "Green", "Yellow"],           // Yellow
  ["Beagle", "Poodle", "Dalmatian", "Boxer"],   // Green
  ["Waffle", "Pancake", "Muffin", "Bagel"],     // Blue
  ["Fiddle", "Middle", "Riddle", "Diddle"]      // Purple
];

const categoryLabels = [
  "Colors",
  "Dog Breeds",
  "Breakfast Foods",
  "Words That Rhyme"
];

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
