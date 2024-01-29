import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <>
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    </>
  );
}

function Board({ xTurn, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || checkWin(squares)) return;

    const nextSquare = squares.slice();

    nextSquare[i] = xTurn ? "X" : "O";

    onPlay(nextSquare);
  }

  const winner = checkWin(squares);
  let status = " ";

  if (winner) {
    status = winner + " WIN";
  } else {
    status = "Player " + (xTurn ? "X" : "O") + " Turn";
  }
  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currrentMove, setCurrrentMove] = useState(0);
  const xTurn = currrentMove % 2 === 0;
  const currentSquare = history[currrentMove];
  console.log(currentSquare);


function jumpTo(nextMove){
  setCurrrentMove(nextMove);
}




  function handlePlay(nextSquare) {
    const nextHistory = [...history.slice(0 , currrentMove + 1), nextSquare]
    setHistory(nextHistory);
    setCurrrentMove(nextHistory.length - 1);
   }

  const moves = history.map((squares, move) => {
    let desc = " ";
    if (move > 0) {
      desc = "go to move # " + move;
    } else {
      desc = "go to start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });
  return (
    <div className="game">
      <div className="game-board">
        <Board xTurn={xTurn} squares={currentSquare} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }

  return false;
}
