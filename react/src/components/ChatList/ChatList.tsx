import React from 'react';
import { User } from '../../types';
import { Avatar } from '..';
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
      {users.map(user => (
        <div
          key={user.id}
          className={`chat-item ${currentChatId === user.id ? 'active' : ''}`}
          onClick={() => onChatSelect(user.id)}
        >
          <Avatar user={user} size={49} />
          <div className="chat-info">
            <div className="name">{user.name}</div>
            <div className="last-message">
              {messages[user.id]?.length 
                ? messages[user.id][messages[user.id].length - 1].text 
                : user.lastSeen}
            </div>
          </div>
          <div className={`status ${user.online ? '' : 'offline'}`}></div>
        </div>
      ))}
    </div>
  );
};
