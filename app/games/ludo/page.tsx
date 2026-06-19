"use client";

import { useEffect, useMemo, useState } from "react";
import GameHeader from "@/components/GameHeader";
import {
  Token,
  LColor,
  COLORS,
  COLOR_HEX,
  PATH,
  START_OFFSET,
  HOME_LANE,
  BASE_SLOTS,
  SAFE,
  initialTokens,
  cellFor,
  movableTokens,
  moveToken,
  hasWon,
  rollDie,
  chooseCpuToken,
  FINISH,
} from "@/lib/games/ludo";

const SIZE = 15;
const key = (r: number, c: number) => `${r},${c}`;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

// Precompute board cell metadata.
const startCells: Record<string, LColor> = {};
for (const color of COLORS) {
  const [r, c] = PATH[START_OFFSET[color]];
  startCells[key(r, c)] = color;
}
const pathSet = new Set(PATH.map(([r, c]) => key(r, c)));
const safeCells = new Set(
  Array.from(SAFE).map((i) => key(PATH[i][0], PATH[i][1]))
);
const homeLaneColor: Record<string, LColor> = {};
for (const color of COLORS) {
  for (const [r, c] of HOME_LANE[color]) homeLaneColor[key(r, c)] = color;
}

function baseCorner(r: number, c: number): LColor | null {
  if (r <= 5 && c <= 5) return "red";
  if (r <= 5 && c >= 9) return "green";
  if (r >= 9 && c <= 5) return "blue";
  if (r >= 9 && c >= 9) return "yellow";
  return null;
}

export default function LudoPage() {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [turnIndex, setTurnIndex] = useState(0);
  const [phase, setPhase] = useState<"await-roll" | "await-move">("await-roll");
  const [die, setDie] = useState<number | null>(null);
  const [winner, setWinner] = useState<LColor | null>(null);
  const [message, setMessage] = useState("Your turn — roll the die!");

  const turnColor = COLORS[turnIndex];
  const isHuman = turnColor === "red";
  const movable =
    phase === "await-move" && die != null
      ? movableTokens(tokens, turnColor, die)
      : [];
  const movableIds = new Set(movable.map((t) => t.id));

  const nextIndex = (i: number) => (i + 1) % 4;

  const doRoll = () => {
    const r = rollDie();
    setDie(r);
    const m = movableTokens(tokens, turnColor, r);
    if (m.length > 0) {
      setPhase("await-move");
      setMessage(
        isHuman ? `You rolled ${r} — pick a token.` : `${cap(turnColor)} rolled ${r}.`
      );
    } else {
      setMessage(`${isHuman ? "You" : cap(turnColor)} rolled ${r} — no moves.`);
      setTurnIndex((i) => nextIndex(i));
      setPhase("await-roll");
    }
  };

  const doMove = (tokenId: string) => {
    if (die == null) return;
    const res = moveToken(tokens, tokenId, die);
    setTokens(res.tokens);
    if (hasWon(res.tokens, turnColor)) {
      setWinner(turnColor);
      setMessage(`${cap(turnColor)} wins the race! 🏁`);
      return;
    }
    const extra = die === 6;
    if (extra) {
      setPhase("await-roll");
      setMessage(`${isHuman ? "You" : cap(turnColor)} rolled a 6 — go again!`);
    } else {
      setTurnIndex((i) => nextIndex(i));
      setPhase("await-roll");
    }
    setDie(null);
  };

  // CPU driver
  useEffect(() => {
    if (winner || isHuman) return;
    const t = setTimeout(() => {
      if (phase === "await-roll") doRoll();
      else if (phase === "await-move" && die != null) {
        const choice = chooseCpuToken(tokens, turnColor, die);
        if (choice) doMove(choice.id);
      }
    }, 750);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnColor, phase, die, winner, tokens]);

  const reset = () => {
    setTokens(initialTokens());
    setTurnIndex(0);
    setPhase("await-roll");
    setDie(null);
    setWinner(null);
    setMessage("Your turn — roll the die!");
  };

  // Group tokens by board cell for rendering.
  const tokensByCell = useMemo(() => {
    const map = new Map<string, Token[]>();
    for (const t of tokens) {
      const [r, c] = cellFor(t);
      const k = key(r, c);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(t);
    }
    return map;
  }, [tokens]);

  return (
    <div className="max-w-xl mx-auto">
      <GameHeader title="Ludo" icon="🎲">
        <button onClick={reset} className="btn-ghost text-sm">
          New game
        </button>
      </GameHeader>

      {/* Status bar */}
      <div className="card p-3 mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ background: COLOR_HEX[turnColor] }}
          />
          <span className="font-semibold text-sm">{message}</span>
        </div>
        <div className="flex items-center gap-2">
          <Die value={die} />
          {isHuman && phase === "await-roll" && !winner && (
            <button onClick={doRoll} className="btn-primary text-sm">
              Roll 🎲
            </button>
          )}
        </div>
      </div>

      {/* Board */}
      <div className="card p-2">
        <div
          className="grid mx-auto bg-white"
          style={{
            gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
            width: "min(92vw, 30rem)",
            aspectRatio: "1 / 1",
          }}
        >
          {Array.from({ length: SIZE * SIZE }).map((_, idx) => {
            const r = Math.floor(idx / SIZE);
            const c = idx % SIZE;
            const k = key(r, c);
            const corner = baseCorner(r, c);
            const isPath = pathSet.has(k);
            const laneColor = homeLaneColor[k];
            const isCenter = r === 7 && c === 7;
            const startColor = startCells[k];
            const isSafe = safeCells.has(k);

            let bg = "#f1f5f9";
            if (corner) bg = COLOR_HEX[corner] + "22";
            if (isPath) bg = "#ffffff";
            if (startColor) bg = COLOR_HEX[startColor] + "66";
            if (laneColor) bg = COLOR_HEX[laneColor] + "99";
            if (isCenter) bg = "#fde68a";

            const cellTokens = tokensByCell.get(k) || [];

            return (
              <div
                key={k}
                className="relative border border-slate-100"
                style={{ background: bg }}
              >
                {isSafe && !cellTokens.length && (
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] text-slate-400">
                    ★
                  </span>
                )}
                {cellTokens.length > 0 && (
                  <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-[1px] p-[1px]">
                    {cellTokens.map((t) => {
                      const clickable = isHuman && movableIds.has(t.id);
                      return (
                        <button
                          key={t.id}
                          onClick={() => clickable && doMove(t.id)}
                          className={`rounded-full border border-white shadow transition ${
                            clickable
                              ? "ring-2 ring-offset-1 ring-slate-800 cursor-pointer animate-pulse"
                              : ""
                          }`}
                          style={{
                            background: COLOR_HEX[t.color],
                            width: cellTokens.length > 1 ? "45%" : "70%",
                            height: cellTokens.length > 1 ? "45%" : "70%",
                            aspectRatio: "1 / 1",
                          }}
                          aria-label={`${t.color} token`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-3 mt-3 text-xs">
        {COLORS.map((c) => {
          const done = tokens.filter(
            (t) => t.color === c && t.progress === FINISH
          ).length;
          return (
            <span key={c} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: COLOR_HEX[c] }}
              />
              {c === "red" ? "You" : cap(c)} · {done}/4
            </span>
          );
        })}
      </div>

      {winner && (
        <div className="card p-5 mt-4 text-center">
          <div className="text-5xl mb-2">{winner === "red" ? "🏆" : "🤖"}</div>
          <h2 className="text-xl font-extrabold">
            {winner === "red" ? "You win! 🎉" : `${cap(winner)} wins`}
          </h2>
          <button onClick={reset} className="btn-primary mt-3">
            Play again
          </button>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-3 text-center">
        Roll a 6 to leave the yard and to earn an extra roll. Land on an opponent
        to send them home (★ squares are safe). Get all 4 tokens to the center to
        win.
      </p>
    </div>
  );
}

function Die({ value }: { value: number | null }) {
  return (
    <div className="w-9 h-9 rounded-lg bg-white border-2 border-slate-300 shadow flex items-center justify-center font-extrabold text-lg">
      {value ?? "–"}
    </div>
  );
}
