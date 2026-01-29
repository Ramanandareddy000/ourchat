import React from 'react';
import { User } from '../../types';
import { UserCard } from '../../ui';
import { Box, Typography } from '@mui/material';

interface OnlineUsersProps {
  users: User[];
  currentChatId: number | null;
  onChatSelect: (userId: number) => void;
}

export const OnlineUsers: React.FC<OnlineUsersProps> = ({
  users,
  currentChatId,
  onChatSelect
}) => {
  // Filter to show only online users
  const onlineUsers = users.filter(user =>
    !user.is_group && user.online === true
  );

  if (onlineUsers.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        py={4}
        px={2}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          No users are currently online
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="online-users-list">
      {onlineUsers.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isActive={currentChatId === user.id}
          onClick={() => onChatSelect(user.id)}
          showOnlineStatus={true}
          lastMessage={user.last_seen ? `Last seen: ${user.last_seen}` : 'Online now'}
        />
      ))}
    </Box>
  );
};