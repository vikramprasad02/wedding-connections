const words = [
  "Blue", "Red", "Green", "Yellow",
  "Beagle", "Poodle", "Dalmatian", "Boxer",
  "Waffle", "Pancake", "Muffin", "Bagel",
  "Fiddle", "Middle", "Riddle", "Diddle"
];

const answers = [
  ["Blue", "Red", "Green", "Yellow"],
  ["Beagle", "Poodle", "Dalmatian", "Boxer"],
  ["Waffle", "Pancake", "Muffin", "Bagel"],
  ["Fiddle", "Middle", "Riddle", "Diddle"]
];

let player = {
  firstName: "",
  lastName: "",
  startTime: null,
  groupTimes: [],
  currentGroupStart: null
};

let solvedGroups = 0;

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

let selected = [];

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
    const now = Date.now();
    const timeTaken = (now - player.currentGroupStart) / 1000;
    player.groupTimes.push(timeTaken.toFixed(2));
    player.currentGroupStart = now;

    selectedCells.forEach(cell => {
      cell.classList.remove("selected");
      cell.classList.add("correct");
      cell.onclick = null;
    });

    solvedGroups++;

    if (solvedGroups === answers.length) {
      const totalTime = (now - player.startTime) / 1000;
      alert(`🎉 Well done, ${player.firstName} ${player.lastName}!\n
You solved all ${answers.length} groups in ${totalTime.toFixed(2)} seconds.\n
Group times: ${player.groupTimes.join(", ")} seconds.`);
    }

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
