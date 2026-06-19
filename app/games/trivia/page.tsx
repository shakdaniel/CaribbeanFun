"use client";

import { useMemo, useState } from "react";
import GameHeader from "@/components/GameHeader";
import { triviaQuestions, shuffle, TriviaQuestion } from "@/lib/games/trivia";

export default function TriviaPage() {
  const [seed, setSeed] = useState(0);
  const questions = useMemo<TriviaQuestion[]>(
    () => shuffle(triviaQuestions).slice(0, 8),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed]
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[index];

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setSeed((s) => s + 1);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <GameHeader title="Caribbean Trivia" icon="❓" />

      {done ? (
        <div className="card p-8 text-center space-y-3">
          <div className="text-6xl">
            {score >= questions.length - 1 ? "🏆" : score >= questions.length / 2 ? "🌴" : "🥥"}
          </div>
          <h2 className="text-2xl font-extrabold">
            {score} / {questions.length}
          </h2>
          <p className="text-slate-500">
            {score >= questions.length - 1
              ? "Island legend! You know your stuff."
              : score >= questions.length / 2
              ? "Nice lime! Solid Caribbean knowledge."
              : "Keep liming — you'll get there!"}
          </p>
          <button onClick={restart} className="btn-primary">
            Play again 🔁
          </button>
        </div>
      ) : (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              Question {index + 1} / {questions.length}
            </span>
            <span className="chip">Score: {score}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-island-gradient transition-all"
              style={{ width: `${(index / questions.length) * 100}%` }}
            />
          </div>

          <h2 className="text-lg font-bold">{current.q}</h2>

          <div className="space-y-2">
            {current.options.map((opt, i) => {
              const isAnswer = i === current.answer;
              const isPicked = i === selected;
              let cls =
                "w-full text-left rounded-xl border px-4 py-3 font-medium transition ";
              if (selected === null) {
                cls += "border-slate-200 hover:border-sea-400 hover:bg-sea-50";
              } else if (isAnswer) {
                cls += "border-palm-500 bg-palm-400/20 text-palm-700";
              } else if (isPicked) {
                cls += "border-red-400 bg-red-50 text-red-600";
              } else {
                cls += "border-slate-100 text-slate-400";
              }
              return (
                <button key={i} className={cls} onClick={() => choose(i)}>
                  {opt}
                  {selected !== null && isAnswer && " ✓"}
                  {selected !== null && isPicked && !isAnswer && " ✗"}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="rounded-xl bg-sea-50 p-3 text-sm text-sea-800">
              💡 {current.fact}
            </div>
          )}

          <button
            onClick={next}
            disabled={selected === null}
            className="btn-primary w-full disabled:opacity-40"
          >
            {index + 1 >= questions.length ? "See results" : "Next question →"}
          </button>
        </div>
      )}
    </div>
  );
}
