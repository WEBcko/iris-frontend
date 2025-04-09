import { createTheme, Theme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom?: {
      gradient: string;
    };
  }
  interface ThemeOptions {
    custom?: {
      gradient?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#1d2764",
      light: "#6573c3",
      dark: "#2c387e",
    },
    secondary: {
      main: "#bb189f",
    },
    background: {
      default: "#f5f5f5",
    },
  },

  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
    },
  },

  spacing: 8,

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
  },

  custom: {
    gradient: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  },
});

export default theme;
