const words = [
  "Blue", "Red", "Green", "Yellow",
  "Beagle", "Poodle", "Dalmatian", "Boxer",
  "Waffle", "Pancake", "Muffin", "Bagel",
  "Fiddle", "Middle", "Riddle", "Diddle"
];

const answers = [
  ["Blue", "Red", "Green", "Yellow"],           // Colors
  ["Beagle", "Poodle", "Dalmatian", "Boxer"],   // Dog Breeds
  ["Waffle", "Pancake", "Muffin", "Bagel"],     // Breakfast Foods
  ["Fiddle", "Middle", "Riddle", "Diddle"]      // Rhyming Words
];

const grid = document.getElementById("grid");
let selected = [];

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
}

function submitGuess() {
  const selectedCells = [...document.querySelectorAll(".cell.selected")];
  const selectedWords = selectedCells.map(cell => cell.innerText);

  if (selectedWords.length !== 4) {
    alert("Select exactly 4 words.");
    return;
  }

  const matchedGroup = answers.find(group =>
    group.every(word => selectedWords.includes(word))
  );

  if (matchedGroup) {
    selectedCells.forEach(cell => {
      cell.classList.remove("selected");
      cell.classList.add("correct");
      cell.onclick = null;
    });
  } else {
    alert("Incorrect group. Try again!");
    selectedCells.forEach(cell => cell.classList.remove("selected"));
  }
}

function revealAnswers() {
  document.querySelectorAll(".cell").forEach(cell => {
    const word = cell.innerText;
    if (answers.some(group => group.includes(word))) {
      cell.classList.add("correct");
      cell.onclick = null;
    }
  });
}

renderGrid();
