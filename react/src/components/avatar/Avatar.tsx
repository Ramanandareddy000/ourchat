import React from 'react';
import { User } from '../../types';
import { AppAvatar } from '../../ui';

interface AvatarProps {
  user: User;
  size: number;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({ user, size, onClick }) => {
  return (
    <AppAvatar
      user={user}
      size={size}
      showOnlineStatus={true}
      onClick={onClick}
    />
  );
};
