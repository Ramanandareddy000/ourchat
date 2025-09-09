export interface User {
  id: number;
  name: string;
  avatar: string;
  image?: string;
  lastSeen: string;
  isOnline: boolean;
}

export interface Message {
  id: number;
  text: string;
  sent: boolean;
  timestamp: string;
  userId: number;
}
