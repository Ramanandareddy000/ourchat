import React from 'react';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { AppMenu, MenuItemConfig } from '../../ui';

interface MenuItem {
  label?: string;
  icon?: string | React.ReactElement;
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
  // Convert old MenuItem format to new MenuItemConfig format
  const convertedMenuItems: MenuItemConfig[] = menuItems.map(item => ({
    label: item.label,
    icon: item.icon ? (typeof item.icon === 'string' ? <span>{item.icon}</span> : item.icon) : undefined,
    onClick: item.onClick,
    type: item.type,
  }));

  return (
    <AppMenu
      menuItems={convertedMenuItems}
      open={isOpen}
      onToggle={onToggle}
      triggerIcon={<MoreVertIcon />}
    />
  );
};
