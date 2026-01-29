import React from 'react';
import { Alert, AlertProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ErrorMessageProps extends Omit<AlertProps, 'severity'> {
  message: string;
  variant?: 'filled' | 'outlined' | 'standard';
  closable?: boolean;
  onClose?: () => void;
}

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  variant = 'standard',
  closable = false,
  onClose,
  ...props
}) => {
  return (
    <StyledAlert
      severity="error"
      variant={variant}
      onClose={closable ? onClose : undefined}
      {...props}
    >
      {message}
    </StyledAlert>
  );
};