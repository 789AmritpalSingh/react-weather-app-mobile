// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Example primary color
    },
    secondary: {
      main: '#dc004e', // Example secondary color
    },
    background: {
      default: '#f0f2f5', // Light grey background
      paper: '#ffffff', // White background for components like Cards
    },
    text: {
      primary: '#333333', // Primary text color
      secondary: '#555555', // Secondary text color
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.33,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    // Use this section to customize specific components globally
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disables uppercase text for buttons
        },
      },
    },
  },
});

export default theme;
