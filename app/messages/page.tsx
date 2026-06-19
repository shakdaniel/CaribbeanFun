"use client";

import { useState } from "react";
import { useStore, timeAgo } from "@/lib/store";
import Avatar from "@/components/Avatar";

export default function MessagesPage() {
  const { data, currentUser, userById, sendMessage } = useStore();
  const [activeOtherId, setActiveOtherId] = useState<string | null>(null);
  const [text, setText] = useState("");

  // Build a list of conversation partners (friends + existing convos).
  const partnerIds = Array.from(
    new Set([
      ...data.friendIds,
      ...data.conversations
        .map((c) => c.participants.find((p) => p !== currentUser.id))
        .filter((x): x is string => !!x),
    ])
  );

  const activeId = activeOtherId ?? partnerIds[0] ?? null;
  const activeUser = activeId ? userById(activeId) : undefined;
  const activeConvo = data.conversations.find(
    (c) =>
      activeId &&
      c.participants.includes(activeId) &&
      c.participants.includes(currentUser.id)
  );

  const send = () => {
    const t = text.trim();
    if (!t || !activeId) return;
    sendMessage(activeId, t);
    setText("");
  };

  const lastMessageOf = (otherId: string) => {
    const c = data.conversations.find(
      (c) =>
        c.participants.includes(otherId) &&
        c.participants.includes(currentUser.id)
    );
    return c?.messages[c.messages.length - 1];
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-4">Messages 💬</h1>
      <div className="card overflow-hidden grid md:grid-cols-3 h-[70vh]">
        {/* Conversation list */}
        <div className="border-r border-slate-100 overflow-y-auto">
          {partnerIds.length === 0 && (
            <p className="p-4 text-sm text-slate-400">
              Add friends to start chatting.
            </p>
          )}
          {partnerIds.map((id) => {
            const u = userById(id);
            const last = lastMessageOf(id);
            const active = id === activeId;
            return (
              <button
                key={id}
                onClick={() => setActiveOtherId(id)}
                className={`w-full text-left flex items-center gap-3 p-3 border-b border-slate-50 transition ${
                  active ? "bg-sea-50" : "hover:bg-slate-50"
                }`}
              >
                <Avatar user={u} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{u?.name}</div>
                  <div className="text-xs text-slate-400 truncate">
                    {last ? last.text : "Say hi 👋"}
                  </div>
                </div>
                {last && (
                  <span className="text-[10px] text-slate-400">
                    {timeAgo(last.createdAt)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active conversation */}
        <div className="md:col-span-2 flex flex-col">
          {activeUser ? (
            <>
              <div className="flex items-center gap-3 p-3 border-b border-slate-100">
                <Avatar user={activeUser} size={40} />
                <div>
                  <div className="font-bold">{activeUser.name}</div>
                  <div className="text-xs text-slate-400">
                    📍 {activeUser.island}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50">
                {(activeConvo?.messages ?? []).map((m) => {
                  const mine = m.senderId === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                          mine
                            ? "bg-island-gradient text-white rounded-br-sm"
                            : "bg-white border border-slate-100 rounded-bl-sm"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                {(!activeConvo || activeConvo.messages.length === 0) && (
                  <p className="text-center text-slate-400 text-sm mt-8">
                    No messages yet — break the ice! 🧊
                  </p>
                )}
              </div>

              <div className="p-3 border-t border-slate-100 flex gap-2">
                <input
                  className="input"
                  placeholder={`Message ${activeUser.name}…`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <button onClick={send} className="btn-primary">
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
