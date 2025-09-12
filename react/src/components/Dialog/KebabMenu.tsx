import React from 'react';
import './KebabMenu.scss';

interface KebabMenuProps {
  onViewContact: () => void;
  onMute: () => void;
  onBlock: () => void;
  onDelete: () => void;
  isMuted: boolean;
}

export const KebabMenu: React.FC<KebabMenuProps> = ({ 
  onViewContact, 
  onMute, 
  onBlock, 
  onDelete,
  isMuted
}) => {
  return (
    <div className="kebab-menu">
      <button className="menu-item" onClick={onViewContact}>
        View Contact
      </button>
      <button className="menu-item" onClick={onMute}>
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
      <button className="menu-item" onClick={onBlock}>
        Block
      </button>
      <button className="menu-item danger" onClick={onDelete}>
        Delete Chat
      </button>
    </div>
  );
};
