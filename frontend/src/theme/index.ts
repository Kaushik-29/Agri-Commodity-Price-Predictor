import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { colors } from './colors';

// Create the base theme
let theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: colors.primary.contrastText,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: colors.secondary.contrastText,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    error: {
      main: colors.status.error,
    },
    warning: {
      main: colors.status.warning,
    },
    info: {
      main: colors.status.info,
    },
    success: {
      main: colors.status.success,
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: colors.primary.dark,
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '0 16px',
          '&.Mui-expanded': {
            minHeight: 48,
          },
        },
        content: {
          '&.Mui-expanded': {
            margin: '12px 0',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '0 16px 16px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: colors.primary.light,
            color: colors.primary.contrastText,
            '&:hover': {
              backgroundColor: colors.primary.main,
            },
          },
        },
      },
    },
  },
});

// Make typography responsive
theme = responsiveFontSizes(theme);

export default theme; 