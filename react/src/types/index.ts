export interface User {
  id: number;
  username: string;
  display_name: string;
  avatar_url?: string;
  image?: string;
  online?: boolean;
  last_seen?: string;
  phone?: string;
  about?: string;
  is_group?: boolean;
  created_at?: string;
  updated_at?: string;
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
