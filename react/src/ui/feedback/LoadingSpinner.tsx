import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  centered?: boolean;
  color?: 'primary' | 'secondary' | 'inherit';
}

const CenteredContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(4),
}));

const InlineContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  message,
  centered = false,
  color = 'primary',
}) => {
  const spinner = <CircularProgress size={size} color={color} />;

  if (centered) {
    return (
      <CenteredContainer>
        {spinner}
        {message && (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        )}
      </CenteredContainer>
    );
  }

  if (message) {
    return (
      <InlineContainer>
        {spinner}
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </InlineContainer>
    );
  }

  return spinner;
};