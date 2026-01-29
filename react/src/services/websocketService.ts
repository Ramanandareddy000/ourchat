import { io, Socket } from 'socket.io-client';

interface MessageData {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_username: string;
  text: string;
  created_at: string;
  timestamp: string;
}

interface UserStatusData {
  user_id: number;
  is_online: boolean;
  last_seen: string | null;
}

interface TypingData {
  user_id: number;
  username: string;
  conversation_id: number;
  is_typing: boolean;
}

interface MessageReadData {
  message_id: number;
  conversation_id: number;
  user_id: number;
  username: string;
  read_at: string;
}

interface ParticipantAddedData {
  conversation_id: number;
  participant: {
    id: number;
    user_id: number;
    username: string;
    display_name: string;
    role: string;
    joined_at: string;
  };
}

export class WebSocketService {
  private socket: Socket | null = null;
  private currentUserId: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;

  // Event handlers
  private messageHandlers: Array<(message: MessageData) => void> = [];
  private userStatusHandlers: Array<(status: UserStatusData) => void> = [];
  private typingHandlers: Array<(typing: TypingData) => void> = [];
  private messageReadHandlers: Array<(read: MessageReadData) => void> = [];
  private participantAddedHandlers: Array<(participant: ParticipantAddedData) => void> = [];
  private errorHandlers: Array<(error: string) => void> = [];

  connect(token: string, userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Attempting WebSocket connection...', { userId, hasToken: !!token });

      if (this.socket?.connected) {
        console.log('WebSocket already connected');
        resolve();
        return;
      }

      this.currentUserId = userId;
      const url = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      console.log('WebSocket connecting to:', url);

      this.socket = io(url, {
        auth: {
          token,
        },
        transports: ['websocket'],
        upgrade: false,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected successfully!');
        this.reconnectAttempts = 0;
        this.setupEventListeners();
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        this.reconnectAttempts++;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error('Failed to connect to WebSocket server'));
        } else {
          setTimeout(() => {
            this.socket?.connect();
          }, this.reconnectInterval);
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);

        // Auto-reconnect for non-intentional disconnects
        if (reason === 'io server disconnect') {
          // Server-side disconnect, don't reconnect
          return;
        }

        this.attemptReconnect();
      });
    });
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Message events
    this.socket.on('message:new', (data: MessageData) => {
      this.messageHandlers.forEach(handler => handler(data));
    });

    this.socket.on('message:sent', (data: { id: number; conversation_id: number; timestamp: string }) => {
      console.log('Message sent confirmation:', data);
    });

    this.socket.on('message:read', (data: MessageReadData) => {
      this.messageReadHandlers.forEach(handler => handler(data));
    });

    // User status events
    this.socket.on('user:status', (data: UserStatusData) => {
      this.userStatusHandlers.forEach(handler => handler(data));
    });

    // Typing events
    this.socket.on('user:typing', (data: TypingData) => {
      this.typingHandlers.forEach(handler => handler(data));
    });

    // Participant events
    this.socket.on('participant:added', (data: ParticipantAddedData) => {
      this.participantAddedHandlers.forEach(handler => handler(data));
    });

    // Connection events
    this.socket.on('joined_conversation', (data: { conversation_id: number }) => {
      console.log('Joined conversation:', data.conversation_id);
    });

    // Error handling
    this.socket.on('error', (data: { message: string }) => {
      console.error('WebSocket error:', data.message);
      this.errorHandlers.forEach(handler => handler(data.message));
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.socket?.connect();
    }, this.reconnectInterval);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentUserId = null;
      this.reconnectAttempts = 0;
    }
  }

  // Room management
  joinConversation(conversationId: number): void {
    console.log('Attempting to join conversation:', conversationId);
    if (this.socket?.connected) {
      console.log('Emitting join_conversation event for:', conversationId);
      this.socket.emit('join_conversation', { conversation_id: conversationId });
    } else {
      console.warn('Cannot join conversation - WebSocket not connected');
    }
  }

  // Message operations
  sendMessage(conversationId: number, content: string, receiverId?: number): void {
    console.log('Attempting to send message:', { conversationId, content, receiverId });
    if (this.socket?.connected) {
      console.log('Emitting send_message event');
      this.socket.emit('send_message', {
        conversation_id: conversationId,
        content,
        receiver_id: receiverId,
      });
    } else {
      console.warn('Cannot send message - WebSocket not connected');
    }
  }

  markMessageAsRead(messageId: number, conversationId: number): void {
    if (this.socket?.connected) {
      this.socket.emit('mark_read', {
        message_id: messageId,
        conversation_id: conversationId,
      });
    }
  }

  // Typing indicators
  setTyping(conversationId: number, isTyping: boolean): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', {
        conversation_id: conversationId,
        is_typing: isTyping,
      });
    }
  }

  // Event handler registration
  onMessage(handler: (message: MessageData) => void): void {
    this.messageHandlers.push(handler);
  }

  onUserStatus(handler: (status: UserStatusData) => void): void {
    this.userStatusHandlers.push(handler);
  }

  onTyping(handler: (typing: TypingData) => void): void {
    this.typingHandlers.push(handler);
  }

  onMessageRead(handler: (read: MessageReadData) => void): void {
    this.messageReadHandlers.push(handler);
  }

  onParticipantAdded(handler: (participant: ParticipantAddedData) => void): void {
    this.participantAddedHandlers.push(handler);
  }

  onError(handler: (error: string) => void): void {
    this.errorHandlers.push(handler);
  }

  // Event handler removal
  removeMessageHandler(handler: (message: MessageData) => void): void {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  removeUserStatusHandler(handler: (status: UserStatusData) => void): void {
    this.userStatusHandlers = this.userStatusHandlers.filter(h => h !== handler);
  }

  removeTypingHandler(handler: (typing: TypingData) => void): void {
    this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
  }

  removeMessageReadHandler(handler: (read: MessageReadData) => void): void {
    this.messageReadHandlers = this.messageReadHandlers.filter(h => h !== handler);
  }

  removeParticipantAddedHandler(handler: (participant: ParticipantAddedData) => void): void {
    this.participantAddedHandlers = this.participantAddedHandlers.filter(h => h !== handler);
  }

  removeErrorHandler(handler: (error: string) => void): void {
    this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getCurrentUserId(): number | null {
    return this.currentUserId;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();