import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import {
  LockClock as ExpiredIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { AppButton } from '../buttons/AppButton';

interface SessionExpiredDialogProps {
  open: boolean;
  onLogin: () => void;
  reason?: 'expired' | 'invalid' | 'server_error';
}

export const SessionExpiredDialog: React.FC<SessionExpiredDialogProps> = ({
  open,
  onLogin,
  reason = 'expired',
}) => {
  const getTitle = () => {
    switch (reason) {
      case 'invalid':
        return 'Invalid Session';
      case 'server_error':
        return 'Session Error';
      default:
        return 'Session Expired';
    }
  };

  const getMessage = () => {
    switch (reason) {
      case 'invalid':
        return 'Your session token is invalid. This may happen if you logged in from another device.';
      case 'server_error':
        return 'There was an error verifying your session. Please log in again.';
      default:
        return 'Your session has expired for security reasons. Please log in again to continue.';
    }
  };

  const getSeverity = () => {
    switch (reason) {
      case 'invalid':
      case 'server_error':
        return 'error' as const;
      default:
        return 'warning' as const;
    }
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
          <ExpiredIcon color="error" />
          <Typography variant="h6" component="span">
            {getTitle()}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity={getSeverity()} sx={{ mb: 2 }}>
          {getMessage()}
        </Alert>

        <Typography variant="body2" color="text.secondary">
          Don't worry - your data is safe. Click the button below to log in again.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <AppButton
          variant="primary"
          onClick={onLogin}
          startIcon={<LoginIcon />}
          size="medium"
          fullWidth
          autoFocus
        >
          Go to Login
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};