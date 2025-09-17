import React from 'react';
import './TabNavigation.scss';

interface TabNavigationProps {
  currentTab: 'all' | 'online' | 'groups';
  onTabChange: (tab: 'all' | 'online' | 'groups') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'online', label: 'Online' },
    { id: 'groups', label: 'Groups' }
  ] as const;

  return (
    <div className="nav-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${currentTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id as 'all' | 'online' | 'groups')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
