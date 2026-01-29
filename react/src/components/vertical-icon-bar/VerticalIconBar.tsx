import React, { useState } from 'react';
import { 
  Chat as ChatIcon, 
  Group as GroupIcon, 
  Settings as SettingsIcon,
  Person as ProfileIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { Avatar } from '../avatar';
import { useAuth } from '../../modules/auth';

interface VerticalIconBarProps {
  activeIcon: 'chats' | 'status' | 'groups' | 'settings' | 'profile';
  onIconClick: (icon: 'chats' | 'status' | 'groups' | 'settings' | 'profile') => void;
}

export const VerticalIconBar: React.FC<VerticalIconBarProps> = ({ 
  activeIcon, 
  onIconClick
}) => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const { user } = useAuth();

  const icons = [
    { id: 'chats', icon: <ChatIcon />, label: 'Chats' },
    { id: 'status', icon: <NotificationsIcon />, label: 'Notifications' },
    { id: 'groups', icon: <GroupIcon />, label: 'Groups' },
  ];

  const topIcons = icons.slice(0, 3);

  return (
    <div className="vertical-icon-bar">
      <div className="icon-group top-icons">
        {topIcons.map(({ id, icon, label }) => (
          <div
            key={id}
            className={`icon-container ${activeIcon === id ? 'active' : ''}`}
            onClick={() => onIconClick(id as 'chats' | 'status' | 'groups' | 'settings' | 'profile')}
            onMouseEnter={() => setHoveredIcon(id)}
            onMouseLeave={() => setHoveredIcon(null)}
            title={label}
          >
            {icon}
            {hoveredIcon === id && (
              <div className="tooltip">{label}</div>
            )}
          </div>
        ))}
      </div>
      
      <div className="icon-group bottom-icons">
        <div
          className={`icon-container ${activeIcon === 'profile' ? 'active' : ''}`}
          onClick={() => onIconClick('profile')}
          onMouseEnter={() => setHoveredIcon('profile')}
          onMouseLeave={() => setHoveredIcon(null)}
          title="Profile"
        >
          {user ? (
            <div className="profile-avatar-icon">
              <Avatar user={user} size={24} />
            </div>
          ) : (
            <ProfileIcon />
          )}
          {hoveredIcon === 'profile' && (
            <div className="tooltip">Profile</div>
          )}
        </div>
        <div
          className={`icon-container ${activeIcon === 'settings' ? 'active' : ''}`}
          onClick={() => onIconClick('settings')}
          onMouseEnter={() => setHoveredIcon('settings')}
          onMouseLeave={() => setHoveredIcon(null)}
          title="Settings"
        >
          <SettingsIcon />
          {hoveredIcon === 'settings' && (
            <div className="tooltip">Settings</div>
          )}
        </div>
      </div>
    </div>
  );
};