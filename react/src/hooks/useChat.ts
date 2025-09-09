import { useState, useEffect } from 'react';
import { User, Message } from '../types';
import { users, groups, messages as initialMessages } from '../utils/data';

export const useChat = () => {
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim() || !currentChatId) return;

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

    setMessages(prev => ({
      ...prev,
      [currentChatId]: [...(prev[currentChatId] || []), newMessage]
    }));
  };

  const selectChat = (userId: number) => {
    setCurrentChatId(userId);
    setChatOpen(true);
  };

  const closeChat = () => {
    setChatOpen(false);
    setCurrentChatId(null);
  };

  const selectedUser = [...users, ...groups].find(user => user.id === currentChatId) || null;
  const currentMessages = currentChatId ? messages[currentChatId] || [] : [];

  return {
    currentChatId,
    messages,
    isMobile,
    chatOpen,
    selectedUser,
    currentMessages,
    sendMessage,
    selectChat,
    closeChat
  };
};
