import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AppAvatar } from '../display/Avatar';
import { User } from '../../types';

interface UserCardProps {
  user: User;
  lastMessage?: string;
  timestamp?: string;
  isActive?: boolean;
  onClick?: () => void;
  showOnlineStatus?: boolean;
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  backgroundColor: isActive ? theme.palette.primary.light + '20' : 'transparent',
  boxShadow: 'none',
  borderRadius: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(isActive && {
    backgroundColor: theme.palette.primary.light + '20',
    borderLeft: `3px solid ${theme.palette.primary.main}`,
  }),
}));

const UserInfo = styled(Box)({
  flex: 1,
  minWidth: 0, // Allows text to truncate
});

const UserName = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '0.875rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const LastMessage = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  marginTop: theme.spacing(0.25),
}));

const Timestamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  flexShrink: 0,
  marginLeft: theme.spacing(1),
}));

export const UserCard: React.FC<UserCardProps> = ({
  user,
  lastMessage,
  timestamp,
  isActive = false,
  onClick,
  showOnlineStatus = false,
}) => {
  return (
    <StyledCard isActive={isActive} onClick={onClick}>
      <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <AppAvatar
          user={user}
          size="medium"
          showOnlineStatus={showOnlineStatus}
        />
        <UserInfo>
          <UserName>
            {user.display_name || user.username}
          </UserName>
          {lastMessage && (
            <LastMessage>
              {lastMessage}
            </LastMessage>
          )}
        </UserInfo>
        {timestamp && (
          <Timestamp>
            {timestamp}
          </Timestamp>
        )}
      </CardContent>
    </StyledCard>
  );
};