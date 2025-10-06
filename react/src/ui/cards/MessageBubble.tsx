import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isOwn: boolean;
  sender?: string;
  showSender?: boolean;
}

const MessageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOwn',
})<{ isOwn: boolean }>(({ theme, isOwn }) => ({
  display: 'flex',
  justifyContent: isOwn ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(1),
}));

const BubblePaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isOwn',
})<{ isOwn: boolean }>(({ theme, isOwn }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: '70%',
  borderRadius: theme.spacing(2),
  backgroundColor: isOwn
    ? theme.palette.primary.main
    : theme.palette.grey[100],
  color: isOwn
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  ...(isOwn ? {
    borderBottomRightRadius: theme.spacing(0.5),
  } : {
    borderBottomLeftRadius: theme.spacing(0.5),
  }),
  position: 'relative',
}));

const SenderText = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
  opacity: 0.8,
}));

const MessageText = styled(Typography)({
  wordBreak: 'break-word',
  lineHeight: 1.4,
});

const TimeText = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  marginTop: theme.spacing(0.5),
  opacity: 0.7,
  textAlign: 'right',
}));

export const AppMessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  timestamp,
  isOwn,
  sender,
  showSender = false,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <MessageContainer isOwn={isOwn}>
      <BubblePaper elevation={1} isOwn={isOwn}>
        {showSender && sender && !isOwn && (
          <SenderText variant="caption">
            {sender}
          </SenderText>
        )}
        <MessageText variant="body2">
          {message}
        </MessageText>
        <TimeText variant="caption">
          {formatTime(timestamp)}
        </TimeText>
      </BubblePaper>
    </MessageContainer>
  );
};