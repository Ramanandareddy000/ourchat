import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../header/Header";
import { SearchBar } from "../search-bar/SearchBar";
import { TabNavigation } from "../tab-navigation/TabNavigation";
import { ChatList, OnlineUsers, Groups } from "../chat-list";
import { User } from "../../types";
import { messageService } from "../../services/messageService";
import { useChat } from "../../modules/chat";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { AppIconButton } from "../../ui";
import { AddParticipant } from "./Addparticipant";
import { StartNewChat } from "./StartNewChat";
import "./Sidebar.scss";
import { LanguageSwitcher } from "../language-switcher";
interface SidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentTab: "all" | "online" | "groups";
  onTabChange: (tab: "all" | "online" | "groups") => void;
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
  messages,
}) => {
  const { t } = useTranslation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { currentChatId: activeChatId, refreshData, groups, users, currentUserId, selectChat, selectedUser } = useChat();

  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [showStartNewChat, setShowStartNewChat] = useState(false);

  // Handler for adding a participant
  const handleAddParticipant = async (data: { username: string }) => {
    if (!activeChatId) {
      alert(t("chat.selectChatFirst"));
      return;
    }
    await messageService.addParticipant({
      chat_id: activeChatId,
      username: data.username,
    });
    await refreshData();
    alert(t("chat.userAddedSuccess"));
  };


  return (
    <div className="sidebar" ref={sidebarRef}>
      <div className="sidebar-content">
        <Header />

        <div className="sidebar-header">
          <div className="header-actions">
            <div className="action-buttons">
              <AppIconButton
                variant="primary"
                onClick={() => {
                  console.log("Opening StartNewChat modal");
                  console.log("Current state before opening modal:", {
                    searchQuery,
                    currentTab,
                    filteredUsersCount: filteredUsers.length,
                    currentChatId,
                  });
                  setShowStartNewChat(true);
                }}
                tooltip={t("chat.startNewChatTooltip")}
              >
                <AddCommentIcon />
              </AppIconButton>
              {selectedUser && selectedUser.is_group && (
                <AppIconButton
                  variant="primary"
                  onClick={() => setShowAddParticipant(true)}
                  tooltip={t("chat.addParticipantTooltip")}
                >
                  <PersonAddIcon />
                </AppIconButton>
              )}
            </div>
            <div className="header-right">
              <LanguageSwitcher className="header-language-switcher" />
            </div>
          </div>
        </div>

        <SearchBar value={searchQuery} onChange={onSearchChange} />
        <TabNavigation currentTab={currentTab} onTabChange={onTabChange} />

        {currentTab === "online" ? (
          <OnlineUsers
            users={filteredUsers}
            currentChatId={currentChatId}
            onChatSelect={onChatSelect}
          />
        ) : currentTab === "groups" ? (
          <Groups
            groups={filteredUsers}
            currentChatId={currentChatId}
            onChatSelect={onChatSelect}
            messages={messages}
          />
        ) : (
          <div className="all-chats">
            <ChatList
              users={filteredUsers}
              currentChatId={currentChatId}
              onChatSelect={onChatSelect}
              messages={messages}
            />
            {groups.length > 0 && (
              <Groups
                groups={groups.filter(group =>
                  searchQuery ? group.display_name.toLowerCase().includes(searchQuery.toLowerCase()) : true
                )}
                currentChatId={currentChatId}
                onChatSelect={onChatSelect}
                messages={messages}
              />
            )}
          </div>
        )}

        {showAddParticipant && (
          <AddParticipant
            chatId={activeChatId}
            onClose={() => setShowAddParticipant(false)}
            onSubmit={handleAddParticipant}
          />
        )}

        {showStartNewChat && currentUserId && (
          <StartNewChat
            currentUserId={currentUserId}
            onClose={() => setShowStartNewChat(false)}
            onConversationStarted={async (conversationId: number, isNewConversation: boolean) => {
              console.log("Conversation started with ID:", conversationId, "isNew:", isNewConversation);

              // Check if conversation already exists in current lists
              const existsInUsers = users.some(user => user.id === conversationId);
              const existsInGroups = groups.some(group => group.id === conversationId);
              const alreadyExists = existsInUsers || existsInGroups;

              if (isNewConversation && !alreadyExists) {
                console.log("New conversation created and not in sidebar, refreshing data");
                await refreshData();
              } else if (alreadyExists) {
                console.log("Conversation already exists in sidebar, no refresh needed");
              } else {
                console.log("Existing conversation selected, no refresh needed");
              }

              // Select the new chat
              selectChat(conversationId);

              // Close the modal
              setShowStartNewChat(false);
            }}
          />
        )}

      </div>
    </div>
  );
};
