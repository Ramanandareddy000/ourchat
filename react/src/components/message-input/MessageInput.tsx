import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EmojiPicker } from './EmojiPicker';
import { AppMessageInput } from '../../ui';
import { formatFileMessage } from '../../utils/fileUtils';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const { t } = useTranslation();
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessageText(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setMessageText(prev => prev ? `${prev} ${formatFileMessage(file, 'attachment')}` : formatFileMessage(file, 'attachment'));
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
      if (file) setMessageText(prev => prev ? `${prev} ${formatFileMessage(file, 'camera')}` : formatFileMessage(file, 'camera'));
    };
    input.click();
  };

  return (
    <AppMessageInput
      value={messageText}
      onChange={setMessageText}
      onSend={handleSend}
      onEmojiClick={() => setShowEmojiPicker(!showEmojiPicker)}
      onAttachFile={handleAttachment}
      onCameraClick={handleCamera}
      placeholder={t("chat.typeMessage")}
      showEmojiPicker={showEmojiPicker}
      emojiPicker={
        <EmojiPicker
          isOpen={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onEmojiClick={handleEmojiClick}
        />
      }
    />
  );
};
