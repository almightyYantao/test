export interface User {
  id: string;
  name: string;
  avatar: string;
  department: string;
  role: 'admin' | 'user';
  // "Nuclear Energy": Quota to GIVE (Resets monthly)
  giveQuota: number; 
  // "Energy Coins": Currency RECEIVED (Accumulates, used for redemption)
  walletBalance: number;
}

export interface Medal {
  id: string;
  name: string;
  icon: string; // Emoji or URL
  value: number; // Cost in Quota / Value in Coins
  description: string; // Default description
  colorBg: string;
  colorBorder: string;
  textColor: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  senderId: string;
  receiverIds: string[]; // Can award multiple people
  medalId: string;
  content: string; // SBI text
  createdAt: string;
  likes: number; // Additional points via likes
  hasLiked: boolean; // Current user liked
  comments: Comment[];
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
}

// For UI State
export enum View {
  HOME = 'HOME',
  LEADERBOARD = 'LEADERBOARD',
  CREATE = 'CREATE',
  ADMIN = 'ADMIN',
  PROFILE = 'PROFILE',
  MALL = 'MALL'
}