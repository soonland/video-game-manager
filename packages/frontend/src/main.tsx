import { ThemeProvider } from "@mui/material/styles";
import { createRoot } from "react-dom/client";

import App from "./App";
import theme from "./styles/theme";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
);
