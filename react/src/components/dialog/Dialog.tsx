import React from 'react';
import './Dialog.scss';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'center' | 'top-right';
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children, position = 'center' }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className={`dialog-content ${position}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
