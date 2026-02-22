import {
  Computer as ComputerIcon,
  SportsEsports as SportsEsportsIcon,
  Translate as TranslateIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 240;

// Derive a human-readable page title from the current pathname
const getPageTitle = (pathname: string, t: (key: string) => string): string => {
  if (pathname.startsWith("/platforms")) return t("app.nav.platforms");
  return t("app.nav.games");
};

const Layout = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [lng, setLng] = useState(i18n.language);

  const changeLanguage = () => {
    const next = lng === "en" ? "fr" : "en";
    setLng(next);
    i18n.changeLanguage(next);
  };

  const pageTitle = getPageTitle(location.pathname, t);

  const sx = {
    mx: 1,
    mb: 0.5,
    borderRadius: 1.5,
    color: "rgba(255,255,255,0.6)",
    borderLeft: "3px solid transparent",
    borderColor: "transparent",
    pl: "16px",
    "&.Mui-selected": {
      bgcolor: "rgba(35, 87, 137, 0.15)",
      color: "#ffffff",
      "&:hover": {
        bgcolor: "rgba(35, 87, 137, 0.22)",
      },
    },
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.06)",
      color: "#ffffff",
    },
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* ── AppBar ───────────────────────────────────────────────────── */}
      {/* White top bar with bottom border — resembles Vercel/Linear nav */}
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          // Sit above the permanent Drawer
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#ffffff",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          {/* Brand mark */}
          <SportsEsportsIcon sx={{ color: "primary.main", flexShrink: 0 }} />
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: "text.primary", letterSpacing: "-0.01em" }}
          >
            {t("app.title")}
          </Typography>

          {/* Vertical rule then current page label */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, borderColor: "divider" }}
          />
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ color: "text.secondary", flex: 1 }}
          >
            {pageTitle}
          </Typography>

          {/* Language toggle — icon + current code label */}
          <IconButton
            onClick={changeLanguage}
            data-testid="app.langButton"
            aria-label="Change language"
            size="small"
            sx={{
              gap: 0.5,
              borderRadius: 1.5,
              px: 1,
              color: "text.secondary",
              "&:hover": { bgcolor: "rgba(0,0,0,0.06)", color: "text.primary" },
            }}
          >
            <TranslateIcon fontSize="small" />
            <Typography variant="caption" fontWeight={600} lineHeight={1}>
              {lng.toUpperCase()}
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      {/* Dark slate sidebar — no elevation shadow, clean hard edge */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "#0f172a",
            // Push down to sit below the fixed AppBar; no top-border artefact
            borderRight: "none",
          },
        }}
      >
        {/* Empty Toolbar acts as a spacer so nav list starts below AppBar */}
        <Toolbar />

        <List disablePadding sx={{ mt: 1 }}>
          {/* Games nav item */}
          <ListItemButton
            component={Link}
            to="/games"
            selected={location.pathname.startsWith("/games")}
            data-testid="nav.games"
            sx={{
              ...sx,
              borderLeft: location.pathname.startsWith("/games")
                ? "3px solid"
                : "3px solid transparent",
              borderColor: location.pathname.startsWith("/games")
                ? "primary.main"
                : "transparent",
              pl: location.pathname.startsWith("/games") ? "13px" : "16px",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: "inherit",
              }}
            >
              <SportsEsportsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={t("app.nav.games")}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: location.pathname.startsWith("/games") ? 600 : 400,
              }}
            />
          </ListItemButton>

          {/* Platforms nav item */}
          <ListItemButton
            component={Link}
            to="/platforms"
            selected={location.pathname.startsWith("/platforms")}
            data-testid="nav.platforms"
            sx={{
              ...sx,
              borderLeft: location.pathname.startsWith("/platforms")
                ? "3px solid"
                : "3px solid transparent",
              borderColor: location.pathname.startsWith("/platforms")
                ? "primary.main"
                : "transparent",
              pl: location.pathname.startsWith("/platforms") ? "13px" : "16px",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: "inherit",
              }}
            >
              <ComputerIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={t("app.nav.platforms")}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: location.pathname.startsWith("/platforms")
                  ? 600
                  : 400,
              }}
            />
          </ListItemButton>
        </List>
      </Drawer>

      {/* ── Main content area ────────────────────────────────────────── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // Standard MUI Toolbar spacer approach — no hardcoded 64px offset
          bgcolor: "background.default",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Spacer that matches AppBar height automatically */}
        <Toolbar />
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
