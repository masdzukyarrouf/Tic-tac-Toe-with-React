import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button
      onClick={onSquareClick}
      className="w-24 h-24 text-4xl font-bold flex items-center justify-center border border-gray-400 hover:bg-gray-100 transition-colors"
    >
      {value}
    </button>
  );
}

function Board({ xTurn, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || checkWin(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xTurn ? "X" : "O";
    onPlay(nextSquares);
  }

  const result = checkWin(squares);
  const winner = result?.winner;
  const line = result?.line;
  const status = winner
    ? `${winner} Wins!`
    : `Player ${xTurn ? "X" : "O"}'s Turn`;

  return (
    <div className="relative flex flex-col items-center">
      <div className="text-xl font-semibold mb-4">{status}</div>

      <div className="grid grid-cols-3 relative">
        {squares.map((val, i) => (
          <Square key={i} value={val} onSquareClick={() => handleClick(i)} />
        ))}

        {line && (
          <div
            className={`absolute pointer-events-none bg-red-500`}
            style={{
              width: getLineWidth(line),
              height: "6px",
              transform: getLineTransform(line),
              top: getLinePosition(line).top,
              left: getLinePosition(line).left,
            }}
          ></div>
        )}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xTurn = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center mt-10 gap-8">
      <Board xTurn={xTurn} squares={currentSquares} onPlay={handlePlay} />
      <div className="game-info mt-6 md:mt-0">
        <ol>
          {history.map((_, move) => (
            <li key={move}>
              <button
                onClick={() => jumpTo(move)}
                className="text-sm font-medium text-blue-600 hover:underline mt-1"
              >
                {move === 0 ? "Go to Start" : `Go to Move #${move}`}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function checkWin(squares) {
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

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function getLineWidth(line) {
  const [a, , c] = line;
  const squareSize = 96;
  const gap = 0; // Assuming no gap between squares
  
  // Horizontal and vertical lines span 3 squares
  const straightLineLength = 3 * squareSize + 2 * gap;
  
  // Diagonal lines use Pythagorean theorem
  const diagonalLength = Math.sqrt(Math.pow(straightLineLength, 2) + Math.pow(straightLineLength, 2));
  
  if ((a === 0 && c === 2) || (a === 3 && c === 5) || (a === 6 && c === 8) ||
      (a === 0 && c === 6) || (a === 1 && c === 7) || (a === 2 && c === 8)) {
    return `${straightLineLength}px`;
  }
  
  return `${diagonalLength}px`;
}

function getLineTransform(line) {
  const [a, , c] = line;
  const squareSize = 96;
  const boardSize = 288;
  
  if ((a === 0 && c === 2) || (a === 3 && c === 5) || (a === 6 && c === 8)) {
    return "rotate(0deg)";
  }
  
  if ((a === 0 && c === 6) || (a === 1 && c === 7) || (a === 2 && c === 8)) {
    return "rotate(90deg)";
  }
  
  if (a === 0 && c === 8) {
    return "rotate(45deg)";
  }
  if (a === 2 && c === 6) {
    return "rotate(-45deg)";
  }
  
  return "";
}

function getLinePosition(line) {
  const [a, , c] = line;
  const squareSize = 96;
  const boardSize = 288;
  const halfSquare = squareSize / 2;
  
  // Horizontal lines
  if (a === 0 && c === 2) return { top: `${halfSquare}px`, left: "0px" };
  if (a === 3 && c === 5) return { top: `${squareSize + halfSquare}px`, left: "0px" };
  if (a === 6 && c === 8) return { top: `${2 * squareSize + halfSquare}px`, left: "0px" };
  
  // Vertical lines  
  if (a === 0 && c === 6) return { top: "0px", left: `${halfSquare}px` };
  if (a === 1 && c === 7) return { top: "0px", left: `${squareSize + halfSquare}px` };
  if (a === 2 && c === 8) return { top: "0px", left: `${2 * squareSize + halfSquare}px` };
  
  // Diagonal lines - need to be centered
  if (a === 0 && c === 8) {
    return { top: "0px", left: "0px" };
  }
  if (a === 2 && c === 6) {
    return { top: "0px", left: "0px" };
  }
  
  return { top: "0px", left: "0px" };
}