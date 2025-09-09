import React from 'react';
import { User, Message } from '../../types';
import { ChatHeader } from '../ChatHeader/ChatHeader';
import { MessageList } from '../MessageList/MessageList';
import { MessageInput } from '../MessageInput/MessageInput';
import './ChatArea.scss';

interface ChatAreaProps {
  selectedUser: User | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
  isMobile: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  selectedUser,
  messages,
  onSendMessage,
  onBack,
  isMobile
}) => {
  if (!selectedUser) {
    return (
      <div className="chat-area">
        <div className="no-chat">Select a chat to start messaging</div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <ChatHeader user={selectedUser} onBack={onBack} isMobile={isMobile} />
      <MessageList messages={messages} isGroup={selectedUser.isGroup} />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};
