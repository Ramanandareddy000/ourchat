import React from 'react';
import { User } from '../../types';
import { Avatar } from '../avatar/Avatar';
import './OnlineUsers.scss';

interface OnlineUsersProps {
  users: User[];
  currentChatId: number | null;
  onChatSelect: (userId: number) => void;
}

export const OnlineUsers: React.FC<OnlineUsersProps> = ({ 
  users, 
  currentChatId, 
  onChatSelect 
}) => {
  // Filter to show only online users (for 1:1 chats, we consider all users as online for simplicity)
  // In a real app, this would be based on actual online status from the backend
  const onlineUsers = users.filter(user => !user.is_group);

  return (
    <div className="online-users-list">
      {onlineUsers.map((user) => (
        <div
          key={user.id}
          className={`online-user-item ${currentChatId === user.id ? 'active' : ''}`}
          onClick={() => onChatSelect(user.id)}
        >
          <div className="avatar-container">
            <Avatar user={user} size={49} />
          </div>
          <div className="user-info">
            <div className="name">{user.display_name}</div>
            <div className="status">{user.last_seen}</div>
          </div>
        </div>
      ))}
    </div>
  );
};