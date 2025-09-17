import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, User } from '../../types';
import { webSocketService } from './websocket-service';
import { useAuth } from '../auth';

interface ChatContextType {
  messages: Record<number, Message[]>;
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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<number, Message[]>>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [chatOpen, setChatOpen] = useState(false);
  const [contactViewOpen, setContactViewOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize users from data
  useEffect(() => {
    // In a real app, you would fetch users from the server
    // For now, we'll use the existing data
    import('../../utils/data').then((module) => {
      setUsers([...module.users, ...module.groups]);
    });
  }, []);

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
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message]
    }));
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
  };

  const openContactView = () => {
    setContactViewOpen(true);
  };

  const closeContactView = () => {
    setContactViewOpen(false);
  };

  const selectedUser = users.find(user => user.id === currentChatId) || null;
  const currentMessages = currentChatId ? messages[currentChatId] || [] : [];

  const value = {
    messages,
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
    addMessage
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