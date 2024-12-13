let board = ['1', '2', '3', '4', '5', '6', '7', '8', '9']; // board representation
let currentPlayer = 'X'; // Start with player X
let gameOver = false;

const cells = document.querySelectorAll('.cell');
const statusDiv = document.getElementById('status');
const resetButton = document.getElementById('resetButton');

// Update the board UI
function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}

// Check for a win or a draw
function checkWin() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }

    // Check for a draw
    if (!board.includes('1') && !board.includes('2') && !board.includes('3') && !board.includes('4') && !board.includes('5') && !board.includes('6') && !board.includes('7') && !board.includes('8') && !board.includes('9')) {
        return 'Draw';
    }

    return null; // Game is ongoing
}

// Handle cell click
function cellClick(event) {
    if (gameOver) return;

    const cellIndex = event.target.id.split('-')[1] - 1; // Get the index from the button id
    if (board[cellIndex] !== 'X' && board[cellIndex] !== 'O') {
        board[cellIndex] = currentPlayer;
        updateBoard();
        const winner = checkWin();

        if (winner) {
            gameOver = true;
            if (winner === 'Draw') {
                statusDiv.textContent = 'It\'s a draw!';
            } else {
                statusDiv.textContent = `Player ${winner} wins!`;
            }
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
        }
    }
}

// Reset the game
function resetGame() {
    board = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    currentPlayer = 'X';
    gameOver = false;
    statusDiv.textContent = '';
    updateBoard();
}

// Add event listeners to cells
cells.forEach(cell => {
    cell.addEventListener('click', cellClick);
});

// Add reset button listener
resetButton.addEventListener('click', resetGame);

// Initialize the game
updateBoard();
