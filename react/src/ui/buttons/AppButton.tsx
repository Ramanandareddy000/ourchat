import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AppButtonProps extends Omit<ButtonProps, 'loading' | 'variant'> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'small' | 'medium' | 'large';
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'loading',
})<AppButtonProps>(({ theme, variant: customVariant, size }) => ({
  ...(customVariant === 'primary' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(customVariant === 'secondary' && {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  }),
  ...(customVariant === 'danger' && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  }),
  ...(customVariant === 'ghost' && {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  }),
  ...(customVariant === 'link' && {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    '&:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'none',
    },
  }),
  ...(size === 'small' && {
    padding: '4px 12px',
    fontSize: '0.75rem',
  }),
  ...(size === 'large' && {
    padding: '12px 24px',
    fontSize: '1rem',
  }),
}));

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  loading = false,
  disabled,
  variant = 'primary',
  size = 'medium',
  ...props
}) => {
  return (
    <StyledButton
      disabled={disabled || loading}
      size={size}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : props.startIcon}
      {...props}
    >
      {children}
    </StyledButton>
  );
};