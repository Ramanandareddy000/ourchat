import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AppTextInputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    transition: theme.transitions.create(['border-color', 'box-shadow', 'background-color'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: theme.spacing(1.5, 2),
  },
  '& .MuiInputLabel-root': {
    transform: 'translate(16px, 14px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(16px, -6px) scale(0.75)',
    },
  },
}));

export const AppTextInput: React.FC<AppTextInputProps> = ({
  variant = 'outlined',
  ...props
}) => {
  return (
    <StyledTextField
      variant={variant}
      {...props}
    />
  );
};