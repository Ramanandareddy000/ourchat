import React from 'react';
import './Header.scss';
import { useAuth } from '../../modules/auth';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  
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
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
