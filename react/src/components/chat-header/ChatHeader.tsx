import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Avatar } from '../avatar/Avatar';
import { KebabMenu } from '../dialog/KebabMenu';
import { AppIcons } from '../../ui/icons';
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
  const [showLastSeen, setShowLastSeen] = useState(false);

  // Handle offline status timer - show "offline" for 15 seconds, then show last seen
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!user.online) {
      // Reset to show "offline" first
      setShowLastSeen(false);
      console.log(`ChatHeader: User ${user.display_name} is offline, showing "offline" for 15 seconds`);

      // After 15 seconds, switch to showing last seen timestamp
      timer = setTimeout(() => {
        setShowLastSeen(true);
        console.log(`ChatHeader: Switching to last seen for ${user.display_name}: ${user.last_seen}`);
      }, 15000); // 15 seconds
    } else {
      // If user comes back online, reset the state
      setShowLastSeen(false);
      console.log(`ChatHeader: User ${user.display_name} is online`);
    }

    // Cleanup timer on unmount or when user changes
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [user.online, user.id]); // Re-run when online status or user changes

  const getStatusText = () => {
    if (user.online) {
      return "online";
    }

    if (showLastSeen) {
      return user.last_seen || "last seen recently";
    }

    return "offline";
  };

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
      icon: <AppIcons.Person fontSize="small" />,
      onClick: () => handleMenuAction('View Contact'),
      type: 'item' as const
    },
    { type: 'divider' as const },
    { 
      label: isMuted ? 'Unmute' : 'Mute', 
      icon: isMuted ? <AppIcons.VolumeUp fontSize="small" /> : <AppIcons.VolumeOff fontSize="small" />,
      onClick: () => {
        setIsMuted(!isMuted);
        setIsMenuOpen(false);
      },
      type: 'item' as const
    },
    { 
      label: 'Block', 
      icon: <AppIcons.Block fontSize="small" />,
      onClick: () => handleMenuAction('Block'),
      type: 'item' as const
    },
    { 
      label: 'Delete Chat', 
      icon: <AppIcons.Delete fontSize="small" />,
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
            <span className={`status ${user.online ? 'online' : 'offline'}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="chat-actions">
        <button className="action-btn"><AppIcons.Phone fontSize="small" /></button>
        <button className="action-btn"><AppIcons.VideoCall fontSize="small" /></button>
        <KebabMenu
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen(!isMenuOpen)}
          menuItems={menuItems}
        />
      </div>
    </div>
  );
};
