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
  return (
    <div className="chat-list">
      {users.map(user => {
        const lastMessage = messages[user.id]?.length 
          ? messages[user.id][messages[user.id].length - 1].text 
          : user.last_seen;
          
        return (
          <div
            key={user.id}
            className={`chat-item ${currentChatId === user.id ? 'active' : ''}`}
            onClick={() => onChatSelect(user.id)}
          >
            <Avatar user={user} size={49} />
            <div className="chat-info">
              <div className="name">{user.display_name}</div>
              <div className="last-message">{lastMessage}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
