export interface User {
  id: number;
  name: string;
  avatar: string;
  image: string;
  online: boolean;
  lastSeen: string;
  phone: string;
}

export const users: User[] = [
  { 
    id: 1, 
    name: "Alice Johnson", 
    avatar: "A", 
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online",
    phone: "+1 (555) 123-4567"
  },
  { 
    id: 2, 
    name: "Bob Smith", 
    avatar: "B", 
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen 2 hours ago",
    phone: "+1 (555) 234-5678"
  },
  { 
    id: 3, 
    name: "Carol Davis", 
    avatar: "C", 
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online",
    phone: "+1 (555) 345-6789"
  },
  { 
    id: 4, 
    name: "David Wilson", 
    avatar: "D", 
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen yesterday",
    phone: "+1 (555) 456-7890"
  },
  { 
    id: 5, 
    name: "Emma Brown", 
    avatar: "E", 
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online",
    phone: "+1 (555) 567-8901"
  },
  { 
    id: 6, 
    name: "Frank Miller", 
    avatar: "F", 
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen 5 minutes ago",
    phone: "+1 (555) 678-9012"
  },
  { 
    id: 7, 
    name: "Grace Lee", 
    avatar: "G", 
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online",
    phone: "+1 (555) 789-0123"
  },
  { 
    id: 8, 
    name: "Henry Clark", 
    avatar: "H", 
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen 1 hour ago",
    phone: "+1 (555) 890-1234"
  },
  { 
    id: 9, 
    name: "Ivy Rodriguez", 
    avatar: "I", 
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online",
    phone: "+1 (555) 901-2345"
  },
  { 
    id: 10, 
    name: "Jack Thompson", 
    avatar: "J", 
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen 3 days ago",
    phone: "+1 (555) 012-3456"
  },
  { 
    id: 11, 
    name: "Kate Anderson", 
    avatar: "K", 
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online",
    phone: "+1 (555) 123-4567"
  },
  { 
    id: 12, 
    name: "Liam Garcia", 
    avatar: "L", 
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen 30 minutes ago",
    phone: "+1 (555) 234-5678"
  }
];
