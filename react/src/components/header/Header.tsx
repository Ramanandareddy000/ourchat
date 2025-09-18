import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.scss';
import { useAuth } from '../../modules/auth';
import { KebabMenu } from '../dialog';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };
  
  const menuItems = [
    { 
      label: 'Chats', 
      onClick: () => handleNavigation('/') 
    },
    { 
      label: 'Notifications', 
      onClick: () => handleNavigation('/notifications') 
    },
    { 
      label: 'Groups', 
      onClick: () => handleNavigation('/groups') 
    },
    { type: 'divider' },
    { 
      label: 'Profile', 
      onClick: () => handleNavigation('/profile') 
    },
    { 
      label: 'Settings', 
      onClick: () => handleNavigation('/settings') 
    },
    { type: 'divider' },
    { 
      label: 'Logout', 
      onClick: () => {
        console.log('Logout clicked');
        setIsMenuOpen(false);
      }
    }
  ];
  
  return (
    <div className="sidebar-header">
      <div className="header-content">
        <img src="/LOGO.svg" alt="PingMe Logo" className="logo" />
        <div className="app-name">
          Ping<span className="accent">Me</span>
        </div>
      </div>
      {user && (
        <div className="user-info">
          <span className="welcome-text">
            Welcome, {user.display_name}
          </span>
          {isMobile && (
            <KebabMenu 
              isOpen={isMenuOpen} 
              onToggle={() => setIsMenuOpen(!isMenuOpen)}
              menuItems={menuItems}
            />
          )}
        </div>
      )}
    </div>
  );
};
