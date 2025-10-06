import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  LinearProgress,
  Box,
  Alert,
} from '@mui/material';
import {
  Warning as WarningIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { AppButton } from '../buttons/AppButton';
import { JWTUtils } from '../../utils/jwt';

interface SessionWarningProps {
  open: boolean;
  timeRemaining: number; // in milliseconds
  onExtendSession?: () => void;
  onLogout: () => void;
  autoLogoutTime?: number; // in minutes
}

export const SessionWarning: React.FC<SessionWarningProps> = ({
  open,
  timeRemaining,
  onExtendSession,
  onLogout,
  autoLogoutTime = 1,
}) => {
  const [countdown, setCountdown] = useState(timeRemaining);

  useEffect(() => {
    setCountdown(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        const newValue = Math.max(0, prev - 1000);
        if (newValue <= 0) {
          onLogout();
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, onLogout]);

  const minutes = Math.floor(countdown / (60 * 1000));
  const seconds = Math.floor((countdown % (60 * 1000)) / 1000);
  const progressPercentage = Math.max(0, (countdown / timeRemaining) * 100);

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="warning" />
          <Typography variant="h6" component="span">
            Session Expiring Soon
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your session will expire automatically in{' '}
          <strong>{autoLogoutTime} minute{autoLogoutTime !== 1 ? 's' : ''}</strong>{' '}
          to protect your account.
        </Alert>

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <TimeIcon color="primary" />
          <Typography variant="h4" color="primary" fontWeight="bold">
            {formatTime(minutes, seconds)}
          </Typography>
        </Box>

        <Box mb={2}>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            color={progressPercentage > 50 ? 'primary' : progressPercentage > 25 ? 'warning' : 'error'}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          {onExtendSession
            ? 'Click "Stay Logged In" to continue your session, or you will be automatically logged out.'
            : 'You will be automatically logged out when the timer reaches zero.'
          }
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <AppButton
          variant="secondary"
          onClick={onLogout}
          size="medium"
        >
          Logout Now
        </AppButton>
        {onExtendSession && (
          <AppButton
            variant="primary"
            onClick={onExtendSession}
            size="medium"
            autoFocus
          >
            Stay Logged In
          </AppButton>
        )}
      </DialogActions>
    </Dialog>
  );
};