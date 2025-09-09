import React, { useState } from 'react';
import styled from 'styled-components';
import { User, Message } from '../types';
import { Button } from './shared/Button';
import { Input } from './shared/Input';

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
`;

const ChatHeader = styled.div`
  background: white;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  
  &:hover {
    background: #f0f2f5;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const Avatar = styled.div<{ image?: string }>`
  width: 40px;
  height: 40px;
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

const ContactDetails = styled.div`
  h3 {
    margin: 0;
    font-size: 16px;
    color: #1a1a1a;
  }
  
  span {
    font-size: 13px;
    color: #667781;
  }
`;

const ChatActions = styled.div`
  display: flex;
  gap: 8px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NoChat = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667781;
  font-size: 16px;
`;

const MessageBubble = styled.div<{ sent: boolean }>`
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${props => props.sent ? '#00a884' : 'white'};
  color: ${props => props.sent ? 'white' : '#1a1a1a'};
  align-self: ${props => props.sent ? 'flex-end' : 'flex-start'};
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  
  .timestamp {
    font-size: 11px;
    opacity: 0.7;
    margin-top: 4px;
  }
`;

const MessageInput = styled.div`
  background: white;
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InputContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0f2f5;
  border-radius: 24px;
  padding: 8px 16px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  
  &:hover {
    background: rgba(0,0,0,0.05);
  }
`;

const SendButton = styled.button`
  background: #00a884;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  
  &:hover {
    background: #008f6f;
  }
`;

interface ChatAreaProps {
  selectedUser: User | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  selectedUser,
  messages,
  onSendMessage,
  onBack
}) => {
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!selectedUser) {
    return (
      <ChatContainer>
        <NoChat>Select a chat to start messaging</NoChat>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <HeaderLeft>
          <BackButton onClick={onBack}>←</BackButton>
          <Avatar image={selectedUser.image}>
            {selectedUser.avatar}
          </Avatar>
          <ContactDetails>
            <h3>{selectedUser.name}</h3>
            <span>{selectedUser.lastSeen}</span>
          </ContactDetails>
        </HeaderLeft>
        
        <ChatActions>
          <Button variant="secondary" size="small">📞</Button>
          <Button variant="secondary" size="small">📹</Button>
          <Button variant="secondary" size="small">⋮</Button>
        </ChatActions>
      </ChatHeader>

      <MessagesContainer>
        {messages.map(message => (
          <MessageBubble key={message.id} sent={message.sent}>
            <div>{message.text}</div>
            <div className="timestamp">{message.timestamp}</div>
          </MessageBubble>
        ))}
      </MessagesContainer>

      <MessageInput>
        <InputContainer>
          <ActionButton>😊</ActionButton>
          <Input
            type="text"
            placeholder="Type a message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ border: 'none', background: 'transparent', flex: 1 }}
          />
          <ActionButton>📎</ActionButton>
          <ActionButton>📷</ActionButton>
        </InputContainer>
        <SendButton onClick={handleSend}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </SendButton>
      </MessageInput>
    </ChatContainer>
  );
};
