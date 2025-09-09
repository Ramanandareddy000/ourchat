import React from 'react';
import { User } from '../../types';
import { Avatar } from '../Avatar/Avatar';
import './ChatHeader.scss';

interface ChatHeaderProps {
  user: User;
  onBack: () => void;
  isMobile: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user, onBack, isMobile }) => {
  return (
    <div className="chat-header">
      <div className="header-left">
        {isMobile && (
          <button className="back-btn" onClick={onBack}>←</button>
        )}
        <div className="contact-info">
          <Avatar user={user} size={40} />
          <div className="contact-details">
            <h3>{user.name}</h3>
            <span>{user.lastSeen}</span>
          </div>
        </div>
      </div>
      
      <div className="chat-actions">
        <button className="action-btn">📞</button>
        <button className="action-btn">📹</button>
        <button className="action-btn">⋮</button>
      </div>
    </div>
  );
};
