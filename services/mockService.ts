import { User, Medal, Post, Product } from '../types';

// --- Initial Data ---

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Chen',
    avatar: 'https://picsum.photos/seed/alex/100/100',
    department: 'Engineering',
    role: 'admin',
    giveQuota: 20,
    walletBalance: 150,
  },
  {
    id: 'u2',
    name: 'Sarah Lin',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    department: 'Product',
    role: 'user',
    giveQuota: 15,
    walletBalance: 320,
  },
  {
    id: 'u3',
    name: 'David Wang',
    avatar: 'https://picsum.photos/seed/david/100/100',
    department: 'Design',
    role: 'user',
    giveQuota: 5,
    walletBalance: 88,
  },
  {
    id: 'u4',
    name: 'Emily Zhao',
    avatar: 'https://picsum.photos/seed/emily/100/100',
    department: 'Marketing',
    role: 'user',
    giveQuota: 20,
    walletBalance: 210,
  }
];

export const MEDALS: Medal[] = [
  {
    id: 'm1',
    name: 'High Quality',
    icon: '💎',
    value: 2.00,
    description: 'Delivered exceptional work quality that exceeds expectations.',
    colorBg: 'bg-blue-50',
    colorBorder: 'border-blue-200',
    textColor: 'text-blue-600'
  },
  {
    id: 'm2',
    name: 'Team Player',
    icon: '🤝',
    value: 5.00,
    description: 'Collaborated effectively and supported team members selflessly.',
    colorBg: 'bg-purple-50',
    colorBorder: 'border-purple-200',
    textColor: 'text-purple-600'
  },
  {
    id: 'm3',
    name: 'Innovator',
    icon: '🚀',
    value: 10.00,
    description: 'Proposed and implemented a new idea that improved efficiency.',
    colorBg: 'bg-amber-50',
    colorBorder: 'border-amber-200',
    textColor: 'text-amber-600'
  },
  {
    id: 'm4',
    name: 'Customer First',
    icon: '❤️',
    value: 3.00,
    description: 'Went above and beyond to solve a customer issue.',
    colorBg: 'bg-rose-50',
    colorBorder: 'border-rose-200',
    textColor: 'text-rose-600'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod1',
    name: 'Coffee Voucher',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80',
    price: 50,
    stock: 20
  },
  {
    id: 'prod2',
    name: 'Company Hoodie',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80',
    price: 350,
    stock: 5
  },
  {
    id: 'prod3',
    name: 'Movie Ticket',
    image: 'https://images.unsplash.com/photo-1489599849909-5d420309736d?auto=format&fit=crop&w=300&q=80',
    price: 80,
    stock: 15
  },
  {
    id: 'prod4',
    name: 'Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=300&q=80',
    price: 1200,
    stock: 2
  },
  {
    id: 'prod5',
    name: '1 Hr Paid Leave',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
    price: 500,
    stock: 10
  },
  {
    id: 'prod6',
    name: 'Lunch with CEO',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd354ca8?auto=format&fit=crop&w=300&q=80',
    price: 2000,
    stock: 1
  }
];

export const POSTS: Post[] = [
  {
    id: 'p1',
    senderId: 'u1',
    receiverIds: ['u2'],
    medalId: 'm1',
    content: 'Sarah did an amazing job structuring the AI Coding documentation. It was clear, organized, and detailed. This will help the whole team onboard faster.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    likes: 4,
    hasLiked: false,
    comments: [
      { id: 'c1', userId: 'u3', userName: 'David Wang', content: 'Totally agree, saved me so much time!', createdAt: new Date().toISOString() }
    ]
  },
  {
    id: 'p2',
    senderId: 'u3',
    receiverIds: ['u4'],
    medalId: 'm3',
    content: 'Emily found a creative way to automate our weekly report generation using the new API. Great initiative!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    likes: 12,
    hasLiked: true,
    comments: []
  }
];

// --- Helpers ---

export const getUserById = (id: string) => USERS.find(u => u.id === id);
export const getMedalById = (id: string) => MEDALS.find(m => m.id === id);

export const calculateLeaderboard = (_period: 'week' | 'month' | 'total', allUsers: User[]) => {
    // In a real app, this would filter transaction history.
    // Here we just sort by walletBalance for demo purposes.
    return [...allUsers].sort((a, b) => b.walletBalance - a.walletBalance);
};