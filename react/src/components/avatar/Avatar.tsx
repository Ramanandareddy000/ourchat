import React, { useState } from 'react';
import { User } from '../../types';
import './Avatar.scss';

interface AvatarProps {
  user: User;
  size: number;
}

export const Avatar: React.FC<AvatarProps> = ({ user, size }) => {
  const [imageError, setImageError] = useState(false);

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${Math.max(12, size / 2.5)}px`,
  };

  return (
    <div className={`avatar ${user.online ? "online" : ""}`} style={style}>
      {user.avatar_url && !imageError ? (
        <img
          src={user.avatar_url}
          alt={user.display_name}
          onError={() => {
            console.log("Image failed to load:", user.avatar_url);
            setImageError(true);
          }}
        />
      ) : (
        <div className="avatar-fallback">
          {user.display_name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};
