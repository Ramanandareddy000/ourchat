import React, { useState } from 'react';
import styled from 'styled-components';
import { users } from './utils/data';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Sidebar = styled.div`
  width: 350px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.div`
  width: 44px;
  height: 44px;
  background: #00a884;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const AppName = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  
  .accent {
    color: #00a884;
  }
`;

const ChatList = styled.div`
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
  
  &:hover {
    background: ${props => props.active ? '#e7f3ff' : '#f8f9fa'};
  }
`;

const Avatar = styled.div<{ image?: string }>`
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
`;

const ChatInfo = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 500;
    color: #1a1a1a;
  }
  
  p {
    margin: 0;
    font-size: 14px;
    color: #667781;
  }
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  color: #667781;
  font-size: 16px;
`;

function App() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  return (
    <AppContainer>
      <Sidebar>
        <Header>
          <Logo>P</Logo>
          <AppName>
            Ping<span className="accent">Me</span>
          </AppName>
        </Header>
        
        <ChatList>
          {users.map(user => (
            <ChatItem
              key={user.id}
              active={selectedUser === user.id}
              onClick={() => setSelectedUser(user.id)}
            >
              <Avatar image={user.image}>
                {user.avatar}
              </Avatar>
              <ChatInfo>
                <h4>{user.name}</h4>
                <p>{user.online ? 'Online' : user.lastSeen}</p>
              </ChatInfo>
            </ChatItem>
          ))}
        </ChatList>
      </Sidebar>
      
      <ChatArea>
        {selectedUser ? `Chat with ${users.find(u => u.id === selectedUser)?.name}` : 'Select a chat to start messaging'}
      </ChatArea>
    </AppContainer>
  );
}

export default App;
