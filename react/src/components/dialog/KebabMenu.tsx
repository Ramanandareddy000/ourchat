import React, { useRef, useEffect } from 'react';
import './KebabMenu.scss';

interface MenuItem {
  label?: string;
  icon?: string;
  onClick?: () => void;
  type?: 'item' | 'divider';
}

interface KebabMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  menuItems: MenuItem[];
}

export const KebabMenu: React.FC<KebabMenuProps> = ({ 
  isOpen, 
  onToggle,
  menuItems
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="kebab-menu-wrapper" ref={menuRef}>
      <button className="kebab-button" onClick={onToggle}>
        ⋮
      </button>
      {isOpen && (
        <div className="kebab-menu">
          {menuItems.map((item, index) => {
            if (item.type === 'divider') {
              return <div key={index} className="menu-divider" />;
            }
            
            return (
              <button 
                key={index} 
                className="menu-item"
                onClick={item.onClick}
              >
                {item.icon && <span className="menu-icon">{item.icon}</span>}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
