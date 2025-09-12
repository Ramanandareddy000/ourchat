import React, { useState } from 'react';
import { User } from '../../types';
import { Avatar } from '../Avatar/Avatar';
import { Dialog } from '../Dialog/Dialog';
import { KebabMenu } from '../Dialog/KebabMenu';
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

  const handleMute = () => {
    setIsMuted(!isMuted);
    console.log(isMuted ? 'Unmuted' : 'Muted');
    setIsMenuOpen(false);
  };

  const handleMenuAction = (action: string) => {
    if (action === 'View Contact') {
      onViewContact();
    }
    console.log(`${action} clicked for ${user.name}`);
    setIsMenuOpen(false);
  };

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
        <button className="action-btn" onClick={() => setIsMenuOpen(true)}>⋮</button>
      </div>

      <Dialog isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} position="top-right">
        <KebabMenu
          onViewContact={() => handleMenuAction('View Contact')}
          onMute={handleMute}
          onBlock={() => handleMenuAction('Block')}
          onDelete={() => handleMenuAction('Delete Chat')}
          isMuted={isMuted}
        />
      </Dialog>
    </div>
  );
};
