import React, { useRef, useEffect } from 'react';
import { Header } from '../header/Header';
import { SearchBar } from '../search-bar/SearchBar';
import { TabNavigation } from '../tab-navigation/TabNavigation';
import { ChatList, OnlineUsers, Groups } from '../chat-list';
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
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Separate users and groups
  const users = filteredUsers.filter(user => !user.is_group);
  const groups = filteredUsers.filter(user => user.is_group);

  return (
    <div className="sidebar" ref={sidebarRef}>
      <div className="sidebar-content">
        <Header />
        <SearchBar value={searchQuery} onChange={onSearchChange} />
        <TabNavigation currentTab={currentTab} onTabChange={onTabChange} />
        {currentTab === 'online' ? (
          <OnlineUsers 
            users={users}
            currentChatId={currentChatId}
            onChatSelect={onChatSelect}
          />
        ) : currentTab === 'groups' ? (
          <Groups 
            groups={groups}
            currentChatId={currentChatId}
            onChatSelect={onChatSelect}
            messages={messages}
          />
        ) : (
          <ChatList 
            users={filteredUsers}
            currentChatId={currentChatId}
            onChatSelect={onChatSelect}
            messages={messages}
          />
        )}
      </div>
    </div>
  );
};
