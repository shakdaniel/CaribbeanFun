"use client";

import { useEffect, useState } from "react";
import GameHeader from "@/components/GameHeader";
import {
  Board,
  Move,
  initialBoard,
  isDark,
  legalMoves,
  movesFrom,
  applyMove,
  chooseCpuMove,
  winner,
  SIZE,
} from "@/lib/games/checkers";

export default function CheckersPage() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<"r" | "b">("r");
  const [thinking, setThinking] = useState(false);

  const win = winner(board, turn);
  const myMoves = turn === "r" && !win ? legalMoves(board, "r") : [];
  const targets = selected ? movesFrom(board, "r", selected[0], selected[1]) : [];

  // CPU turn
  useEffect(() => {
    if (turn !== "b" || win) return;
    setThinking(true);
    const t = setTimeout(() => {
      const move = chooseCpuMove(board);
      if (move) {
        setBoard((b) => applyMove(b, move));
      }
      setTurn("r");
      setThinking(false);
    }, 600);
    return () => clearTimeout(t);
  }, [turn, board, win]);

  const onSquare = (r: number, c: number) => {
    if (turn !== "r" || win) return;
    const piece = board[r][c];

    // selecting one of my pieces that has a legal move
    if (piece?.color === "r" && myMoves.some((m) => m.from[0] === r && m.from[1] === c)) {
      setSelected([r, c]);
      return;
    }

    // moving to a target square
    if (selected) {
      const move = targets.find((m) => m.to[0] === r && m.to[1] === c);
      if (move) {
        setBoard((b) => applyMove(b, move));
        setSelected(null);
        setTurn("b");
      }
    }
  };

  const reset = () => {
    setBoard(initialBoard());
    setSelected(null);
    setTurn("r");
  };

  const isTarget = (r: number, c: number) =>
    targets.some((m) => m.to[0] === r && m.to[1] === c);
  const canSelect = (r: number, c: number) =>
    turn === "r" && myMoves.some((m) => m.from[0] === r && m.from[1] === c);

  return (
    <div className="max-w-lg mx-auto">
      <GameHeader title="Checkers" icon="🔴">
        <button onClick={reset} className="btn-ghost text-sm">
          New game
        </button>
      </GameHeader>

      <div className="card p-3">
        <div className="flex items-center justify-between px-2 pb-3 text-sm font-semibold">
          <span className={turn === "r" ? "text-sea-600" : "text-slate-400"}>
            🔴 You {turn === "r" && !win ? "— your move" : ""}
          </span>
          <span className={turn === "b" ? "text-sunset-600" : "text-slate-400"}>
            ⚫ CPU {thinking ? "thinking…" : ""}
          </span>
        </div>

        <div
          className="grid mx-auto rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
            width: "min(90vw, 28rem)",
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const dark = isDark(r, c);
              const sel = selected && selected[0] === r && selected[1] === c;
              const target = isTarget(r, c);
              const selectable = canSelect(r, c);
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => onSquare(r, c)}
                  className="relative flex items-center justify-center aspect-square"
                  style={{
                    background: dark ? "#0e7490" : "#fef3c7",
                    cursor: selectable || target ? "pointer" : "default",
                  }}
                >
                  {target && (
                    <span className="absolute w-1/3 h-1/3 rounded-full bg-palm-400/80" />
                  )}
                  {cell && (
                    <span
                      className={`w-3/4 h-3/4 rounded-full flex items-center justify-center text-lg font-bold shadow-md transition ${
                        sel ? "ring-4 ring-mango-400" : ""
                      } ${selectable ? "ring-2 ring-white/70" : ""}`}
                      style={{
                        background:
                          cell.color === "r"
                            ? "radial-gradient(circle at 30% 30%, #f87171, #b91c1c)"
                            : "radial-gradient(circle at 30% 30%, #475569, #0f172a)",
                        color: "#fde68a",
                      }}
                    >
                      {cell.king ? "♔" : ""}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {win && (
        <div className="card p-5 mt-4 text-center">
          <div className="text-5xl mb-2">{win === "r" ? "🏆" : "🤖"}</div>
          <h2 className="text-xl font-extrabold">
            {win === "r" ? "You win! Crowned champion 👑" : "CPU takes this one"}
          </h2>
          <button onClick={reset} className="btn-primary mt-3">
            Play again
          </button>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-3 text-center">
        Tap a highlighted piece, then a green dot to move. Captures are mandatory.
        Reach the far row to crown a king ♔.
      </p>
    </div>
  );
}
