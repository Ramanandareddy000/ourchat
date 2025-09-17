import React, { useRef, useEffect } from 'react';
import { Header } from '../header/Header';
import { SearchBar } from '../search-bar/SearchBar';
import { TabNavigation } from '../tab-navigation/TabNavigation';
import { ChatList } from '../chat-list/ChatList';
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
  const isResizing = useRef(false);

  useEffect(() => {
    const resize = (e: MouseEvent) => {
      if (isResizing.current && sidebarRef.current) {
        const size = Math.max(300, Math.min(800, e.clientX));
        sidebarRef.current.style.width = `${size}px`;
      }
    };

    const stopResize = () => {
      isResizing.current = false;
      window.removeEventListener('mousemove', resize as EventListener);
      window.removeEventListener('mouseup', stopResize as EventListener);
    };

    const startResize = (e: MouseEvent) => {
      e.preventDefault();
      isResizing.current = true;
      window.addEventListener('mousemove', resize as EventListener);
      window.addEventListener('mouseup', stopResize as EventListener);
    };

    const resizer = sidebarRef.current?.querySelector('.sidebar-resizer');
    if (resizer) {
      resizer.addEventListener('mousedown', startResize as EventListener);
    }

    return () => {
      if (resizer) {
        resizer.removeEventListener('mousedown', startResize as EventListener);
      }
      window.removeEventListener('mousemove', resize as EventListener);
      window.removeEventListener('mouseup', stopResize as EventListener);
    };
  }, []);

  return (
    <div className="sidebar" ref={sidebarRef}>
      <div className="sidebar-content">
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
      <div className="sidebar-resizer"></div>
    </div>
  );
};
