import { createTheme, lighten } from "@mui/material/styles";

// Définition des couleurs
const primaryColor = "#235789"; // Couleur primaire
const secondaryColor = "#c1292e"; // Couleur secondaire
const textColor = "#020100"; // Couleur du texte
const contrastText = "#fdfffc"; // Couleur de texte contrastée
const backgroundColor = "#fdfffc"; // Couleur d'arrière-plan
const paperColor = "#fdfffc"; // Couleur du papier (utilisé pour les cartes/dialogues)

const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      contrastText: textColor,
    },
    secondary: {
      main: secondaryColor,
      contrastText: textColor,
    },
    background: {
      default: backgroundColor,
      paper: paperColor,
    },
    text: {
      primary: textColor,
      secondary: textColor, // Tu peux aussi définir une autre couleur ici si nécessaire
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    fontSize: 14,
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      color: primaryColor,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: secondaryColor,
    },
    body1: {
      fontSize: "1rem",
      color: textColor,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          borderRadius: 4,
          color: contrastText,
        },
        contained: {
          "&:hover": {
            backgroundColor: lighten(primaryColor, 0.2),
          },
        },
        containedSecondary: {
          "&:hover": {
            backgroundColor: lighten(secondaryColor, 0.2),
          },
        },
        outlined: {
          color: primaryColor,
          "&:hover": {
            backgroundColor: lighten(primaryColor, 0.2),
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
        paper: {
          backgroundColor: paperColor,
          "& .MuiDialogContentText-root": {
            color: textColor,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          "& .MuiSelect-icon": {
            color: textColor,
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: textColor,
          "&.Mui-selected": {
            backgroundColor: primaryColor,
            color: contrastText,
          },
          "&:hover": {
            backgroundColor: primaryColor,
            color: contrastText,
          },
        },
      },
    },
  },
});

export default theme;
