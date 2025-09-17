// API service for fetching data from the backend
const API_BASE_URL = 'http://localhost:3002'; // NestJS server port

import { User } from '../../types';

interface APIMessage {
  id: number;
  text: string;
  time: string;
  isMe: boolean;
  sender?: string;
  sender_id: number;
  receiver_id: number;
  is_group: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch users');
    }

    const users: User[] = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Fetch all messages
export const fetchMessages = async (): Promise<APIMessage[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch messages');
    }

    const messages: APIMessage[] = await response.json();
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Fetch messages for a specific user
export const fetchMessagesByUserId = async (userId: number): Promise<APIMessage[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch messages');
    }

    const messages: APIMessage[] = await response.json();
    return messages;
  } catch (error) {
    console.error(`Error fetching messages for user ${userId}:`, error);
    throw error;
  }
};

// Create a new message
export const createMessage = async (messageData: Partial<APIMessage>): Promise<APIMessage> => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create message');
    }

    const message: APIMessage = await response.json();
    return message;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

// Update an existing message
export const updateMessage = async (id: number, updateData: Partial<APIMessage>): Promise<APIMessage> => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update message');
    }

    const message: APIMessage = await response.json();
    return message;
  } catch (error) {
    console.error(`Error updating message ${id}:`, error);
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete message');
    }

    return true;
  } catch (error) {
    console.error(`Error deleting message ${id}:`, error);
    throw error;
  }
};