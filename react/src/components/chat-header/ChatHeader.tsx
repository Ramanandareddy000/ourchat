import React, { useState } from 'react';
import { User } from '../../types';
import { Avatar } from '../avatar/Avatar';
import { KebabMenu } from '../dialog/KebabMenu';
import './ChatHeader.scss';

interface ChatHeaderProps {
  user: User;
  onBack: () => void;
  isMobile: boolean;
  onViewContact: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user, onBack, isMobile, onViewContact }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleMenuAction = (action: string) => {
    if (action === 'View Contact') {
      onViewContact();
    }
    console.log(`${action} clicked for ${user.display_name}`);
    setIsMenuOpen(false);
  };

  const menuItems = [
    { 
      label: 'View Contact', 
      icon: '👤',
      onClick: () => handleMenuAction('View Contact'),
      type: 'item' as const
    },
    { type: 'divider' as const },
    { 
      label: isMuted ? 'Unmute' : 'Mute', 
      icon: isMuted ? '🔊' : '🔇',
      onClick: () => {
        setIsMuted(!isMuted);
        setIsMenuOpen(false);
      },
      type: 'item' as const
    },
    { 
      label: 'Block', 
      icon: '🚫',
      onClick: () => handleMenuAction('Block'),
      type: 'item' as const
    },
    { 
      label: 'Delete Chat', 
      icon: '🗑️',
      onClick: () => handleMenuAction('Delete Chat'),
      type: 'item' as const
    }
  ];

  return (
    <div className="chat-header">
      <div className="header-left">
        {isMobile && (
          <button className="back-btn" onClick={onBack}>←</button>
        )}
        <div className="contact-info">
          <Avatar user={user} size={40} />
          <div className="contact-details">
            <h3>{user.display_name}</h3>
            <span>{user.last_seen}</span>
          </div>
        </div>
      </div>
      
      <div className="chat-actions">
        <button className="action-btn">📞</button>
        <button className="action-btn">📹</button>
        <KebabMenu
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen(!isMenuOpen)}
          menuItems={menuItems}
        />
      </div>
    </div>
  );
};
