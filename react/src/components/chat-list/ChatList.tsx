import React from 'react';
import { User } from '../../types';
import { Avatar } from '../avatar/Avatar';
import './ChatList.scss';

interface ChatListProps {
  users: User[];
  currentChatId: number | null;
  onChatSelect: (userId: number) => void;
  messages: Record<number, any[]>;
}

export const ChatList: React.FC<ChatListProps> = ({
  users,
  currentChatId,
  onChatSelect,
  messages
}) => {
  // Filter out groups to prevent duplication - ChatList should only show individual users
  const actualUsers = users.filter(user => !user.is_group);

  return (
    <div className="chat-list">
      {actualUsers.map((user) => {
        // For conversations, we want to show the last message
        const lastMessage = messages[user.id]?.length 
          ? messages[user.id][messages[user.id].length - 1] 
          : null;
          
        const lastMessageText = lastMessage 
          ? lastMessage.text 
          : (user.is_group ? `${user.last_seen} members` : user.last_seen);
          
        return (
          <div
            key={user.id}
            className={`chat-item ${currentChatId === user.id ? 'active' : ''}`}
            onClick={() => onChatSelect(user.id)}
          >
            <Avatar user={user} size={49} />
            <div className="chat-info">
              <div className="name">{user.display_name}</div>
              <div className="last-message">{lastMessageText}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
