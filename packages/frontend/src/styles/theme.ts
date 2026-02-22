import { createTheme } from "@mui/material/styles";

// Design tokens
const primaryColor = "#235789";
const secondaryColor = "#c1292e";

// System-ui font stack matching Vercel/Linear style — Inter if available,
// then falls back through cross-platform system fonts.
const fontFamily =
  '"Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif';

const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      // Subtle blue-grey instead of pure white — gives the sidebar contrast
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
    divider: "#e2e8f0",
  },
  typography: {
    fontFamily,
    fontSize: 14,
    // Tighter line-heights — more information density
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.8125rem",
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    // Slightly rounded global default
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // No ALL-CAPS — professional CMS style
          textTransform: "none",
          borderRadius: 6,
          fontWeight: 600,
          fontSize: "0.875rem",
          // Do NOT hardcode color here — MUI derives contrastText from palette
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          // Subtle layered shadow instead of flat outline
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: "0.875rem",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    // Remove the aggressive blue-on-hover that turned every dropdown option
    // into a primary-coloured block — use MUI's default subtle hover instead.
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          "&.Mui-selected": {
            backgroundColor: `${primaryColor}14`, // 8% opacity tint
            "&:hover": {
              backgroundColor: `${primaryColor}1f`, // 12% on hover
            },
          },
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    // Dense, information-rich table head
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 600,
            color: "#64748b",
            fontSize: "0.6875rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            // Subtle separation between header and body
            borderBottom: "1px solid #e2e8f0",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          // Subtle row hover
          "&.MuiTableRow-hover:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          borderBottom: "1px solid #f1f5f9",
          padding: "10px 16px",
        },
        sizeSmall: {
          padding: "6px 12px",
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          fontSize: "0.8125rem",
          color: "#64748b",
          borderTop: "1px solid #e2e8f0",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: "0.75rem",
          fontWeight: 500,
          borderRadius: 4,
        },
        sizeSmall: {
          height: 20,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "0.75rem",
        },
      },
    },
  },
});

export default theme;
