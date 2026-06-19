"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import Avatar from "@/components/Avatar";

export default function FriendsPage() {
  const { data, toggleFriend } = useStore();
  const [q, setQ] = useState("");

  const others = data.users.filter((u) => u.id !== data.currentUserId);
  const query = q.trim().toLowerCase();
  const filtered = others.filter(
    (u) =>
      !query ||
      u.name.toLowerCase().includes(query) ||
      u.island.toLowerCase().includes(query) ||
      u.handle.toLowerCase().includes(query)
  );

  const friends = filtered.filter((u) => data.friendIds.includes(u.id));
  const suggestions = filtered.filter((u) => !data.friendIds.includes(u.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Find your people 🤝</h1>
        <p className="text-slate-500">
          Reconnect with old friends and meet new ones across the islands.
        </p>
      </div>

      <input
        className="input"
        placeholder="Search by name, island, or @handle…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {friends.length > 0 && (
        <section>
          <h2 className="font-bold mb-3">
            Your friends{" "}
            <span className="text-slate-400 font-normal">
              ({friends.length})
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {friends.map((u) => (
              <PersonCard
                key={u.id}
                user={u}
                isFriend
                onToggle={() => toggleFriend(u.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-bold mb-3">Suggested for you</h2>
        {suggestions.length === 0 ? (
          <p className="text-slate-400">No one new to show right now.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {suggestions.map((u) => (
              <PersonCard
                key={u.id}
                user={u}
                onToggle={() => toggleFriend(u.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PersonCard({
  user,
  isFriend,
  onToggle,
}: {
  user: import("@/lib/types").User;
  isFriend?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <Avatar user={user} size={52} />
      <div className="min-w-0 flex-1">
        <div className="font-bold truncate">{user.name}</div>
        <div className="text-xs text-slate-400">
          {user.handle} · 📍 {user.island}
        </div>
        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{user.bio}</p>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={onToggle}
          className={isFriend ? "btn-ghost text-sm" : "btn-primary text-sm"}
        >
          {isFriend ? "Friends ✓" : "Connect +"}
        </button>
        <Link href="/messages" className="btn-ghost text-sm">
          Message
        </Link>
      </div>
    </div>
  );
}
