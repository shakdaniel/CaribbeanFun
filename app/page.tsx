"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";

export default function FeedPage() {
  const { data, ready } = useStore();

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Main feed */}
      <div className="md:col-span-2 space-y-4">
        <div className="rounded-2xl bg-island-gradient text-white p-5 shadow">
          <h1 className="text-2xl font-extrabold">Welcome to the lime 🌴</h1>
          <p className="opacity-90">
            Share a vibe, reconnect with friends, and play some games.
          </p>
        </div>

        <CreatePost />

        {!ready ? (
          <p className="text-center text-slate-400 py-8">Loading the feed…</p>
        ) : (
          data.posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>

      {/* Sidebar */}
      <aside className="space-y-4">
        <div className="card p-4">
          <h2 className="font-bold mb-2">🎲 Quick play</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: "/games/dominoes", label: "Dominoes", icon: "🁢" },
              { href: "/games/ludo", label: "Ludo", icon: "🎲" },
              { href: "/games/checkers", label: "Checkers", icon: "🔴" },
              { href: "/games/trivia", label: "Trivia", icon: "❓" },
            ].map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="rounded-xl bg-slate-50 hover:bg-sea-50 p-3 text-center font-semibold text-sm transition"
              >
                <div className="text-2xl">{g.icon}</div>
                {g.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h2 className="font-bold mb-2">🤝 People to lime with</h2>
          <div className="space-y-2 text-sm">
            {data.users
              .filter(
                (u) => u.id !== data.currentUserId && !data.friendIds.includes(u.id)
              )
              .slice(0, 3)
              .map((u) => (
                <div key={u.id} className="flex items-center gap-2">
                  <span className="text-lg">{u.avatar}</span>
                  <span className="font-semibold">{u.name}</span>
                  <span className="text-slate-400 text-xs">{u.island}</span>
                </div>
              ))}
          </div>
          <Link
            href="/friends"
            className="mt-3 block text-center btn-ghost text-sm"
          >
            Find friends →
          </Link>
        </div>
      </aside>
    </div>
  );
}
