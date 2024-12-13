const board = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
let currentPlayer = 'X';
let gameMode = null;
let gameOver = false;

const cells = Array.from(document.querySelectorAll('.cell'));
const statusMessage = document.getElementById('status-message');
const resetButton = document.getElementById('reset-button');
const playerVsPlayerButton = document.getElementById('player-vs-player');
const playerVsComputerButton = document.getElementById('player-vs-computer');

playerVsPlayerButton.addEventListener('click', () => startGame('player-vs-player'));
playerVsComputerButton.addEventListener('click', () => startGame('player-vs-computer'));
resetButton.addEventListener('click', resetGame);

function startGame(mode) {
    gameMode = mode;
    gameOver = false;
    board.fill('1', 0, 9);
    updateBoard();
    statusMessage.textContent = `Player 1 (X) Turn`;
    resetButton.classList.add('hidden');
}

function resetGame() {
    startGame(gameMode);
    resetButton.classList.add('hidden');
}

function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
        cell.disabled = board[index] === 'X' || board[index] === 'O';
    });
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]               // Diagonals
    ];

    for (const pattern of winPatterns) {
        if (board[pattern[0]] === board[pattern[1]] && board[pattern[1]] === board[pattern[2]]) {
            return board[pattern[0]];
        }
    }

    return board.includes('1') || board.includes('2') || board.includes('3') || board.includes('4') ||
           board.includes('5') || board.includes('6') || board.includes('7') || board.includes('8') || board.includes('9') 
        ? null : 'Draw';
}

function playerMove(cellIndex) {
    if (gameOver) return;
    
    if (board[cellIndex] !== 'X' && board[cellIndex] !== 'O') {
        board[cellIndex] = currentPlayer;
        updateBoard();

        const winner = checkWin();
        if (winner) {
            gameOver = true;
            statusMessage.textContent = winner === 'X' || winner === 'O'
                ? `Player ${winner === 'X' ? '1' : '2'} wins!`
                : 'It\'s a Draw!';
            resetButton.classList.remove('hidden');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusMessage.textContent = `Player ${currentPlayer === 'X' ? '1' : '2'} Turn`;
            
            if (gameMode === 'player-vs-computer' && currentPlayer === 'O' && !gameOver) {
                computerMove();
            }
        }
    }
}

function computerMove() {
    if (gameOver) return;

    const bestMove = getBestMove();
    board[bestMove] = 'O';
    updateBoard();

    const winner = checkWin();
    if (winner) {
        gameOver = true;
        statusMessage.textContent = winner === 'X' || winner === 'O'
            ? `Player ${winner === 'X' ? '1' : '2'} wins!`
            : 'It\'s a Draw!';
        resetButton.classList.remove('hidden');
    } else {
        currentPlayer = 'X';
        statusMessage.textContent = 'Player 1 Turn';
    }
}

function getBestMove() {
    const emptyCells = board
        .map((value, index) => (value !== 'X' && value !== 'O') ? index : null)
        .filter(index => index !== null);

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => playerMove(index));
});
