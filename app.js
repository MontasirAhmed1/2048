const menu = document.getElementById('menu');
const playBtn = document.getElementById('playBtn');
const gameContainer = document.getElementById('game-container');
const gridEl = document.getElementById('grid');
const scoreEl = document.getElementById('scoreboard');
const backBtn = document.getElementById('backBtn');
const restartBtn = document.getElementById('restartBtn');
const winModal = document.getElementById('winModal');
const loseModal = document.getElementById('loseModal');
const winScore = document.getElementById('winScore');
const loseScore = document.getElementById('loseScore');
const playAgainBtn = document.getElementById('playAgainBtn');
const tryAgainBtn = document.getElementById('tryAgainBtn');

let grid = [];
let score = 0;
const size = 4;
let hasWon = false;

function initGrid() {
    grid = Array(size).fill(null).map(() => Array(size).fill(0));
    addRandomTile();
    addRandomTile();
    score = 0;
    hasWon = false;
    updateGrid();
    updateScore();
}

function addRandomTile() {
    let empty = [];
    for (let r = 0; r < size; r++)
        for (let c = 0; c < size; c++)
            if (grid[r][c] === 0) empty.push([r, c]);
    if (empty.length === 0) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function updateGrid() {
    gridEl.innerHTML = '';
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const val = grid[r][c];
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (val > 0) tile.classList.add(`tile-${val}`);
            tile.textContent = val !== 0 ? val : '';
            gridEl.appendChild(tile);
            setTimeout(() => tile.classList.add('visible'), 50);
        }
    }
}

function updateScore() {
    scoreEl.textContent = `Score: ${score}`;
}

function slide(row) {
    let arr = row.filter(v => v !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i+1]) {
            arr[i] *= 2;
            score += arr[i];
            arr[i+1] = 0;
        }
    }
    arr = arr.filter(v => v !== 0);
    while (arr.length < size) arr.push(0);
    return arr;
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < size; r++) {
        const old = [...grid[r]];
        grid[r] = slide(grid[r]);
        if (grid[r].toString() !== old.toString()) moved = true;
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let r = 0; r < size; r++) {
        const old = [...grid[r]];
        grid[r] = slide(grid[r].reverse()).reverse();
        if (grid[r].toString() !== old.toString()) moved = true;
    }
    return moved;
}

function moveUp() {
    let moved = false;
    for (let c = 0; c < size; c++) {
        let col = [];
        for (let r = 0; r < size; r++) col.push(grid[r][c]);
        const old = [...col];
        col = slide(col);
        for (let r = 0; r < size; r++) grid[r][c] = col[r];
        if (col.toString() !== old.toString()) moved = true;
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let c = 0; c < size; c++) {
        let col = [];
        for (let r = 0; r < size; r++) col.push(grid[r][c]);
        const old = [...col];
        col = slide(col.reverse()).reverse();
        for (let r = 0; r < size; r++) grid[r][c] = col[r];
        if (col.toString() !== old.toString()) moved = true;
    }
    return moved;
}

function checkWin() {
    if (hasWon) return;
    for (let r = 0; r < size; r++)
        for (let c = 0; c < size; c++)
            if (grid[r][c] === 2048) {
                hasWon = true;
                winScore.textContent = score;
                winModal.style.display = 'flex';
                return true;
            }
    return false;
}

function isGameOver() {
    for (let r = 0; r < size; r++)
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === 0) return false;
            if (c < size-1 && grid[r][c] === grid[r][c+1]) return false;
            if (r < size-1 && grid[r][c] === grid[r+1][c]) return false;
        }
    loseScore.textContent = score;
    loseModal.style.display = 'flex';
    return true;
}

// Keyboard control
document.addEventListener('keydown', e => {
    if (winModal.style.display==='flex' || loseModal.style.display==='flex') return;
    let moved=false;
    if(e.key==='ArrowLeft') moved=moveLeft();
    else if(e.key==='ArrowRight') moved=moveRight();
    else if(e.key==='ArrowUp') moved=moveUp();
    else if(e.key==='ArrowDown') moved=moveDown();
    if(moved){
        addRandomTile();
        updateGrid();
        updateScore();
        checkWin();
        isGameOver();
    }
});

// Touch control
let startX, startY;
gridEl.addEventListener('touchstart', e=>{
    const touch = e.touches[0];
    startX=touch.clientX;
    startY=touch.clientY;
});
gridEl.addEventListener('touchend', e=>{
    if (winModal.style.display==='flex' || loseModal.style.display==='flex') return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX-startX;
    const dy = touch.clientY-startY;
    let moved=false;
    if(Math.abs(dx)>Math.abs(dy)){
        if(dx>30) moved=moveRight();
        else if(dx<-30) moved=moveLeft();
    }else{
        if(dy>30) moved=moveDown();
        else if(dy<-30) moved=moveUp();
    }
    if(moved){
        addRandomTile();
        updateGrid();
        updateScore();
        checkWin();
        isGameOver();
    }
});

// Buttons
playBtn.addEventListener('click', ()=>{
    menu.style.display='none';
    gameContainer.style.display='flex';
    initGrid();
});
backBtn.addEventListener('click', ()=>{
    gameContainer.style.display='none';
    menu.style.display='flex';
});
restartBtn.addEventListener('click', ()=>initGrid());
playAgainBtn.addEventListener('click', ()=>{
    winModal.style.display='none';
    initGrid();
});
tryAgainBtn.addEventListener('click', ()=>{
    loseModal.style.display='none';
    initGrid();
});
