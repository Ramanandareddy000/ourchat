import React, { useState } from 'react';
import { User } from '../../types';
import './Avatar.scss';

interface AvatarProps {
  user: User;
  size: number;
}

export const Avatar: React.FC<AvatarProps> = ({ user, size }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${Math.max(12, size / 2.5)}px`,
  };

  // Use avatar_url first, then fallback to image if available
  const avatarSource = user.avatar_url || user.image;

  // Get initials for fallback
  const getInitials = () => {
    const name = user.display_name || user.username || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={`avatar ${user.online ? "online" : ""}`} style={style}>
      {avatarSource && !imageError ? (
        <img
          src={avatarSource}
          alt={user.display_name || user.username || 'User avatar'}
          onLoad={() => {
            setImageLoaded(true);
          }}
          onError={() => {
            console.log("Image failed to load:", avatarSource);
            setImageError(true);
            setImageLoaded(false);
          }}
        />
      ) : null}
      {/* Fallback avatar - always rendered, shown when image fails or no image */}
      <div 
        className="avatar-fallback"
        style={{ 
          display: (!avatarSource || imageError || !imageLoaded) ? 'flex' : 'none'
        }}
      >
        {getInitials()}
      </div>
    </div>
  );
};
