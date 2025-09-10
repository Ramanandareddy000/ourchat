import React from 'react';
import { User, Message } from '../../types';
import { ChatHeader } from '../ChatHeader/ChatHeader';
import { MessageList } from '../MessageList/MessageList';
import { MessageInput } from '../MessageInput/MessageInput';
import { ContactView } from '../ContactView/ContactView';
import './ChatArea.scss';

interface ChatAreaProps {
  selectedUser: User | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
  isMobile: boolean;
  onViewContact: () => void;
  contactViewOpen: boolean;
  onCloseContactView: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  selectedUser,
  messages,
  onSendMessage,
  onBack,
  isMobile,
  onViewContact,
  contactViewOpen,
  onCloseContactView
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
      {!contactViewOpen && <ChatHeader user={selectedUser} onBack={onBack} isMobile={isMobile} onViewContact={onViewContact} />}
      {contactViewOpen ? (
        <ContactView user={selectedUser} onClose={onCloseContactView} />
      ) : (
        <>
          <MessageList messages={messages} isGroup={selectedUser.isGroup} />
          <MessageInput onSendMessage={onSendMessage} />
        </>
      )}
    </div>
  );
};
