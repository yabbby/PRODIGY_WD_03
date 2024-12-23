import React, { useState, useEffect } from "react";

// Helper function to determine the winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// Minimax algorithm to determine the best move
function minimax(squares, depth, isMaximizingPlayer) {
  const winner = calculateWinner(squares);
  if (winner === "X") return -10;
  if (winner === "O") return 10;
  if (!squares.includes(null)) return 0; // Tie

  if (isMaximizingPlayer) {
    let best = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = "O"; // Computer's move
        best = Math.max(best, minimax(squares, depth + 1, false));
        squares[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = "X"; // Player's move
        best = Math.min(best, minimax(squares, depth + 1, true));
        squares[i] = null;
      }
    }
    return best;
  }
}

// Function to determine the best move for the computer
function findBestMove(squares) {
  let bestVal = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = "O"; // Try this move
      let moveVal = minimax(squares, 0, false);
      squares[i] = null; // Undo move

      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }
  return bestMove;
}

const TicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Update the game state after each move
  const handleClick = (index) => {
    if (gameOver || squares[index] || !isPlayerTurn) return; // Ignore if game is over, square is filled, or it's not the player's turn

    const newSquares = squares.slice();
    newSquares[index] = "X"; // Player's move
    setSquares(newSquares);

    // Check if player has won
    const currentWinner = calculateWinner(newSquares);
    if (currentWinner) {
      setWinner(currentWinner);
      setGameOver(true);
      return;
    }

    // If the player moves, let the computer take its turn
    setIsPlayerTurn(false);
  };

  // Trigger computer's move after player's move
  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      // Find the best move for the computer
      const bestMove = findBestMove(squares);
      const newSquares = squares.slice();
      newSquares[bestMove] = "O"; // Computer's move
      setSquares(newSquares);

      // Check if the computer has won
      const currentWinner = calculateWinner(newSquares);
      if (currentWinner) {
        setWinner(currentWinner);
        setGameOver(true);
      } else {
        setIsPlayerTurn(true); // Switch back to player's turn
      }
    }
  }, [isPlayerTurn, squares, gameOver]); // Effect runs when the player's turn ends

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      <div className="status">
        {gameOver
          ? `Winner: ${winner}`
          : isPlayerTurn
          ? "Player's Turn (X)"
          : "Computer's Turn (O)"}
      </div>
      <div className="board">
        {squares.map((value, index) => (
          <div
            key={index}
            className="square"
            onClick={() => handleClick(index)}
          >
            {value}
          </div>
        ))}
      </div>
      <button className="reset" onClick={resetGame}>Restart Game</button>
    </div>
  );
};

export default TicTacToe;
