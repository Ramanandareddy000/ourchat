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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: { [key: string]: Message[] } = {};

    messages.forEach(message => {
      const date = new Date(message.time).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages || []);

  return (
    <div className="messages-container">
      {messages && messages.length > 0 ? (
        Object.keys(groupedMessages)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map(dateKey => (
            <div key={dateKey} className="date-group">
              <div className="date-separator">
                <span className="date-text">{formatDate(dateKey)}</span>
              </div>
              <div className="messages-wrapper">
                {groupedMessages[dateKey].map(message => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    showSender={isGroup && !message.isMe}
                  />
                ))}
              </div>
            </div>
          ))
      ) : (
        <div className="no-messages">No messages yet</div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
