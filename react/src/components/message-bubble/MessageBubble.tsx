import React from 'react';
import { Message } from '../../types';
import { AppMessageBubble } from '../../ui';

interface MessageBubbleProps {
  message: Message;
  showSender?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, showSender }) => {
  return (
    <AppMessageBubble
      message={message.text}
      timestamp={message.time}
      isOwn={message.isMe}
      sender={message.sender}
      showSender={showSender}
    />
  );
};
