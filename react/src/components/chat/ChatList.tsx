import React from 'react';
import styled from 'styled-components';
import { User } from '../../types';

const ChatListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ChatItem = styled.div<{ active?: boolean }>`
  padding: 16px 20px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${props => props.active ? '#e7f3ff' : 'white'};
  transition: background-color 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#e7f3ff' : '#f8f9fa'};
  }
`;

const Avatar = styled.div<{ image?: string; online?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.image ? `url(${props.image})` : '#00a884'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  position: relative;
  
  ${props => props.online && `
    &::after {
      content: '';
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      background: #00d04a;
      border: 2px solid white;
      border-radius: 50%;
    }
  `}
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatName = styled.h4`
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LastMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #667781;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const Timestamp = styled.span`
  font-size: 12px;
  color: #667781;
`;

const UnreadBadge = styled.span`
  background: #00a884;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #667781;
  font-size: 14px;
`;

interface ChatListProps {
  users: User[];
  onChatSelect: (userId: number) => void;
  selectedUserId?: number;
}

export const ChatList: React.FC<ChatListProps> = ({
  users,
  onChatSelect,
  selectedUserId
}) => {
  if (users.length === 0) {
    return (
      <ChatListContainer>
        <EmptyState>No chats found</EmptyState>
      </ChatListContainer>
    );
  }

  return (
    <ChatListContainer>
      {users.map(user => (
        <ChatItem
          key={user.id}
          active={user.id === selectedUserId}
          onClick={() => onChatSelect(user.id)}
        >
          <Avatar image={user.image} online={user.isOnline}>
            {user.avatar}
          </Avatar>
          <ChatInfo>
            <ChatName>{user.name}</ChatName>
            <LastMessage>
              {user.isOnline ? 'Online' : user.lastSeen}
            </LastMessage>
          </ChatInfo>
          <ChatMeta>
            <Timestamp>12:30 PM</Timestamp>
            {Math.random() > 0.7 && (
              <UnreadBadge>{Math.floor(Math.random() * 9) + 1}</UnreadBadge>
            )}
          </ChatMeta>
        </ChatItem>
      ))}
    </ChatListContainer>
  );
};
