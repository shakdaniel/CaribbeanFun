// Core domain types for the Lime app.

export interface User {
  id: string;
  name: string;
  handle: string; // e.g. @sunshine
  island: string; // home country / island
  bio: string;
  avatar: string; // emoji or initial-based avatar seed
  color: string; // accent color for avatar background
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: number;
}

export interface Post {
  id: string;
  authorId: string;
  text: string;
  image?: string; // optional emoji "vibe" or url
  createdAt: number;
  likes: string[]; // user ids who liked
  comments: Comment[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  // participant user ids (always includes the current user)
  participants: string[];
  messages: Message[];
}

export interface AppData {
  currentUserId: string;
  users: User[];
  posts: Post[];
  // friendIds connected to the current user
  friendIds: string[];
  conversations: Conversation[];
}
