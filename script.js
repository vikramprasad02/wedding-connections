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

const colors = ["#fff176", "#81c784", "#64b5f6", "#ba68c8"]; // yellow, green, blue, purple

let player = {
  firstName: "",
  lastName: "",
  startTime: null,
  groupTimes: [],
  currentGroupStart: null
};

let solvedGroups = 0;
let matchedGroups = [];

function startGame() {
  const first = document.getElementById("firstName").value.trim();
  const last = document.getElementById("lastName").value.trim();

  if (!first || !last) {
    alert("Please enter both your first and last name.");
    return;
  }

  player.firstName = first;
  player.lastName = last;
  player.startTime = Date.now();
  player.currentGroupStart = Date.now();

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
    const now = Date.now();
    const timeTaken = (now - player.currentGroupStart) / 1000;
    player.groupTimes.push(timeTaken.toFixed(2));
    player.currentGroupStart = now;

    matchedGroups.push(answers[matchedIndex].toString());

    const solvedContainer = document.getElementById("solved");

    selectedCells.forEach(cell => {
      cell.classList.remove("selected");
      cell.classList.add("correct");
      cell.style.backgroundColor = colors[matchedIndex];
      cell.onclick = null;
      solvedContainer.appendChild(cell);
    });

    solvedGroups++;

    if (solvedGroups === answers.length) {
      const totalTime = (now - player.startTime) / 1000;
      alert(`🎉 Well done, ${player.firstName} ${player.lastName}!\n
You solved all ${answers.length} groups in ${totalTime.toFixed(2)} seconds.\n
Group times: ${player.groupTimes.join(", ")} seconds.`);
    }

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
  const container = document.getElementById("grid");
  shuffle(allCells).forEach(cell => container.appendChild(cell));
}
