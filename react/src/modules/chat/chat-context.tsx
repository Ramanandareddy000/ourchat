import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, User } from '../../types';
import { webSocketService } from './websocket-service';
import { useAuth } from '../auth';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../../services/messageService';

interface ChatContextType {
  messages: Record<number, Message[]>;
  users: User[];
  groups: User[];
  currentChatId: number | null;
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
  const { user } = useAuth();
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
      
      // For each conversation, fetch its messages
      const conversationMessages: Record<number, Message[]> = {};
      
      for (const conversation of fetchedConversations) {
        try {
          const fetchedMessages = await messageService.fetchMessagesByConversationId(conversation.id);
          
          // Transform API messages to frontend Message type
          // Ensure fetchedMessages is an array before calling map
          conversationMessages[conversation.id] = (fetchedMessages || []).map(msg => ({
            id: msg.id,
            text: msg.text,
            time: new Date(msg.created_at).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            isMe: msg.sender_id === user.id
          }));
        } catch (error) {
          console.error(`Failed to load messages for conversation ${conversation.id}:`, error);
          conversationMessages[conversation.id] = [];
        }
      }
      
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
    if (user) {
      webSocketService.connect(user.id);
      
      // Listen for incoming messages
      const handleMessage = (data: any) => {
        if (data.type === 'new_message') {
          const newMessage: Message = {
            id: data.messageId,
            text: data.text,
            time: new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            isMe: data.senderId === user.id
          };
          
          addMessage(data.chatId, newMessage);
        }
      };
      
      webSocketService.on('message', handleMessage);
      
      return () => {
        webSocketService.off('message', handleMessage);
        webSocketService.disconnect();
      };
    }
  }, [user]);

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

    // Add to local state immediately for better UX
    const newMessage: Message = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      isMe: true
    };

    addMessage(currentChatId, newMessage);

    // Send via WebSocket
    webSocketService.sendMessage({
      type: 'send_message',
      chatId: currentChatId,
      text: text,
      senderId: user.id
    });
  };

  const selectChat = (userId: number) => {
    setCurrentChatId(userId);
    setChatOpen(true);
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
      // Fetch conversations from backend (this includes both users and groups)
      const fetchedConversations = await messageService.fetchConversations(user.id);
      
      // Separate users and groups
      const fetchedUsers = fetchedConversations.filter(conv => !conv.is_group);
      const fetchedGroups = fetchedConversations.filter(conv => conv.is_group);
      
      setUsers(fetchedUsers);
      setGroups(fetchedGroups);
      
      // For each conversation, fetch its messages
      const conversationMessages: Record<number, Message[]> = {};
      
      for (const conversation of fetchedConversations) {
        try {
          const fetchedMessages = await messageService.fetchMessagesByConversationId(conversation.id);
          
          // Transform API messages to frontend Message type
          // Ensure fetchedMessages is an array before calling map
          conversationMessages[conversation.id] = (fetchedMessages || []).map(msg => ({
            id: msg.id,
            text: msg.text,
            time: new Date(msg.created_at).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            isMe: msg.sender_id === user.id
          }));
        } catch (error) {
          console.error(`Failed to load messages for conversation ${conversation.id}:`, error);
          conversationMessages[conversation.id] = [];
        }
      }
      
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Failed to refresh data from backend:', error);
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