// frame resize
const frame = document.querySelector('.frame');
window.onresize = () => {
    const ratio = window.innerWidth / window.innerHeight;
    if (ratio > 8 / 13) {
        frame.style.width = `calc(${800 / 13 / ratio}% - 20px)`;
        frame.style.height = 'calc(100% - 20px)';
    }
    else {
        frame.style.width = 'calc(100% - 20px)';
        frame.style.height = `calc(${1300 / 8 * ratio}% - 20px)`;
    }
};
window.onresize();

document.querySelectorAll('.remove-this').forEach(e => e.remove());

// create rows
const rowContainer = frame.querySelector('.row-container');
const rowTemplate = rowContainer.querySelector('.row-template');
rowTemplate.remove();
let rows = [];
for (let i = 0; i < 8; i++) {
    const row = rowTemplate.cloneNode(true);
    row.classList.remove('row-template');
    rowContainer.appendChild(row);
    rows.push(row);
}

const cover = frame.querySelector('.cover');
const gameStartFrame = cover.querySelector('.game-start');
const gameOverFrame = cover.querySelector('.game-over');
const gameOverScore = gameOverFrame.querySelector('.game-over-score');

let arr = [];
let next = 1;
let score = 0;
let onGame = false;
let firstTap = true;
let wrongCell = null;
let lastTappedCell = null;

// decide where to place the chino
function initArr() {
    arr = [-1];
    for (let i = 0; i < 7; i++) {
        arr.push(Math.floor(Math.random() * 4));
    }
}
initArr();

// place chino on the board
function refreshDisplay() {
    rowContainer
        .querySelectorAll('.cell-chino-d')
        .forEach(c => c.classList.remove('cell-chino-d'));

    arr.forEach((v, i) => {
        for (let j = 0; j < 4; j++) {
            const c = rows[i].children[j];
            if (j === v) {
                c.classList.add('cell-chino');
            }
            else {
                c.classList.remove('cell-chino');
            }
        }
    });
}
refreshDisplay();

// call when user tap on the board
function clickCell(i) {
    if (!onGame) return;

    // get the cell
    const c = rows[next].children[i];
    c.classList.remove('cell-chino');

    if (arr[next] === i) {
        // correct
        c.classList.add('cell-tapped');
        lastTappedCell = c;
        next++;
        score++;
        firstTap = false;
    }
    else if (!firstTap) {
        // wrong
        c.classList.add('cell-wrong');
        wrongCell = c;
        gameOver();
    }
}

// keyboard support for pc
document.onkeydown = (e) => {
    switch (e.key) {
        case 'd':
            clickCell(0);
            break;
        case 'f':
            clickCell(1);
            break;
        case 'j':
            clickCell(2);
            break;
        case 'k':
            clickCell(3);
            break;
    }
}

// start game
function gameStart() {
    cover.classList.add('hidden');
    gameStartFrame.classList.add('hidden');
    onGame = true;
}

// game over and show score
function gameOver() {
    onGame = false;
    rowContainer
        .querySelectorAll('.cell-chino')
        .forEach(c => c.classList.add('cell-chino-d'));

    setTimeout(() => {
        gameOverScore.innerText = score;
        cover.classList.remove('hidden');
        gameOverFrame.classList.remove('hidden');
    }, 1000);
}

// restart game
function restart() {
    // hide game over frame
    cover.classList.add('hidden');
    gameOverFrame.classList.add('hidden');

    // clean up the board
    wrongCell?.classList.remove('cell-wrong');
    wrongCell = null;
    lastTappedCell?.classList.remove('cell-tapped');
    lastTappedCell = null;

    // prepare for new game
    initArr();
    refreshDisplay();

    // reset info and start game
    next = 1;
    score = 0;
    firstTap = true;
    onGame = true;
}

function setMove(pos) {
    rowContainer.style.top = `${pos * 15.384615384615385 - 23.07692307692308}%`;
}

// move other chino when the first chino is eaten
let move = 1;
setInterval(() => {
    if (move >= next) return;

    move += 0.125;
    if (move >= 2) {
        // take the bottom row
        const row = rows.shift();
        row.remove();
        row.querySelector('.cell-tapped')?.classList.remove('cell-tapped');

        // reinit the row and add to the top
        const nextCell = Math.floor(Math.random() * 4);
        arr.shift();
        arr.push(nextCell);
        row.children[nextCell].classList.add('cell-chino');
        rowContainer.appendChild(row);
        rows.push(row);

        move--;
        next--;
    }

    // refresh display
    setMove(move - 1);
}, 7);
