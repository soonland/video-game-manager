import { ThemeProvider } from "@mui/material/styles";
import { createRoot } from "react-dom/client";

import App from "./App";
import theme from "./styles/theme"; // Assurez-vous que le chemin est correct

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
);
