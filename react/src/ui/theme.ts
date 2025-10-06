import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0',        // Purple (main brand color)
      light: '#ce6bc7',       // Light purple (hover, highlights)
      dark: '#6a1b8f',        // Dark purple (active, pressed)
      contrastText: '#fff',   // White text on primary
    },
    secondary: {
      main: '#ab47bc',        // Light purple (secondary actions)
      light: '#dc8bd4',       // Very light purple (hover, highlights)
      dark: '#7b1fa2',        // Medium dark purple (active, pressed)
      contrastText: '#fff',   // White text on secondary
    },
    error: {
      main: '#f44336',        // Red (errors, destructive)
      light: '#f77066',       // Light red (hover, highlights)
      dark: '#d32f2f',        // Dark red (active, pressed)
      contrastText: '#fff',   // White text on error
    },
    warning: {
      main: '#ff9800',        // Orange (warnings)
      light: '#ffb347',       // Light orange (hover, highlights)
      dark: '#f57c00',        // Dark orange (active, pressed)
      contrastText: '#fff',   // White text on warning
    },
    info: {
      main: '#ba68c8',        // Purple-pink (info, purple theme variant)
      light: '#ce93d8',       // Light purple-pink (hover, highlights)
      dark: '#8e24aa',        // Dark purple-pink (active, pressed)
      contrastText: '#fff',   // White text on info
    },
    success: {
      main: '#4caf50',        // Green (success)
      light: '#81c784',       // Light green (hover, highlights)
      dark: '#388e3c',        // Dark green (active, pressed)
      contrastText: '#fff',   // White text on success
    },
    grey: {
      50: '#F9F9F9',          // Very light grey (backgrounds)
      100: '#F3F3F3',         // Light grey (backgrounds)
      200: '#EBEBEB',         // Light grey (dividers)
      300: '#DEDEDE',         // Medium light grey
      400: '#C7C7C7',         // Medium grey
      500: '#ACACAC',         // Medium grey
      600: '#8A8A8A',         // Darker grey (icons, text)
      700: '#6D6D6D',         // Dark grey (secondary text)
      800: '#4A4A4A',         // Very dark grey
      900: '#2D2D2D',         // Almost black (primary text)
    },
    background: {
      default: '#FFFFFF',     // White (main background)
      paper: '#fafafa',       // Very light grey (cards, surfaces)
    },
    text: {
      primary: '#2D2D2D',     // Dark grey (main text)
      secondary: '#6D6D6D',   // Medium dark grey (secondary text)
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.4,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.3,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
        containedPrimary: {
          backgroundColor: '#9c27b0', // Purple primary button background
          '&:hover': {
            backgroundColor: '#6a1b8f', // Dark purple primary button hover
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});