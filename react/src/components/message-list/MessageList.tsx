import React, { useEffect, useRef } from 'react';
import { Message } from '../../types';
import { MessageBubble } from '../message-bubble/MessageBubble';
import './MessageList.scss';

interface MessageListProps {
  messages: Message[];
  isGroup?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isGroup }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages-container">
      {messages.map(message => (
        <MessageBubble 
          key={message.id} 
          message={message} 
          showSender={isGroup && !message.isMe}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
