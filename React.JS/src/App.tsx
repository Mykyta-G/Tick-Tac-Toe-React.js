
import { useState } from 'react';

type SquareValue = 'X' | 'O' | null;

interface SquareProps {
  value: SquareValue;
  onSquareClick: () => void;
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button 
      className="w-24 h-24 text-4xl font-bold border border-gray-300 
                 bg-white hover:bg-gray-100 
                 flex items-center justify-center cursor-pointer"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

interface BoardProps {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (nextSquares: SquareValue[]) => void;
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status: string;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl font-medium text-gray-800 mb-6">
        {status}
      </div>
      <div className="grid grid-cols-3 gap-1">
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
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState<SquareValue[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: SquareValue[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((_, move) => {
    let description: string;
    if (move > 0) {
      description = `Move #${move}`;
    } else {
      return null; // Skip "Game Start" from the list
    }
    const isCurrentMove = move === currentMove;
    return (
      <li key={move}>
        <button 
          className={`w-full px-3 py-2 text-left border-b border-gray-200 hover:bg-gray-100
            ${isCurrentMove ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  }).filter(Boolean);

  return (
    <div className="h-screen bg-white overflow-hidden flex">
      {/* Left Spacer - Same width as sidebar for perfect centering */}
      <div className="w-80"></div>
      
      {/* Main Game Area - fixed width in center */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Tic Tac Toe
        </h1>
        
        {/* Game Board */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        
        {/* Game Start Button */}
        <button 
          className="mt-8 px-6 py-3 bg-blue-500 text-white font-medium hover:bg-blue-600 border border-blue-500 hover:border-blue-600"
          onClick={resetGame}
        >
          New Game
        </button>
      </div>
      
      {/* Move History Sidebar */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Move History
        </h2>
        <div className="h-full overflow-y-auto">
          <ul>
            {moves.length > 0 ? moves : (
              <li className="text-gray-500 italic">No moves yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares: SquareValue[]): SquareValue {
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
