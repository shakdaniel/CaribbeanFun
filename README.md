# 🍋 Lime — *Where the islands connect*

Lime is a Caribbean-themed social platform and games hub. The name comes from
*"liming"* — the Caribbean term for hanging out and socializing with friends.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS**.

## ✨ Features

### Social
- **Feed** — share posts with a "vibe" emoji, like, and comment.
- **Find friends** — search people by name, island, or handle and connect.
- **Profiles** — editable profile with home island, bio, avatar, and accent color.
- **Messaging** — direct chats with your connections.

### Games
- **Dominoes** 🁢 — block double-six dominoes, head-to-head vs the CPU.
- **Ludo** 🎲 — classic 4-player race (you vs 3 CPUs) with captures and safe squares.
- **Checkers** 🔴 — English draughts vs the CPU, with mandatory captures and kings.
- **Caribbean Trivia** ❓ — quiz on island music, food, sport, and culture.

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve the production build
```

## 🗂️ Project structure

```
app/
  page.tsx              # Feed (home)
  friends/             # Find friends
  messages/            # Direct messages
  profile/             # Profile + editor
  games/               # Games hub
    dominoes/ ludo/ checkers/ trivia/
components/             # Navbar, Avatar, PostCard, CreatePost, DominoTile, GameHeader
lib/
  types.ts             # Domain types
  store.tsx            # App state (React context, persisted to localStorage)
  seed.ts              # Demo users, posts, conversations
  games/               # Pure game engines (dominoes, ludo, checkers, trivia)
```

## 💾 Data & persistence

This first version is **frontend-only**: all social data lives in React state and
is persisted to the browser's `localStorage` (seeded with demo content on first
load). This keeps the app runnable with zero backend setup.

The data layer is isolated in `lib/store.tsx`, so swapping in real API routes +
a database (e.g. Postgres/Prisma) later is a contained change. You can reset the
demo data anytime from the **Profile** page.

## 🎨 Theme

A vibrant Caribbean palette — sea turquoise, palm green, mango, and sunset
orange — defined in `tailwind.config.ts`.

## 🛣️ Roadmap ideas

- Real accounts & backend (auth, database, API routes)
- Online multiplayer for the games (WebSockets)
- Image/photo uploads in posts
- Notifications and friend requests
- Native mobile app (React Native / Expo) sharing the same API
