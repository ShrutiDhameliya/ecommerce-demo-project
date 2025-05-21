import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#D2D0A0', // Soft Beige
      paper: '#9EBC8A',   // Light Olive Green
    },
    success: {
      main: '#9EBC8A',
    },
    warning: {
      main: '#D2D0A0',
    },
    info: {
      main: '#73946B',
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
    ].join(','),
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
          boxShadow: '0 2px 8px rgba(83,125,93,0.08)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(83,125,93,0.16)',
            transform: 'translateY(-2px) scale(1.03)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(180deg, #537D5D 0%, #73946B 33%, #9EBC8A 66%, #D2D0A0 100%)',
          color: '#2d3a2e',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(83,125,93,0.10)',
          transition: 'box-shadow 0.3s, transform 0.3s',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(83,125,93,0.18)',
            transform: 'translateY(-4px) scale(1.02)',
          },
        },
      },
    },
  },
});

export default theme; 