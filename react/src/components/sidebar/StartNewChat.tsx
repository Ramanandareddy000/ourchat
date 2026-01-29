import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { messageService } from "../../services/messageService";
import { User } from "../../types";
import "./StartNewChat.scss";

interface StartNewChatProps {
  currentUserId: number;
  onClose: () => void;
  onConversationStarted: (conversationId: number, isNewConversation: boolean) => void;
}

export const StartNewChat: React.FC<StartNewChatProps> = ({
  currentUserId,
  onClose,
  onConversationStarted,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setInitialLoading(true);
        console.log("StartNewChat: Loading users for currentUserId:", currentUserId);
        const users = await messageService.fetchUsers();
        console.log("StartNewChat: Received users:", users);

        // Filter out the current user
        const otherUsers = users.filter(user => user.id !== currentUserId);
        console.log("StartNewChat: Filtered users (excluding current):", otherUsers);

        setAllUsers(otherUsers);
        setFilteredUsers(otherUsers);
        setError(null);
      } catch (err: any) {
        const errorMsg = err?.message || "Failed to load users";
        setError(errorMsg);
        console.error("StartNewChat: Error loading users:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    if (currentUserId) {
      loadUsers();
    } else {
      console.log("StartNewChat: No currentUserId provided");
    }
  }, [currentUserId]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allUsers]);

  const handleStartConversation = async (targetUser: User) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Starting conversation with:", targetUser.display_name, "ID:", targetUser.id);

      const conversation = await messageService.startConversation({
        current_user_id: currentUserId,
        target_user_id: targetUser.id,
      });

      console.log("Conversation started successfully:", conversation);
      console.log("Calling onConversationStarted with conversation ID:", conversation.id);
      console.log("Is new conversation:", !conversation.is_existing);

      onConversationStarted(conversation.id, !conversation.is_existing);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to start conversation");
      console.error("Error starting conversation:", err);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="start-new-chat-overlay" onClick={onClose}>
      <div className="start-new-chat-container" onClick={(e) => e.stopPropagation()}>
        <div className="start-new-chat-header">
          <h2>Start New Chat</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search users by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="users-list">
          {initialLoading ? (
            <div className="loading">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="no-users">
              {searchTerm ? "No users found matching your search" : "No other users available"}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`user-item ${loading ? 'disabled' : ''}`}
                onClick={() => !loading && handleStartConversation(user)}
              >
                <div className="user-avatar">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.display_name || user.username || 'User'} />
                  ) : (
                    <div className="avatar-placeholder">
                      {(user.display_name || user.username || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.display_name || user.username || 'Unknown User'}</div>
                  <div className="username">@{user.username || 'unknown'}</div>
                </div>
                {user.online && <div className="online-indicator"></div>}
              </div>
            ))
          )}
        </div>

        <div className="actions">
          <button className="cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};