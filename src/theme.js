import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#22577A', // Lapis Lazuli
      contrastText: '#fff',
    },
    secondary: {
      main: '#38A3A5', // Verdigris
      contrastText: '#fff',
    },
    success: {
      main: '#57CC99', // Emerald
      contrastText: '#fff',
    },
    info: {
      main: '#80ED99', // Light green
      contrastText: '#22577A',
    },
    background: {
      default: '#C7F9CC', // Tea green
      paper: '#fff',
    },
    text: {
      primary: '#22577A',
      secondary: '#38A3A5',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme; 