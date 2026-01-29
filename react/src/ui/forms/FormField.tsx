import React from 'react';
import {
  TextField,
  TextFieldProps,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface FormFieldProps extends Omit<TextFieldProps, 'variant'> {
  name: string;
  label: string;
  helperText?: string;
  errorMessage?: string;
  variant?: 'outlined' | 'filled' | 'standard';
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
  },
  '& .MuiFormLabel-root': {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
}));

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  helperText,
  errorMessage,
  variant = 'outlined',
  error,
  ...props
}) => {
  const hasError = Boolean(error || errorMessage);
  const displayHelperText = errorMessage || helperText;

  return (
    <StyledTextField
      name={name}
      label={label}
      variant={variant}
      error={hasError}
      helperText={displayHelperText}
      fullWidth
      margin="normal"
      {...props}
    />
  );
};