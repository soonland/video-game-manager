import { CssBaseline } from "@mui/material";
import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import "./i18n";
import GameFormPage from "./pages/GameFormPage";
import GamesPage from "./pages/GamesPage";
import PlatformFormPage from "./pages/PlatformFormPage";
import PlatformsPage from "./pages/PlatformsPage";

const App = () => (
  <Suspense fallback="loading">
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/games" replace />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/new" element={<GameFormPage />} />
          <Route path="/games/:id/edit" element={<GameFormPage />} />
          <Route path="/platforms" element={<PlatformsPage />} />
          <Route path="/platforms/new" element={<PlatformFormPage />} />
          <Route path="/platforms/:id/edit" element={<PlatformFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Suspense>
);

export default App;
