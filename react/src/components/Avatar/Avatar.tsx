import React, { useState } from 'react';
import { User } from '../../types';
import './Avatar.scss';

interface AvatarProps {
  user: User;
  size: number;
}

export const Avatar: React.FC<AvatarProps> = ({ user, size }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="avatar" style={{ width: size, height: size }}>
      {user.image && !imageError ? (
        <img 
          src={user.image} 
          alt={user.name}
          onLoad={() => console.log('Image loaded:', user.image)}
          onError={() => {
            console.log('Image failed to load:', user.image);
            setImageError(true);
          }}
        />
      ) : (
        <span className="avatar-fallback">
          {user.avatar}
        </span>
      )}
    </div>
  );
};
