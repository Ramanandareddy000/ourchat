export interface User {
  id: number;
  name: string;
  avatar: string;
  image?: string;
  online: boolean;
  lastSeen: string;
  phone?: string;
  about?: string;
  isGroup?: boolean;
}

export interface Message {
  id: number;
  text: string;
  time: string;
  isMe: boolean;
  sender?: string;
}

export interface AppState {
  currentChatId: number | null;
  filteredUsers: User[];
  currentTab: 'all' | 'online' | 'groups';
  searchQuery: string;
  showContactView: boolean;
  showEmojiPicker: boolean;
  showKebabMenu: boolean;
  isMobile: boolean;
  chatOpen: boolean;
}
