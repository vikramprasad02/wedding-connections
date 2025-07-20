// === script.js ===

// Set to "DUMMY" or "PROD"
const MODE = "PROD";

const GAME_DATA = {
  DUMMY: {
    encodedAnswers: [
      "Qmx1ZSxSZWQsR3JlZW4sWWVsbG93",
      "QmVhZ2xlLFBvb2RsZSxEYWxtYXRpYW4sQm94ZXI=",
      "V2FmZmxlLFBhbmNha2UsTXVmZmluLEJhZ2Vs",
      "RmlkZGxlLE1pZGRsZSxSaWRkbGUsRGlkZGxl"
    ],
    encodedLabels: [
      "Q29sb3Jz",
      "RG9nIEJyZWVkcw==",
      "QnJlYWtmYXN0IEZvb2Rz",
      "UnloaW1pbmcgV29yZHM="
    ]
  },
  PROD: {
    encodedAnswers: [
      "QW1zdGVyZGFtLFJvbWUsTmljZSxNYWRyaWQ=",
      "RW1pbmVtLEdyZWF0IExha2VzLFBpc3RvbnMsVGhlIEhlbnJ5",
      "RHJpZnQsU3RhdGlvbixUb3dlcixWaWNl",
      "RGV0b3VyLERvbG9yZXMsUHVuY2hsaW5lLFNwaW4="
    ],
    encodedLabels: [
      "RVVST1BFQU4gQ0lUSUVTIFdFIEhBVkUgVklTSVRFRCBUT0dFVEhFUg==",
      "SUNPTlMgT0YgTUlDSElHQU4=",
      "VE9LWU8gX19fX19f",
      "U09NRSBPRiBPVVIgU0YgREFURSBTUE9UUw=="
    ]
  }
};

const answers = GAME_DATA[MODE].encodedAnswers.map(a => atob(a).split(","));
const categoryLabels = GAME_DATA[MODE].encodedLabels.map(atob);
const words = answers.flat();
const colors = ["#fff176", "#81c784", "#64b5f6", "#ba68c8"];

let solvedGroups = 0;
let matchedGroups = [];

const grid = document.getElementById("grid");
const submitBtn = document.getElementById("submit-btn");
const clearBtn = document.getElementById("clear-btn");

function startGame() {
  document.getElementById("landing").style.display = "none";
  document.getElementById("game").style.display = "block";
  renderGrid();
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function renderGrid() {
  grid.innerHTML = "";
  shuffle(words).forEach(word => {
    const div = document.createElement("div");
    div.className = "cell";

    const isTwoWord = word.trim().includes(" ");
    const wordLength = word.replace(/\s/g, "").length;

    if (isTwoWord) {
      div.classList.add("two-line");
    } else {
      div.classList.add("one-line");
      if (wordLength >= 9) {
        div.style.fontSize = "10.5px";
      } else if (wordLength >= 7) {
        div.style.fontSize = "14px";
      }
    }

    div.innerText = word.toUpperCase();
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

  submitBtn.disabled = selectedCells.length !== 4;
}

function submitGuess() {
  const selectedCells = [...document.querySelectorAll(".cell.selected")];
  const selectedWords = selectedCells.map(cell => cell.innerText.toUpperCase());

  const matchedIndex = answers.findIndex(group => {
    const groupUpper = group.map(word => word.toUpperCase());
    return groupUpper.every(word => selectedWords.includes(word)) &&
           !matchedGroups.includes(group.toString());
  });

  if (matchedIndex !== -1) {
    matchedGroups.push(answers[matchedIndex].toString());

    const block = document.createElement("div");
    block.className = "solved-block";
    block.style.backgroundColor = colors[matchedIndex];

    const category = document.createElement("div");
    category.className = "solved-block-category";
    category.innerText = categoryLabels[matchedIndex];
    block.appendChild(category);

    const wordLine = document.createElement("div");
    wordLine.className = "solved-block-words";
    wordLine.innerText = answers[matchedIndex].map(w => w.toUpperCase()).join(", ");
    block.appendChild(wordLine);

    document.getElementById("solved").appendChild(block);

    selectedCells.forEach(cell => cell.remove());
    solvedGroups++;
    submitBtn.disabled = true;
  } else {
    selectedCells.forEach(cell => {
      cell.classList.remove("selected");
      cell.classList.add("shake");
      setTimeout(() => cell.classList.remove("shake"), 400);
    });
    submitBtn.disabled = true;
  }
}

function reshuffleGrid() {
  const allCells = [...document.querySelectorAll(".cell:not(.correct)")];
  shuffle(allCells).forEach(cell => grid.appendChild(cell));
}

clearBtn.onclick = () => {
  document.querySelectorAll(".cell.selected").forEach(cell => {
    cell.classList.remove("selected");
  });
  submitBtn.disabled = true;
};

submitBtn.onclick = () => {
  if (!submitBtn.disabled) {
    submitGuess();
  }
};
