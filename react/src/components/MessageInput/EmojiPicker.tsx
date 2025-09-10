import React, { useEffect, useRef } from 'react';
import EmojiPickerReact from 'emoji-picker-react';

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiClick: (emojiObject: any) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ isOpen, onClose, onEmojiClick }) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="emoji-picker-container" ref={pickerRef}>
      <EmojiPickerReact onEmojiClick={onEmojiClick} />
    </div>
  );
};
