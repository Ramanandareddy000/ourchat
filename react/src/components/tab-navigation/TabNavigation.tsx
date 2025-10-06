import React from 'react';
import { useTranslation } from 'react-i18next';
import './TabNavigation.scss';

interface TabNavigationProps {
  currentTab: 'all' | 'online' | 'groups';
  onTabChange: (tab: 'all' | 'online' | 'groups') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ currentTab, onTabChange }) => {
  const { t } = useTranslation();
  const tabs = [
    { id: 'all', label: t('navigation.all') },
    { id: 'online', label: t('navigation.online') },
    { id: 'groups', label: t('navigation.groups') }
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
