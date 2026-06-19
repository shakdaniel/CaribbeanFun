"use client";

import { useState } from "react";
import { Post } from "@/lib/types";
import { useStore, timeAgo } from "@/lib/store";
import Avatar from "./Avatar";

export default function PostCard({ post }: { post: Post }) {
  const { userById, currentUser, toggleLike, addComment } = useStore();
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const author = userById(post.authorId);
  const liked = post.likes.includes(currentUser.id);

  const submitComment = () => {
    const t = commentText.trim();
    if (!t) return;
    addComment(post.id, t);
    setCommentText("");
    setShowComments(true);
  };

  return (
    <article className="card p-4 float-in">
      <div className="flex items-center gap-3">
        <Avatar user={author} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold truncate">{author?.name}</span>
            <span className="chip">📍 {author?.island}</span>
          </div>
          <div className="text-xs text-slate-400">
            {author?.handle} · {timeAgo(post.createdAt)}
          </div>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap leading-relaxed">{post.text}</p>
      {post.image && (
        <div className="mt-3 rounded-xl bg-sunset-gradient h-44 flex items-center justify-center text-7xl">
          {post.image}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 text-sm">
        <button
          onClick={() => toggleLike(post.id)}
          className={`btn ${
            liked
              ? "bg-sunset-500 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {liked ? "❤️" : "🤍"} {post.likes.length}
        </button>
        <button
          onClick={() => setShowComments((s) => !s)}
          className="btn-ghost"
        >
          💬 {post.comments.length}
        </button>
      </div>

      {showComments && (
        <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
          {post.comments.map((c) => {
            const ca = userById(c.authorId);
            return (
              <div key={c.id} className="flex items-start gap-2">
                <Avatar user={ca} size={32} />
                <div className="bg-slate-50 rounded-2xl px-3 py-2 text-sm">
                  <span className="font-semibold mr-1">{ca?.name}</span>
                  {c.text}
                </div>
              </div>
            );
          })}
          {post.comments.length === 0 && (
            <p className="text-sm text-slate-400">
              No comments yet — start the lime 🎉
            </p>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <Avatar user={currentUser} size={32} />
        <input
          className="input !py-2"
          placeholder="Add a comment…"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitComment()}
        />
        <button onClick={submitComment} className="btn-primary">
          Send
        </button>
      </div>
    </article>
  );
}
