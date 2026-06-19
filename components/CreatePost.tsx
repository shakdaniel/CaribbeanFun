"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import Avatar from "./Avatar";

const vibes = ["🏖️", "🎶", "🍲", "🌅", "🎭", "⚽", "🏝️", "🎉", ""];

export default function CreatePost() {
  const { currentUser, addPost } = useStore();
  const [text, setText] = useState("");
  const [vibe, setVibe] = useState("");

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    addPost(t, vibe || undefined);
    setText("");
    setVibe("");
  };

  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <Avatar user={currentUser} />
        <div className="flex-1">
          <textarea
            className="input min-h-[70px] resize-none"
            placeholder={`What's the vibe today, ${currentUser.name}? 🌴`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              {vibes.map((v) => (
                <button
                  key={v || "none"}
                  onClick={() => setVibe(v)}
                  className={`w-9 h-9 rounded-full text-lg transition ${
                    vibe === v
                      ? "bg-sea-100 ring-2 ring-sea-400"
                      : "hover:bg-slate-100"
                  }`}
                  title={v ? `Vibe ${v}` : "No vibe"}
                >
                  {v || "🚫"}
                </button>
              ))}
            </div>
            <button onClick={submit} className="btn-primary">
              Post 🍋
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
