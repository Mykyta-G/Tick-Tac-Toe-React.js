
import { useState, useEffect } from 'react';

type SquareValue = 'X' | 'O' | null;

interface SquareProps {
  value: SquareValue;
  onSquareClick: () => void;
  isWinningSquare?: boolean;
}

function Square({ value, onSquareClick, isWinningSquare = false }: SquareProps) {
  return (
    <button 
      className={`w-24 h-24 text-4xl font-extrabold border-2 
                 ${isWinningSquare 
                    ? 'border-green-500 bg-green-500 shadow-lg shadow-green-500/30 scale-105' 
                    : 'border-slate-600 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700'}
                 flex items-center justify-center cursor-pointer shadow-md
                 transition-all duration-500 transform hover:scale-105`}
      onClick={onSquareClick}
    >
      <span className={isWinningSquare ? 'text-white transition-colors duration-300' : value === 'X' ? 'text-blue-400' : value === 'O' ? 'text-purple-400' : ''}>
        {value}
      </span>
    </button>
  );
}

interface BoardProps {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (nextSquares: SquareValue[]) => void;
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  const [animatedSquares, setAnimatedSquares] = useState<number[]>([]);
  
  useEffect(() => {
    const { winningLine } = calculateWinner(squares);
    if (winningLine) {
      // Reset animation
      setAnimatedSquares([]);
      
      // Animate squares one by one with a delay
      const animateSquares = async () => {
        for (let i = 0; i < winningLine.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setAnimatedSquares(prev => [...prev, winningLine[i]]);
        }
      };
      
      animateSquares();
    } else {
      setAnimatedSquares([]);
    }
  }, [squares]);

  function handleClick(i: number) {
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const { winner, winningLine } = calculateWinner(squares);
  let status: string;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function isWinningSquare(index: number): boolean {
    return animatedSquares.includes(index);
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`text-xl font-bold mb-6 px-6 py-2 rounded-full
        ${winner 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20' 
          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
        }`}>
        {status}
      </div>
      <div className="grid grid-cols-3 gap-2 p-4 bg-slate-900/50 rounded-lg shadow-xl border border-slate-700/50 backdrop-blur-sm">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isWinningSquare={isWinningSquare(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isWinningSquare={isWinningSquare(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isWinningSquare={isWinningSquare(2)} />
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isWinningSquare={isWinningSquare(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isWinningSquare={isWinningSquare(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isWinningSquare={isWinningSquare(5)} />
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isWinningSquare={isWinningSquare(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isWinningSquare={isWinningSquare(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isWinningSquare={isWinningSquare(8)} />
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
          className={`w-full px-3 py-2 text-left rounded border border-slate-700 transition-all duration-200
            ${isCurrentMove 
              ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20 border-blue-500' 
              : 'text-slate-300 hover:bg-slate-700/50 hover:border-slate-600'}`}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  }).filter(Boolean);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex flex-col items-center relative">
      {/* Main Game Area - centered */}
      <div className="flex flex-col items-center pt-8 z-10">
        <h1 className="text-9xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-70 tracking-tight py-2 px-4 transform -skew-x-3 drop-shadow-lg">
          Tic Tac Toe
        </h1>
        
        {/* Game Board */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        
        {/* Game Start Button */}
        <button 
          className="mt-10 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold uppercase tracking-wider rounded-md shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transform transition-all duration-200 border-b-4 border-blue-800 active:border-b-0 active:translate-y-0 active:shadow-inner"
          onClick={resetGame}
        >
          New Game
        </button>
      </div>
      
      {/* Move History Overlay */}
      <div className="absolute top-4 right-4 w-72 h-[80vh] bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-5 shadow-xl z-20">
        <h2 className="text-xl font-bold text-blue-400 mb-4 uppercase tracking-wider">
          Move History
        </h2>
        <div className="h-[calc(80vh-70px)] overflow-y-auto">
          <ul className="space-y-1">
            {moves.length > 0 ? moves : (
              <li className="text-slate-400 italic">No moves yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface WinnerInfo {
  winner: SquareValue;
  winningLine: number[] | null;
}

function calculateWinner(squares: SquareValue[]): WinnerInfo {
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
      return {
        winner: squares[a],
        winningLine: lines[i]
      };
    }
  }
  return {
    winner: null,
    winningLine: null
  };
}
