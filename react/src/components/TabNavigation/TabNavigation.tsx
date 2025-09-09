import React from 'react';
import './TabNavigation.scss';

interface TabNavigationProps {
  currentTab: 'all' | 'online' | 'groups';
  onTabChange: (tab: 'all' | 'online' | 'groups') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ currentTab, onTabChange }) => {
  return (
    <div className="nav-tabs">
      <button
        className={`nav-tab ${currentTab === 'all' ? 'active' : ''}`}
        onClick={() => onTabChange('all')}
      >
        All
      </button>
      <button
        className={`nav-tab ${currentTab === 'online' ? 'active' : ''}`}
        onClick={() => onTabChange('online')}
      >
        Online
      </button>
      <button
        className={`nav-tab ${currentTab === 'groups' ? 'active' : ''}`}
        onClick={() => onTabChange('groups')}
      >
        Groups
      </button>
    </div>
  );
};
