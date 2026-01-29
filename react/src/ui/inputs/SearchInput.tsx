import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.spacing(3),
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: theme.spacing(1.5, 2),
  },
}));

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  fullWidth = true,
  size = 'medium',
}) => {
  return (
    <StyledTextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size={size}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
};