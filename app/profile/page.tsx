"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import Avatar from "@/components/Avatar";
import PostCard from "@/components/PostCard";

const islands = [
  "Trinidad & Tobago",
  "Jamaica",
  "Barbados",
  "Grenada",
  "Saint Lucia",
  "Guyana",
  "St. Vincent",
  "Antigua & Barbuda",
  "Dominica",
  "The Bahamas",
  "Haiti",
  "Dominican Republic",
  "Cuba",
  "Puerto Rico",
  "St. Kitts & Nevis",
  "Belize",
];

const avatars = ["😎", "🌺", "🏝️", "🎧", "⚽", "📸", "🏏", "🦜", "🥥", "🌊", "🔥", "💃"];
const colors = ["#06b6d4", "#10b981", "#f97316", "#f59e0b", "#8b5cf6", "#ec4899", "#0ea5e9", "#ef4444"];

export default function ProfilePage() {
  const { currentUser, data, updateProfile, resetData } = useStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(currentUser);

  const myPosts = data.posts.filter((p) => p.authorId === currentUser.id);

  const save = () => {
    updateProfile(form);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner + identity */}
      <div className="card overflow-hidden">
        <div className="h-28 bg-sunset-gradient" />
        <div className="px-5 pb-5">
          <div className="-mt-10 flex items-end gap-4">
            <div className="ring-4 ring-white rounded-full">
              <Avatar user={currentUser} size={84} />
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-extrabold">{currentUser.name}</h1>
              <div className="text-sm text-slate-400">
                {currentUser.handle} · 📍 {currentUser.island}
              </div>
            </div>
            <button
              onClick={() => {
                setForm(currentUser);
                setEditing((e) => !e);
              }}
              className="ml-auto btn-ghost"
            >
              {editing ? "Cancel" : "Edit profile"}
            </button>
          </div>
          <p className="mt-3 text-slate-700">{currentUser.bio}</p>
          <div className="mt-3 flex gap-4 text-sm text-slate-500">
            <span>
              <strong className="text-slate-800">{data.friendIds.length}</strong>{" "}
              friends
            </span>
            <span>
              <strong className="text-slate-800">{myPosts.length}</strong> posts
            </span>
          </div>
        </div>
      </div>

      {/* Editor */}
      {editing && (
        <div className="card p-5 space-y-4">
          <h2 className="font-bold">Edit profile</h2>
          <div>
            <label className="text-sm font-semibold">Display name</label>
            <input
              className="input mt-1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Home island</label>
            <select
              className="input mt-1"
              value={form.island}
              onChange={(e) => setForm({ ...form, island: e.target.value })}
            >
              {islands.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Bio</label>
            <textarea
              className="input mt-1 resize-none min-h-[70px]"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Avatar</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {avatars.map((a) => (
                <button
                  key={a}
                  onClick={() => setForm({ ...form, avatar: a })}
                  className={`w-10 h-10 rounded-full text-xl transition ${
                    form.avatar === a
                      ? "ring-2 ring-sea-400 bg-sea-50"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Accent color</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-9 h-9 rounded-full transition ${
                    form.color === c ? "ring-2 ring-offset-2 ring-slate-400" : ""
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
          <button onClick={save} className="btn-primary">
            Save changes
          </button>
        </div>
      )}

      {/* My posts */}
      <section>
        <h2 className="font-bold mb-3">Your posts</h2>
        {myPosts.length === 0 ? (
          <p className="text-slate-400">
            You haven&apos;t posted yet. Head to the feed and share a vibe!
          </p>
        ) : (
          <div className="space-y-4">
            {myPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={() => {
            if (confirm("Reset all demo data back to the start?")) resetData();
          }}
          className="text-sm text-slate-400 hover:text-red-500"
        >
          Reset demo data
        </button>
      </div>
    </div>
  );
}
