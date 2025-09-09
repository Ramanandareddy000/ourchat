import React from 'react';
import { User } from '../../types';
import './Avatar.scss';

interface AvatarProps {
  user: User;
  size: number;
}

export const Avatar: React.FC<AvatarProps> = ({ user, size }) => {
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      {user.image ? (
        <img 
          src={user.image} 
          alt={user.name}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            const fallback = img.nextElementSibling as HTMLElement;
            img.style.display = 'none';
            if (fallback) fallback.style.display = 'flex';
          }}
        />
      ) : null}
      <span className="avatar-fallback" style={{ display: user.image ? 'none' : 'flex' }}>
        {user.avatar}
      </span>
    </div>
  );
};
