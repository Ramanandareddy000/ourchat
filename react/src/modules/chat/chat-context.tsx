import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, User } from '../../types';
import { websocketService } from '../../services/websocketService';
import { useAuth } from '../auth';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../../services/messageService';

interface ChatContextType {
  messages: Record<number, Message[]>;
  users: User[];
  groups: User[];
  currentChatId: number | null;
  currentUserId: number | null;
  isMobile: boolean;
  chatOpen: boolean;
  contactViewOpen: boolean;
  selectedUser: User | null;
  currentMessages: Message[];
  sendMessage: (text: string) => void;
  selectChat: (userId: number) => void;
  closeChat: () => void;
  openContactView: () => void;
  closeContactView: () => void;
  addMessage: (chatId: number, message: Message) => void;
  refreshData: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, token, isAuthenticated } = useAuth();
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<number, Message[]>>({});

  // Debugging: Log messages state changes
  useEffect(() => {
    console.log('Messages state updated:', messages);
  }, [messages]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [chatOpen, setChatOpen] = useState(false);
  const [contactViewOpen, setContactViewOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<User[]>([]);
  const navigate = useNavigate();

  const loadUsersAndMessages = async () => {
    if (!user?.id) return;
    
    try {
      // Fetch conversations from backend (this includes both users and groups)
      const fetchedConversations = await messageService.fetchConversations(user.id);
      
      // Separate users and groups
      const fetchedUsers = fetchedConversations.filter(conv => !conv.is_group);
      const fetchedGroups = fetchedConversations.filter(conv => conv.is_group);
      
      setUsers(fetchedUsers);
      setGroups(fetchedGroups);
      
      // Fetch all messages for the user directly
      const fetchedMessages = await messageService.fetchMessagesByUserId(user.id);
      
      // Group messages by conversation_id
      const conversationMessages: Record<number, Message[]> = {};
      
      // Initialize empty arrays for each conversation
      fetchedConversations.forEach(conversation => {
        conversationMessages[conversation.id] = [];
      });
      
      // Transform and group API messages
      fetchedMessages.forEach(msg => {
        // Find which conversation this message belongs to
        const conversationId = msg.conversation_id;
        
        // Transform API message to frontend Message type
        const transformedMessage: Message = {
          id: msg.id,
          text: msg.text,
          time: msg.created_at, // Preserve full ISO date string
          isMe: msg.sender_id === user.id
        };
        
        // Add message to the appropriate conversation
        if (conversationMessages[conversationId]) {
          conversationMessages[conversationId].push(transformedMessage);
        } else {
          // Create array if it doesn't exist
          conversationMessages[conversationId] = [transformedMessage];
        }
      });
      
      // Sort messages in each conversation by time
      Object.keys(conversationMessages).forEach(conversationId => {
        conversationMessages[parseInt(conversationId)].sort((a, b) => {
          // Convert ISO date strings to dates for comparison
          const dateA = new Date(a.time);
          const dateB = new Date(b.time);
          return dateA.getTime() - dateB.getTime();
        });
      });
      
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Failed to load user data from backend:', error);
      // Set empty arrays - no fallback to static data
      setUsers([]);
      setGroups([]);
      setMessages({});
    }
  };

  // Initialize users from backend API and refresh when user changes
  useEffect(() => {
    // Reset state when user changes
    setUsers([]);
    setGroups([]);
    setMessages({});
    setCurrentChatId(null);
    
    // Load data for new user
    if (user?.id) {
      loadUsersAndMessages();
    }
  }, [user?.id]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    console.log('WebSocket useEffect triggered', { isAuthenticated, user: !!user, token: !!token });

    if (isAuthenticated && user && token) {
      console.log('Initializing WebSocket connection for user:', user.username);

      const initWebSocket = async () => {
        try {
          await websocketService.connect(token, user.id);

          // Listen for incoming messages
          const handleMessage = (data: any) => {
            const newMessage: Message = {
              id: data.id,
              text: data.text,
              time: data.created_at, // Preserve full ISO date string for consistency
              isMe: data.sender_id === user.id,
              sender: data.sender_username
            };

            // Check if this is our own message coming back from the server
            const isOwnMessage = data.sender_id === user.id;

            if (isOwnMessage) {
              // Replace optimistic message with real message from server
              setMessages(prev => {
                const conversationMessages = prev[data.conversation_id] || [];

                // Find and replace the optimistic message (with negative ID and same text)
                const updatedMessages = conversationMessages.map(msg => {
                  if (msg.id < 0 && msg.text === newMessage.text && msg.isMe) {
                    return newMessage; // Replace with real message
                  }
                  return msg;
                });

                // If no optimistic message was found, just add the new message
                const hasOptimistic = conversationMessages.some(msg =>
                  msg.id < 0 && msg.text === newMessage.text && msg.isMe
                );

                return {
                  ...prev,
                  [data.conversation_id]: hasOptimistic ? updatedMessages : [...conversationMessages, newMessage]
                };
              });
            } else {
              // Regular incoming message from another user
              addMessage(data.conversation_id, newMessage);
            }
          };

          const handleUserStatus = (data: any) => {
            console.log('User status update:', data);
            // Handle online/offline status updates
          };

          const handleTyping = (data: any) => {
            console.log('User typing:', data);
            // Handle typing indicators
          };

          const handleError = (error: string) => {
            console.error('WebSocket error:', error);
          };

          websocketService.onMessage(handleMessage);
          websocketService.onUserStatus(handleUserStatus);
          websocketService.onTyping(handleTyping);
          websocketService.onError(handleError);
        } catch (error) {
          console.error('Failed to initialize WebSocket:', error);
        }
      };

      initWebSocket();

      return () => {
        websocketService.disconnect();
      };
    }
  }, [isAuthenticated, user, token]);

  const addMessage = (chatId: number, message: Message) => {
    console.log('Adding message to chatId:', chatId, 'Message:', message);
    setMessages(prev => {
      const newMessages = {
        ...prev,
        [chatId]: [...(prev[chatId] || []), message]
      };
      console.log('Updated messages:', newMessages);
      return newMessages;
    });
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || !currentChatId || !user) return;

    // Create optimistic message for immediate UI update
    const optimisticMessage: Message = {
      id: -Date.now(), // Temporary negative ID to avoid conflicts
      text: text.trim(),
      time: new Date().toISOString(), // Current timestamp
      isMe: true
    };

    // Add message immediately to local state for instant UI feedback
    addMessage(currentChatId, optimisticMessage);

    // Send via WebSocket if connected, otherwise fallback to HTTP API
    if (websocketService.isConnected()) {
      websocketService.sendMessage(currentChatId, text);
    } else {
      console.log('WebSocket not connected, using fallback method');
      // You could implement HTTP fallback here if needed
    }
  };

  const selectChat = (userId: number) => {
    setCurrentChatId(userId);
    setChatOpen(true);

    // Join the conversation room via WebSocket
    if (websocketService.isConnected()) {
      websocketService.joinConversation(userId);
    }
  };

  const closeChat = () => {
    setChatOpen(false);
    setCurrentChatId(null);
    // Navigate back to main view when closing chat
    navigate('/');
  };

  const openContactView = () => {
    setContactViewOpen(true);
  };

  const closeContactView = () => {
    setContactViewOpen(false);
  };

  const refreshData = async () => {
    if (!user?.id) return;

    try {
      console.log('🔄 Refreshing conversations for user:', user.id);

      // Fetch conversations from backend (this includes both users and groups)
      const fetchedConversations = await messageService.fetchConversations(user.id);

      console.log('📋 Fetched conversations:', fetchedConversations);

      // Separate users and groups
      const fetchedUsers = fetchedConversations.filter(conv => !conv.is_group);
      const fetchedGroups = fetchedConversations.filter(conv => conv.is_group);

      // Additional deduplication by user ID to prevent duplicate users in sidebar
      const uniqueUsers = fetchedUsers.filter((user, index, self) =>
        index === self.findIndex(u => u.id === user.id)
      );

      const uniqueGroups = fetchedGroups.filter((group, index, self) =>
        index === self.findIndex(g => g.id === group.id)
      );

      console.log('👥 1:1 conversations (before dedup):', fetchedUsers);
      console.log('👥 1:1 conversations (after dedup):', uniqueUsers);
      console.log('👥 Group conversations (before dedup):', fetchedGroups);
      console.log('👥 Group conversations (after dedup):', uniqueGroups);

      setUsers(uniqueUsers);
      setGroups(uniqueGroups);

      // Fetch all messages for the user directly
      const fetchedMessages = await messageService.fetchMessagesByUserId(user.id);

      console.log('💬 Fetched messages:', fetchedMessages.length, 'messages');

      // Group messages by conversation_id
      const conversationMessages: Record<number, Message[]> = {};

      // Initialize empty arrays for each conversation
      fetchedConversations.forEach(conversation => {
        conversationMessages[conversation.id] = [];
      });

      // Transform and group API messages
      fetchedMessages.forEach(msg => {
        // Find which conversation this message belongs to
        const conversationId = msg.conversation_id;

        // Transform API message to frontend Message type
        const transformedMessage: Message = {
          id: msg.id,
          text: msg.text,
          time: new Date(msg.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          isMe: msg.sender_id === user.id
        };

        // Add message to the appropriate conversation
        if (conversationMessages[conversationId]) {
          conversationMessages[conversationId].push(transformedMessage);
        } else {
          // Create array if it doesn't exist
          conversationMessages[conversationId] = [transformedMessage];
        }
      });

      // Sort messages in each conversation by time
      Object.keys(conversationMessages).forEach(conversationId => {
        conversationMessages[parseInt(conversationId)].sort((a, b) => {
          // Convert ISO date strings to dates for comparison
          const dateA = new Date(a.time);
          const dateB = new Date(b.time);
          return dateA.getTime() - dateB.getTime();
        });
      });

      setMessages(conversationMessages);
      console.log('✅ Refresh completed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh data from backend:', error);
    }
  };

  const selectedUser = [...users, ...groups].find(user => user.id === currentChatId) || null;
  const currentMessages = currentChatId ? messages[currentChatId] || [] : [];
  
  // Debugging: Log currentMessages
  useEffect(() => {
    console.log('Current chat ID:', currentChatId);
    console.log('Messages object:', messages);
    console.log('Current messages:', currentMessages);
    
    // Additional debugging to see what keys are available in messages
    console.log('Available message keys:', Object.keys(messages));
  }, [currentChatId, currentMessages, messages]);

  const value = {
    messages,
    users,
    groups,
    currentChatId,
    currentUserId: user?.id || null,
    isMobile,
    chatOpen,
    contactViewOpen,
    selectedUser,
    currentMessages,
    sendMessage,
    selectChat,
    closeChat,
    openContactView,
    closeContactView,
    addMessage,
    refreshData
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};