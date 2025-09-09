import React from 'react';
import { Message } from '../../types';
import './MessageBubble.scss';

interface MessageBubbleProps {
  message: Message;
  showSender?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, showSender }) => {
  return (
    <div className={`message ${message.isMe ? 'sent' : 'received'}`}>
      <div className="message-bubble">
        {showSender && message.sender && (
          <div className="sender-name">{message.sender}</div>
        )}
        <div className="message-text">{message.text}</div>
        <div className="message-time">{message.time}</div>
      </div>
    </div>
  );
};
