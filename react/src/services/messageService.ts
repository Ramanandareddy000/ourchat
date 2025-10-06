import axiosInstance from '../api/axiosInstance';
import { BaseService } from "./BaseService";
import { User } from "../types";

interface APIMessage {
  id: number;
  text: string;
  sender_id: number;
  receiver_id: number;
  is_group: boolean;
  created_at: string;
  updated_at: string;
  conversation_id: number;
}

interface APIConversation {
  id: number;
  name: string | null;
  is_group: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
  display_name?: string;
  participant_count?: number;
}

class MessageService extends BaseService {
  constructor() {
    super("/messages");
  }

  // Fetch all users
  async fetchUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get<User[]>("/users");
      // The API returns User[] directly, not wrapped in ApiResponse
      const users = response.data || [];
      console.log("Fetched users from API:", users);

      // Map the API response to match our frontend User type
      return users.map((user: any) => ({
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        image: user.image,
        online: user.online || false,
        last_seen: user.last_seen || "Never seen",
        phone: user.phone,
        about: user.about,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  // Add participant to a conversation
  async addParticipant(params: { chat_id: number; user_id?: number; username?: string }): Promise<{ id: number; chat_id: number; user_id: number; added_at: string }>{
    try {
      const response = await axiosInstance.post(`/chat-participants/add`, params);
      if (response.data?.success) {
        return response.data.participant;
      }
      throw new Error(response.data?.error || 'Failed to add participant');
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to add participant';
      throw new Error(msg);
    }
  }

  // Start a new conversation with a user
  async startConversation(params: {
    current_user_id: number;
    target_user_id?: number;
    target_username?: string;
  }): Promise<{
    id: number;
    name: string | null;
    is_group: boolean;
    created_by: number | null;
    created_at: string;
    is_existing: boolean;
  }> {
    try {
      const response = await axiosInstance.post(`/chat/start-conversation`, params);
      if (response.data?.success) {
        return response.data.conversation;
      }
      throw new Error(response.data?.error || 'Failed to start conversation');
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to start conversation';
      throw new Error(msg);
    }
  }

  // Fetch conversations for a user
  async fetchConversations(userId: number): Promise<User[]> {
    try {
      // The conversations endpoint returns an array directly, not wrapped in ApiResponse
      const response = await axiosInstance.get<APIConversation[]>(
        `/messages/user/${userId}/conversations`
      );
      
      // Ensure response.data is an array before calling map
      const conversations = response.data || [];

      // Debugging: Log the conversations
      console.log('Fetched conversations:', conversations);

      // Deduplicate conversations by conversation ID and also by participant combination for 1:1 chats
      const uniqueConversations = conversations.filter((conversation, index, self) => {
        // For groups, deduplicate by ID only
        if (conversation.is_group) {
          return index === self.findIndex(c => c.id === conversation.id);
        }

        // For 1:1 chats, deduplicate by both ID and display_name to prevent multiple entries for same user
        return index === self.findIndex(c =>
          c.id === conversation.id ||
          (!c.is_group && c.display_name === conversation.display_name && c.display_name)
        );
      });

      console.log('Deduplicated conversations:', uniqueConversations);

      // Map conversations to the User type expected by the frontend
      return uniqueConversations.map((conversation) => {
        // For groups, use the conversation name and ID
        // For 1:1 chats, we need to determine the other participant's ID and name
        let displayName, user_id;
        
        if (conversation.is_group) {
          // For groups, use the conversation name and ID
          displayName = conversation.name;
          user_id = conversation.id; // For groups, we can use the conversation ID
        } else {
          // For 1:1 chats, use the display_name (other user's name) which is added by the backend
          // and determine the correct user ID
          displayName = conversation.display_name || "Unknown User";
          user_id = conversation.id; // For now, we'll continue using conversation ID
          // TODO: In a more complete implementation, we would map this to the actual user ID
          // of the other participant in the conversation
        }

        const userOnlineStatus = conversation.is_group ? true : (conversation.online || false);

        // Debug logging for online status
        if (!conversation.is_group) {
          console.log(`User ${displayName}: API online=${conversation.online}, mapped online=${userOnlineStatus}`);
        }

        return {
          id: user_id,
          username:
            displayName?.toLowerCase().replace(/\s+/g, "_") ||
            `user_${user_id}`,
          display_name: displayName || "Unknown User",
          avatar_url: conversation.is_group ? "" : null,
          image: undefined,
          online: userOnlineStatus, // Groups are always "online", users use actual status
          last_seen: conversation.is_group
            ? `${conversation.participant_count || 0} members`
            : (conversation.last_seen || "Recently"),
          phone: undefined,
          about: undefined,
          is_group: conversation.is_group,
          created_at: conversation.created_at,
          updated_at: conversation.updated_at,
        };
      });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  }

  // Fetch all messages
  async fetchMessages(): Promise<APIMessage[]> {
    try {
      const response = await this.fetchData<APIMessage[]>("");
      // Ensure response.data is an array before returning
      return response.data || [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }

  // Fetch messages for a specific user
  async fetchMessagesByUserId(userId: number): Promise<APIMessage[]> {
    try {
      const response = await this.fetchData<APIMessage[]>(`/user/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching messages for user ${userId}:`, error);
      throw error;
    }
  }

  // Fetch messages for a specific conversation
  async fetchMessagesByConversationId(
    conversationId: number
  ): Promise<APIMessage[]> {
    try {
      const response = await this.fetchData<APIMessage[]>(
        `/conversation/${conversationId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching messages for conversation ${conversationId}:`,
        error
      );
      throw error;
    }
  }

  // Create a new message
  async createMessage(messageData: Partial<APIMessage>): Promise<APIMessage> {
    try {
      const response = await this.createData<APIMessage>(messageData);
      return response.data;
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  }

  // Update an existing message
  async updateMessage(
    id: number,
    updateData: Partial<APIMessage>
  ): Promise<APIMessage> {
    try {
      const response = await this.updateData<APIMessage>(id, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating message ${id}:`, error);
      throw error;
    }
  }

  // Delete a message
  async deleteMessage(id: number): Promise<boolean> {
    try {
      await this.deleteData(id);
      return true;
    } catch (error) {
      console.error(`Error deleting message ${id}:`, error);
      throw error;
    }
  }

}

// Export a singleton instance
export const messageService = new MessageService();
export default messageService;
