import React, { useRef } from 'react';
import {
  Box,
  TextField,
  Paper,
  Grow,
} from '@mui/material';
import {
  EmojiEmotions,
  AttachFile,
  CameraAlt,
  Send
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { AppIconButton } from '../buttons';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onEmojiClick?: () => void;
  onAttachFile?: () => void;
  onCameraClick?: () => void;
  placeholder?: string;
  disabled?: boolean;
  showEmojiPicker?: boolean;
  emojiPicker?: React.ReactNode;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[200]}`,
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    backgroundColor: 'transparent',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: theme.spacing(1, 0),
    maxHeight: '120px',
    overflowY: 'auto',
  },
}));

export const AppMessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onEmojiClick,
  onAttachFile,
  onCameraClick,
  placeholder = 'Type a message...',
  disabled = false,
  showEmojiPicker = false,
  emojiPicker,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <StyledPaper elevation={1}>
        {onEmojiClick && (
          <AppIconButton
            onClick={onEmojiClick}
            size="small"
            disabled={disabled}
          >
            <EmojiEmotions />
          </AppIconButton>
        )}

        <StyledTextField
          inputRef={textareaRef}
          multiline
          maxRows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          variant="outlined"
          size="small"
        />

        {onAttachFile && (
          <AppIconButton
            onClick={onAttachFile}
            size="small"
            disabled={disabled}
          >
            <AttachFile />
          </AppIconButton>
        )}

        {onCameraClick && (
          <AppIconButton
            onClick={onCameraClick}
            size="small"
            disabled={disabled}
          >
            <CameraAlt />
          </AppIconButton>
        )}

        <AppIconButton
          onClick={onSend}
          size="small"
          variant={value.trim() ? 'primary' : 'default'}
          disabled={!value.trim() || disabled}
        >
          <Send />
        </AppIconButton>
      </StyledPaper>

      {showEmojiPicker && emojiPicker && (
        <Grow in={showEmojiPicker}>
          <Box
            sx={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              zIndex: 1000,
              mb: 1,
            }}
          >
            {emojiPicker}
          </Box>
        </Grow>
      )}
    </Box>
  );
};