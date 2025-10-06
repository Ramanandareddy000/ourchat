import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AppIconButtonProps extends IconButtonProps {
  tooltip?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

const StyledIconButton = styled(MuiIconButton)<{ variant?: string }>(({ theme, variant }) => ({
  ...(variant === 'primary' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(variant === 'secondary' && {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  }),
  ...(variant === 'danger' && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  }),
}));

export const AppIconButton: React.FC<AppIconButtonProps> = ({
  children,
  tooltip,
  variant = 'default',
  ...props
}) => {
  const button = (
    <StyledIconButton variant={variant} {...props}>
      {children}
    </StyledIconButton>
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }

  return button;
};