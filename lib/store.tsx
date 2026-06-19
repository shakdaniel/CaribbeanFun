"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { AppData, Post, User } from "./types";
import { seedData } from "./seed";

const STORAGE_KEY = "lime.appdata.v1";

interface StoreValue {
  data: AppData;
  ready: boolean;
  currentUser: User;
  userById: (id: string) => User | undefined;
  // social actions
  addPost: (text: string, image?: string) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  toggleFriend: (userId: string) => void;
  sendMessage: (otherUserId: string, text: string) => void;
  updateProfile: (patch: Partial<User>) => void;
  resetData: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(seedData);
  const [ready, setReady] = useState(false);

  // Load from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData(JSON.parse(raw));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      }
    } catch {
      // ignore corrupt storage, fall back to seed
    }
    setReady(true);
  }, []);

  // Persist on every change (after initial load).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // storage full / unavailable — ignore
    }
  }, [data, ready]);

  const userById = useCallback(
    (id: string) => data.users.find((u) => u.id === id),
    [data.users]
  );

  const currentUser =
    data.users.find((u) => u.id === data.currentUserId) ?? data.users[0];

  const addPost = useCallback((text: string, image?: string) => {
    setData((d) => {
      const post: Post = {
        id: uid("p"),
        authorId: d.currentUserId,
        text,
        image,
        createdAt: Date.now(),
        likes: [],
        comments: [],
      };
      return { ...d, posts: [post, ...d.posts] };
    });
  }, []);

  const toggleLike = useCallback((postId: string) => {
    setData((d) => ({
      ...d,
      posts: d.posts.map((p) => {
        if (p.id !== postId) return p;
        const liked = p.likes.includes(d.currentUserId);
        return {
          ...p,
          likes: liked
            ? p.likes.filter((id) => id !== d.currentUserId)
            : [...p.likes, d.currentUserId],
        };
      }),
    }));
  }, []);

  const addComment = useCallback((postId: string, text: string) => {
    setData((d) => ({
      ...d,
      posts: d.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: uid("c"),
                  authorId: d.currentUserId,
                  text,
                  createdAt: Date.now(),
                },
              ],
            }
          : p
      ),
    }));
  }, []);

  const toggleFriend = useCallback((userId: string) => {
    setData((d) => ({
      ...d,
      friendIds: d.friendIds.includes(userId)
        ? d.friendIds.filter((id) => id !== userId)
        : [...d.friendIds, userId],
    }));
  }, []);

  const sendMessage = useCallback((otherUserId: string, text: string) => {
    setData((d) => {
      const existing = d.conversations.find(
        (c) =>
          c.participants.includes(otherUserId) &&
          c.participants.includes(d.currentUserId)
      );
      const msg = {
        id: uid("m"),
        senderId: d.currentUserId,
        text,
        createdAt: Date.now(),
      };
      if (existing) {
        return {
          ...d,
          conversations: d.conversations.map((c) =>
            c.id === existing.id
              ? { ...c, messages: [...c.messages, msg] }
              : c
          ),
        };
      }
      return {
        ...d,
        conversations: [
          ...d.conversations,
          {
            id: uid("conv"),
            participants: [d.currentUserId, otherUserId],
            messages: [msg],
          },
        ],
      };
    });
  }, []);

  const updateProfile = useCallback((patch: Partial<User>) => {
    setData((d) => ({
      ...d,
      users: d.users.map((u) =>
        u.id === d.currentUserId ? { ...u, ...patch } : u
      ),
    }));
  }, []);

  const resetData = useCallback(() => {
    setData(seedData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    } catch {
      // ignore
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{
        data,
        ready,
        currentUser,
        userById,
        addPost,
        toggleLike,
        addComment,
        toggleFriend,
        sendMessage,
        updateProfile,
        resetData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  return `${days}d`;
}
