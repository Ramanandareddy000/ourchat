import React, { useState, useRef } from 'react';
import { EmojiPicker } from './EmojiPicker';
import './MessageInput.scss';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessageText(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    
    // Focus back on textarea after emoji selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setMessageText(prev => prev ? `${prev} 📎 ${file.name}` : `📎 ${file.name}`);
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
      if (file) setMessageText(prev => prev ? `${prev} 📷 ${file.name}` : `📷 ${file.name}`);
    };
    input.click();
  };

  return (
    <div className="message-input" style={{ position: 'relative' }}>
      <div className="input-container">
        <button className="action-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          😊
        </button>
        <textarea
          ref={textareaRef}
          placeholder="Type a message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
        />
        <button 
          className="action-btn" 
          onClick={handleAttachment}
          title="Attach file"
        >
          📎
        </button>
        <button 
          className="action-btn" 
          onClick={handleCamera}
          title="Take photo"
        >
          📷
        </button>
        <button 
          className={`send-btn ${messageText.trim() ? 'active' : ''}`}
          onClick={handleSend}
          disabled={!messageText.trim()}
        >
          {/* Paper plane icon for send - always shown */}
          <svg viewBox="0 0 24 24" width="24" height="24" className="send-icon">
            <path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
          </svg>
        </button>
      </div>
      
      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker
            isOpen={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onEmojiClick={handleEmojiClick}
          />
        </div>
      )}
    </div>
  );
};
