import React from 'react';
import { Sidebar, ChatArea } from '../../components';
import { useSearch } from '../../hooks';
import { useChat } from '../chat';
import './ChatUIScreen.scss';

export const ChatUIScreen: React.FC = () => {
  const {
    currentChatId,
    isMobile,
    chatOpen,
    contactViewOpen,
    selectedUser,
    currentMessages,
    sendMessage,
    selectChat,
    closeChat,
    openContactView,
    closeContactView
  } = useChat();

  const {
    searchQuery,
    setSearchQuery,
    currentTab,
    setCurrentTab,
    filteredUsers
  } = useSearch();

  // Get all messages for the sidebar
  const { messages } = useChat();

  return (
    <div className={`chat-ui-screen ${isMobile && chatOpen ? 'chat-open' : ''}`}>
      <Sidebar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        filteredUsers={filteredUsers}
        currentChatId={currentChatId}
        onChatSelect={selectChat}
        messages={messages}
      />
      
      <ChatArea
        selectedUser={selectedUser}
        messages={currentMessages}
        onSendMessage={sendMessage}
        onBack={closeChat}
        isMobile={isMobile}
        onViewContact={openContactView}
        contactViewOpen={contactViewOpen}
        onCloseContactView={closeContactView}
      />
    </div>
  );
};
