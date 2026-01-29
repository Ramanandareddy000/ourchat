import { User } from "../../types";

export interface ChatListProps {
  users: User[];
  currentChatId: number | null;
  onChatSelect: (userId: number) => void;
  messages: Record<number, any[]>;
}