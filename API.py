from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Set up the database URI and initialize the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tic_tac_toe.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Create a model for storing game data
class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    board = db.Column(db.String(9), nullable=False)
    current_player = db.Column(db.String(1), nullable=False)
    winner = db.Column(db.String(1), nullable=True)

# Initialize the database (only if not exists)
@app.before_first_request
def create_tables():
    db.create_all()

# Route to start a new game
@app.route('/api/game', methods=['POST'])
def start_game():
    new_game = Game(board="123456789", current_player="X", winner=None)
    db.session.add(new_game)
    db.session.commit()
    return jsonify({"game_id": new_game.id, "board": new_game.board, "current_player": new_game.current_player})

# Route to get the current state of a game
@app.route('/api/game/<int:game_id>', methods=['GET'])
def get_game(game_id):
    game = Game.query.get_or_404(game_id)
    return jsonify({
        "game_id": game.id,
        "board": game.board,
        "current_player": game.current_player,
        "winner": game.winner
    })

# Route to make a move
@app.route('/api/game/<int:game_id>/move', methods=['POST'])
def make_move(game_id):
    game = Game.query.get_or_404(game_id)
    data = request.json
    move = int(data.get('move'))
    
    # Validate move
    if game.board[move - 1] in ['X', 'O']:
        return jsonify({"error": "Invalid move"}), 400

    # Update the board
    board_list = list(game.board)
    board_list[move - 1] = game.current_player
    game.board = ''.join(board_list)

    # Check if the move results in a win
    winner = check_winner(game.board)
    if winner:
        game.winner = winner

    # Change the player turn
    game.current_player = 'O' if game.current_player == 'X' else 'X'

    db.session.commit()

    return jsonify({
        "game_id": game.id,
        "board": game.board,
        "current_player": game.current_player,
        "winner": game.winner
    })

# Helper function to check if there's a winner
def check_winner(board):
    win_patterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
        [0, 4, 8], [2, 4, 6]               # Diagonals
    ]
    for pattern in win_patterns:
        if board[pattern[0]] == board[pattern[1]] == board[pattern[2]] and board[pattern[0]] != '1' and board[pattern[0]] != '2' and board[pattern[0]] != '3' and board[pattern[0]] != '4' and board[pattern[0]] != '5' and board[pattern[0]] != '6' and board[pattern[0]] != '7' and board[pattern[0]] != '8' and board[pattern[0]] != '9':
            return board[pattern[0]]
    return None

# Route to reset a game (for new games)
@app.route('/api/game/<int:game_id>/reset', methods=['POST'])
def reset_game(game_id):
    game = Game.query.get_or_404(game_id)
    game.board = "123456789"
    game.current_player = "X"
    game.winner = None
    db.session.commit()
    return jsonify({
        "game_id": game.id,
        "board": game.board,
        "current_player": game.current_player
    })

if __name__ == '__main__':
    app.run(debug=True)
