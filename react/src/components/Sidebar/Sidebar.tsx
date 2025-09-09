import React from 'react';
import { Header } from '../Header/Header';
import { SearchBar } from '../SearchBar/SearchBar';
import { TabNavigation } from '../TabNavigation/TabNavigation';
import { ChatList } from '../ChatList/ChatList';
import { User } from '../../types';
import './Sidebar.scss';

interface SidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentTab: 'all' | 'online' | 'groups';
  onTabChange: (tab: 'all' | 'online' | 'groups') => void;
  filteredUsers: User[];
  currentChatId: number | null;
  onChatSelect: (userId: number) => void;
  messages: Record<number, any[]>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  searchQuery,
  onSearchChange,
  currentTab,
  onTabChange,
  filteredUsers,
  currentChatId,
  onChatSelect,
  messages
}) => {
  return (
    <div className="sidebar">
      <Header />
      <SearchBar value={searchQuery} onChange={onSearchChange} />
      <TabNavigation currentTab={currentTab} onTabChange={onTabChange} />
      <ChatList 
        users={filteredUsers}
        currentChatId={currentChatId}
        onChatSelect={onChatSelect}
        messages={messages}
      />
    </div>
  );
};
