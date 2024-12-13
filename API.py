import sqlite3

# Initialize SQLite database
conn = sqlite3.connect('tic_tac_toe.db')
cursor = conn.cursor()

# Create a table to store game data
cursor.execute('''
CREATE TABLE IF NOT EXISTS game_state (
    game_id INTEGER PRIMARY KEY,
    board TEXT,
    current_player TEXT,
    winner TEXT
)
''')
conn.commit()

# Function to save game state
def save_game_state(game_id, board, current_player, winner=None):
    cursor.execute('''
    INSERT INTO game_state (game_id, board, current_player, winner)
    VALUES (?, ?, ?, ?)
    ''', (game_id, ','.join(board), current_player, winner))
    conn.commit()

# Function to load game state
def load_game_state(game_id):
    cursor.execute('SELECT * FROM game_state WHERE game_id = ?', (game_id,))
    row = cursor.fetchone()
    if row:
        return row
    return None

# Close the connection when done
conn.close()
