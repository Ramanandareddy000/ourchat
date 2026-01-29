import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface ChatCardProps {
  name: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  isActive?: boolean;
  isOnline?: boolean;
  unreadCount?: number;
  onClick?: () => void;
}

const StyledCard = styled(Card)<{ isActive?: boolean }>(({ theme, isActive }) => ({
  cursor: 'pointer',
  marginBottom: theme.spacing(0.5),
  borderRadius: theme.spacing(1.5),
  backgroundColor: isActive
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  color: isActive
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  boxShadow: isActive
    ? `0 2px 8px ${theme.palette.primary.main}40`
    : 'none',
  border: `1px solid ${theme.palette.grey[200]}`,
  '&:hover': {
    backgroundColor: isActive
      ? theme.palette.primary.dark
      : theme.palette.grey[50],
  },
  transition: theme.transitions.create(['background-color', 'box-shadow']),
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1.5),
  '&:last-child': {
    paddingBottom: theme.spacing(1.5),
  },
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

const OnlineBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
}));

const ChatInfo = styled(Box)({
  flex: 1,
  minWidth: 0,
});

const NameTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  lineHeight: 1.2,
  marginBottom: theme.spacing(0.5),
}));

const MessageTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  opacity: 0.8,
  lineHeight: 1.3,
}));

const MetaBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: theme.spacing(0.5),
}));

const TimestampTypography = styled(Typography)({
  fontSize: '0.6875rem',
  opacity: 0.7,
});

const UnreadBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    fontSize: '0.625rem',
    minWidth: '18px',
    height: '18px',
  },
}));

export const ChatCard: React.FC<ChatCardProps> = ({
  name,
  avatar,
  lastMessage,
  timestamp,
  isActive = false,
  isOnline = false,
  unreadCount = 0,
  onClick,
}) => {
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <StyledCard isActive={isActive} onClick={onClick}>
      <StyledCardContent>
        <OnlineBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          invisible={!isOnline}
        >
          <Avatar
            src={avatar}
            sx={{ width: 40, height: 40 }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
        </OnlineBadge>

        <ChatInfo>
          <NameTypography variant="subtitle2" noWrap>
            {name}
          </NameTypography>
          {lastMessage && (
            <MessageTypography variant="body2" noWrap>
              {lastMessage}
            </MessageTypography>
          )}
        </ChatInfo>

        <MetaBox>
          {timestamp && (
            <TimestampTypography variant="caption">
              {formatTime(timestamp)}
            </TimestampTypography>
          )}
          {unreadCount > 0 && (
            <UnreadBadge badgeContent={unreadCount} color="primary">
              <div />
            </UnreadBadge>
          )}
        </MetaBox>
      </StyledCardContent>
    </StyledCard>
  );
};