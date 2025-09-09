import React from 'react';
import './Header.scss';

export const Header: React.FC = () => {
  return (
    <div className="sidebar-header">
      <div className="logo">
        <img src="/LOGO.svg" alt="PingMe Logo" />
      </div>
      <span className="app-name">
        Ping<span className="accent">Me</span>
      </span>
    </div>
  );
};
