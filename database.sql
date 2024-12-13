CREATE TABLE game_state (
    game_id INTEGER PRIMARY KEY,
    board TEXT,  -- Store the board as a comma-separated string
    current_player TEXT,  -- Store the current player (X or O)
    winner TEXT  -- Store the winner (X, O, or Draw)
);
