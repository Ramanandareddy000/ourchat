import React, { useEffect } from 'react';
import { User, Message } from '../../types';
import { ChatHeader } from '../chat-header/ChatHeader';
import { MessageList } from '../message-list/MessageList';
import { MessageInput } from '../message-input/MessageInput';
import { ContactView } from '../contact-view/ContactView';
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
  // Debugging: Log the props
  useEffect(() => {
    console.log('ChatArea props:', { selectedUser, messages });
  }, [selectedUser, messages]);

  if (!selectedUser) {
    return (
      <div className="chat-area">
        <div className="no-chat">
          Select a chat to start messaging
        </div>
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
          <div className="messages-wrapper">
            <MessageList messages={messages} isGroup={selectedUser.is_group || false} />
          </div>
          <div className="input-container">
            <MessageInput onSendMessage={onSendMessage} />
          </div>
        </>
      )}
    </div>
  );
};
