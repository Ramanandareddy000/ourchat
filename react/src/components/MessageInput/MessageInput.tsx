import React, { useState } from 'react';
import './MessageInput.scss';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setMessageText(`📎 ${file.name}`);
    };
    input.click();
  };

  const handleCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.setAttribute('capture', 'environment');
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setMessageText(`📷 ${file.name}`);
    };
    input.click();
  };

  return (
    <div className="message-input">
      <div className="input-container">
        <button className="action-btn" onClick={() => setMessageText(prev => prev + '😊')}>😊</button>
        <input
          type="text"
          placeholder="Type a message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="action-btn" onClick={handleAttachment}>📎</button>
        <button className="action-btn" onClick={handleCamera}>📷</button>
      </div>
      <button className="send-btn" onClick={handleSend}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  );
};
