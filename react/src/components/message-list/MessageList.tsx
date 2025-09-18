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

  // Debugging: Log the messages prop
  useEffect(() => {
    console.log('MessageList messages:', messages);
    console.log('MessageList isGroup:', isGroup);
  }, [messages, isGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages-container">
      {messages && messages.length > 0 ? (
        messages.map(message => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            showSender={isGroup && !message.isMe}
          />
        ))
      ) : (
        <div className="no-messages">No messages yet</div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
