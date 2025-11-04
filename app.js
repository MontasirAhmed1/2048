const gridSize = 4;
let grid = [];
let score = 0;

const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

function createGrid() {
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  updateGrid();
  addNumber();
  addNumber();
}

function updateGrid() {
  gameContainer.innerHTML = "";
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      const value = grid[i][j];
      if (value) {
        cell.textContent = value;
        cell.setAttribute("data-value", value);
      }
      gameContainer.appendChild(cell);
    }
  }
}

function addNumber() {
  let emptyCells = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === 0) emptyCells.push({ x: i, y: j });
    }
  }
  if (emptyCells.length === 0) return;
  const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[x][y] = Math.random() > 0.1 ? 2 : 4;
  updateGrid();
}

function move(direction) {
  let rotated = false;
  let flipped = false;
  if (direction === "ArrowUp") {
    grid = rotateLeft(grid);
    rotated = true;
  } else if (direction === "ArrowDown") {
    grid = rotateRight(grid);
    rotated = true;
  } else if (direction === "ArrowRight") {
    grid = flip(grid);
    flipped = true;
  }

  let newGrid = [];
  for (let row of grid) {
    let newRow = row.filter(v => v !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        score += newRow[i];
        newRow[i + 1] = 0;
      }
    }
    newRow = newRow.filter(v => v !== 0);
    while (newRow.length < gridSize) newRow.push(0);
    newGrid.push(newRow);
  }

  if (flipped) newGrid = flip(newGrid);
  if (rotated && direction === "ArrowUp") newGrid = rotateRight(newGrid);
  if (rotated && direction === "ArrowDown") newGrid = rotateLeft(newGrid);

  if (JSON.stringify(grid) !== JSON.stringify(newGrid)) {
    grid = newGrid;
    addNumber();
  }

  scoreDisplay.textContent = "Score: " + score;
  checkGameOver();
}

function rotateLeft(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

function rotateRight(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
}

function flip(matrix) {
  return matrix.map(row => row.reverse());
}

function checkGameOver() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === 0) return;
      if (i < gridSize - 1 && grid[i][j] === grid[i + 1][j]) return;
      if (j < gridSize - 1 && grid[i][j] === grid[i][j + 1]) return;
    }
  }
  alert("Game Over! Final Score: " + score);
}

document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
    move(e.key);
  }
});

restartBtn.addEventListener("click", () => {
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  createGrid();
});

createGrid();
