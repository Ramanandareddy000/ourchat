import React, { useState } from 'react';
import { Avatar as MuiAvatar, Badge, BadgeProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { User } from '../../types';
import { getAvatarSource, getUserInitials } from '../../utils/avatarUtils';

interface AppAvatarProps {
  user: User;
  size?: number | 'small' | 'medium' | 'large';
  showOnlineStatus?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeMap = {
  small: 32,
  medium: 40,
  large: 56,
};

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#4caf50', // green for online status
    color: '#4caf50',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: 12,
    height: 12,
    borderRadius: '50%',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const StyledAvatar = styled(MuiAvatar, {
  shouldForwardProp: (prop) => prop !== 'clickable',
})<{ clickable?: boolean }>(({ theme, clickable }) => ({
  cursor: clickable ? 'pointer' : 'default',
  backgroundColor: '#9c27b0', // purple background
  color: '#ffffff', // white text color
  transition: theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.short,
  }),
  ...(clickable && {
    '&:hover': {
      transform: 'scale(1.05)',
    },
  }),
}));

export const AppAvatar: React.FC<AppAvatarProps> = ({
  user,
  size = 'medium',
  showOnlineStatus = false,
  onClick,
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  const avatarSize = typeof size === 'number' ? size : sizeMap[size];
  const avatarSource = getAvatarSource(user);

  const avatar = (
    <StyledAvatar
      src={avatarSource && !imageError ? avatarSource : undefined}
      sx={{ width: avatarSize, height: avatarSize }}
      onClick={onClick}
      clickable={!!onClick}
      className={className}
      onError={() => setImageError(true)}
    >
      {(!avatarSource || imageError) && getUserInitials(user)}
    </StyledAvatar>
  );

  if (showOnlineStatus && user.online) {
    return (
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        {avatar}
      </StyledBadge>
    );
  }

  return avatar;
};