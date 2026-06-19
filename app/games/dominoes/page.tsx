"use client";

import { useEffect, useState } from "react";
import GameHeader from "@/components/GameHeader";
import DominoTile from "@/components/DominoTile";
import {
  GameState,
  newGame,
  legalPlays,
  playTile,
  pass,
  cpuMove,
} from "@/lib/games/dominoes";

export default function DominoesPage() {
  const [state, setState] = useState<GameState>(newGame);
  const [selected, setSelected] = useState<number | null>(null);

  const myPlays = state.winner ? [] : legalPlays(state.playerHand, state);
  const canPlayAny = myPlays.length > 0;

  // CPU turn driver
  useEffect(() => {
    if (state.turn !== "cpu" || state.winner) return;
    const t = setTimeout(() => setState((s) => cpuMove(s)), 800);
    return () => clearTimeout(t);
  }, [state]);

  const playableIndexes = new Set(myPlays.map((p) => p.index));

  const sidesFor = (index: number) =>
    myPlays.filter((p) => p.index === index).map((p) => p.side);

  const handleTileClick = (index: number) => {
    if (state.turn !== "player" || state.winner) return;
    if (!playableIndexes.has(index)) return;
    const sides = sidesFor(index);
    if (sides.length === 1) {
      setState((s) => playTile(s, "player", index, sides[0]));
      setSelected(null);
    } else {
      setSelected((cur) => (cur === index ? null : index));
    }
  };

  const playSide = (side: "left" | "right") => {
    if (selected === null) return;
    setState((s) => playTile(s, "player", selected, side));
    setSelected(null);
  };

  const reset = () => {
    setState(newGame());
    setSelected(null);
  };

  const selectedSides = selected !== null ? sidesFor(selected) : [];

  return (
    <div className="max-w-3xl mx-auto">
      <GameHeader title="Dominoes" icon="🁢">
        <button onClick={reset} className="btn-ghost text-sm">
          New game
        </button>
      </GameHeader>

      {/* CPU hand (face down) */}
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold">⚫ CPU</span>
          <span className="text-sm text-slate-400">
            {state.cpuHand.length} tiles
          </span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {state.cpuHand.map((_, i) => (
            <div
              key={i}
              className="w-7 h-12 rounded bg-slate-700 shadow-inner"
            />
          ))}
        </div>
      </div>

      {/* Board / line */}
      <div className="card p-4 mb-4 min-h-[110px] bg-palm-500/10">
        <div className="text-xs text-slate-400 mb-2">
          The table {state.line.length > 0 && `· open ends: ${state.leftEnd} … ${state.rightEnd}`}
        </div>
        {state.line.length === 0 ? (
          <p className="text-slate-400 text-center py-6">
            Empty table — make the first play.
          </p>
        ) : (
          <div className="flex gap-1 flex-wrap items-center">
            {state.line.map((p, i) => (
              <DominoTile key={i} tile={p.tile} size={26} />
            ))}
          </div>
        )}
      </div>

      {/* Status / winner */}
      {state.winner ? (
        <div className="card p-5 mb-4 text-center">
          <div className="text-5xl mb-2">
            {state.winner === "player" ? "🏆" : state.winner === "tie" ? "🤝" : "🤖"}
          </div>
          <h2 className="text-xl font-extrabold">
            {state.winner === "player"
              ? "You win! Slam the table 🎉"
              : state.winner === "tie"
              ? "It's a tie!"
              : "CPU takes the round"}
          </h2>
          <button onClick={reset} className="btn-primary mt-3">
            Play again
          </button>
        </div>
      ) : (
        <div className="mb-3 flex items-center justify-between">
          <span className="chip">
            {state.turn === "player" ? "Your turn" : "CPU thinking…"}
          </span>
          {state.turn === "player" && !canPlayAny && (
            <button
              onClick={() => setState((s) => pass(s, "player"))}
              className="btn-ghost text-sm"
            >
              No moves — Pass
            </button>
          )}
        </div>
      )}

      {/* Side picker when a tile fits both ends */}
      {selected !== null && selectedSides.length === 2 && (
        <div className="flex justify-center gap-3 mb-3">
          <button onClick={() => playSide("left")} className="btn-primary">
            ◀ Play left ({state.leftEnd})
          </button>
          <button onClick={() => playSide("right")} className="btn-primary">
            Play right ({state.rightEnd}) ▶
          </button>
        </div>
      )}

      {/* Player hand */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold">🔴 Your hand</span>
          <span className="text-sm text-slate-400">
            {state.playerHand.length} tiles
          </span>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {state.playerHand.map((tile, i) => (
            <DominoTile
              key={i}
              tile={tile}
              size={36}
              vertical
              highlight={selected === i}
              faded={state.turn === "player" && !playableIndexes.has(i)}
              onClick={() => handleTileClick(i)}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        Block dominoes (double-six). Match a tile to an open end. Empty your hand
        or have the fewest pips when the game blocks to win.
      </p>
    </div>
  );
}
