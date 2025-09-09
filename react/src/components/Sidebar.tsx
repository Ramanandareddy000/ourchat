import React, { useState } from 'react';
import styled from 'styled-components';
import { User } from '../types';
import { Logo } from './shared/Logo';
import { Input } from './shared/Input';
import { ChatList } from './chat/ChatList';

const SidebarContainer = styled.div`
  width: 350px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AppName = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;

  .accent {
    color: #00a884;
  }
`;

const SearchContainer = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const NavTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
`;

const NavTab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 12px;
  border: none;
  background: ${props => props.active ? '#00a884' : 'transparent'};
  color: ${props => props.active ? 'white' : '#667781'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#00a884' : '#f0f2f5'};
  }
`;

interface SidebarProps {
  users: User[];
  onSearch: (query: string) => void;
  onTabSwitch: (tab: string) => void;
  onChatSelect: (userId: number) => void;
  selectedUserId?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  users,
  onSearch,
  onTabSwitch,
  onChatSelect,
  selectedUserId
}) => {
  const [activeTab, setActiveTab] = useState('all');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabSwitch(tab);
  };

  return (
    <SidebarContainer className="sidebar">
      <SidebarHeader>
        <Logo size={44} />
        <AppName>
          Ping<span className="accent">Me</span>
        </AppName>
      </SidebarHeader>

      <SearchContainer>
        <Input
          type="text"
          placeholder="Search chats..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </SearchContainer>

      <NavTabs>
        <NavTab
          active={activeTab === 'all'}
          onClick={() => handleTabClick('all')}
        >
          All
        </NavTab>
        <NavTab
          active={activeTab === 'online'}
          onClick={() => handleTabClick('online')}
        >
          Online
        </NavTab>
        <NavTab
          active={activeTab === 'groups'}
          onClick={() => handleTabClick('groups')}
        >
          Groups
        </NavTab>
      </NavTabs>

      <ChatList
        users={users}
        onChatSelect={onChatSelect}
        selectedUserId={selectedUserId}
      />
    </SidebarContainer>
  );
};
