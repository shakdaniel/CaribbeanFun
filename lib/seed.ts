import { AppData } from "./types";

// Initial demo data so the app feels alive on first load.
// "Liming" = Caribbean term for hanging out / socializing with friends.

const now = Date.now();
const mins = (m: number) => now - m * 60 * 1000;
const hrs = (h: number) => now - h * 60 * 60 * 1000;

export const seedData: AppData = {
  currentUserId: "me",
  users: [
    {
      id: "me",
      name: "You",
      handle: "@you",
      island: "Trinidad & Tobago",
      bio: "New to Lime 🌴 Here to lime with old friends and meet new ones.",
      avatar: "😎",
      color: "#06b6d4",
    },
    {
      id: "u_marlon",
      name: "Marlon James",
      handle: "@marlon",
      island: "Jamaica",
      bio: "Soca + dancehall. Domino champion. Catch me at the next fete 🎶",
      avatar: "🎧",
      color: "#10b981",
    },
    {
      id: "u_keisha",
      name: "Keisha Charles",
      handle: "@keisha",
      island: "Barbados",
      bio: "Beach days, fish cakes, and good vibes only ☀️",
      avatar: "🌺",
      color: "#f97316",
    },
    {
      id: "u_andre",
      name: "Andre Joseph",
      handle: "@dre",
      island: "Grenada",
      bio: "Spice isle to the world. Football and Ludo on weekends.",
      avatar: "⚽",
      color: "#f59e0b",
    },
    {
      id: "u_simone",
      name: "Simone Baptiste",
      handle: "@simone",
      island: "Saint Lucia",
      bio: "Pitons in the back, callaloo on the stove 🍲",
      avatar: "🏝️",
      color: "#8b5cf6",
    },
    {
      id: "u_ravi",
      name: "Ravi Persad",
      handle: "@ravi",
      island: "Guyana",
      bio: "Cricket lover. Best curry in the Caribbean, fight me 🏏",
      avatar: "🏏",
      color: "#0ea5e9",
    },
    {
      id: "u_tamika",
      name: "Tamika Greaves",
      handle: "@tami",
      island: "St. Vincent",
      bio: "Hiking La Soufrière. Photographer of island life 📸",
      avatar: "📸",
      color: "#ec4899",
    },
  ],
  friendIds: ["u_marlon", "u_keisha"],
  posts: [
    {
      id: "p1",
      authorId: "u_marlon",
      text: "Who lining up for Carnival Monday?? 🇯🇲 The road is calling! Drop your section in the comments 🎉",
      image: "🎭",
      createdAt: mins(24),
      likes: ["u_keisha", "u_andre", "me"],
      comments: [
        {
          id: "c1",
          authorId: "u_keisha",
          text: "Me me me! Already have my costume 💃",
          createdAt: mins(18),
        },
      ],
    },
    {
      id: "p2",
      authorId: "u_keisha",
      text: "Sunday beach lime at Miami Beach, Bridgetown. Bring the cooler, I have the speaker 🔊🏖️",
      image: "🏖️",
      createdAt: hrs(3),
      likes: ["u_marlon", "u_simone"],
      comments: [],
    },
    {
      id: "p3",
      authorId: "u_andre",
      text: "Lost three games of dominoes in a row tonight. The table was NOT kind to me 😤🁢",
      createdAt: hrs(6),
      likes: ["u_ravi", "u_marlon", "u_tamika"],
      comments: [
        {
          id: "c2",
          authorId: "u_marlon",
          text: "Come Lime and play me online, I'll go easy 😂",
          createdAt: hrs(5),
        },
      ],
    },
    {
      id: "p4",
      authorId: "u_simone",
      text: "Made green fig and saltfish this morning. Sunday done right 🍌🐟 What's cooking on your island?",
      image: "🍲",
      createdAt: hrs(9),
      likes: ["u_keisha", "me"],
      comments: [],
    },
    {
      id: "p5",
      authorId: "u_tamika",
      text: "Caught this sunrise over the Grenadines. No filter needed 🌅",
      image: "🌅",
      createdAt: hrs(20),
      likes: ["u_simone", "u_andre", "u_ravi", "u_keisha"],
      comments: [],
    },
  ],
  conversations: [
    {
      id: "conv_marlon",
      participants: ["me", "u_marlon"],
      messages: [
        {
          id: "m1",
          senderId: "u_marlon",
          text: "Yow! Welcome to Lime 🍋 long time no see!",
          createdAt: hrs(2),
        },
        {
          id: "m2",
          senderId: "me",
          text: "Marlon! Good to reconnect man. We need a domino rematch 😄",
          createdAt: hrs(1),
        },
        {
          id: "m3",
          senderId: "u_marlon",
          text: "Say no more. Hit me up in the Games tab!",
          createdAt: mins(40),
        },
      ],
    },
    {
      id: "conv_keisha",
      participants: ["me", "u_keisha"],
      messages: [
        {
          id: "m4",
          senderId: "u_keisha",
          text: "You coming to the beach lime Sunday? 🏖️",
          createdAt: hrs(4),
        },
      ],
    },
  ],
};
