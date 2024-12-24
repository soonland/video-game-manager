import {
  Settings as SettingsIcon,
  Translate as TranslateIcon,
  SportsEsports as SportsEsportsIcon,
} from "@mui/icons-material";
import {
  Chip,
  Container,
  Typography,
  CssBaseline,
  Box,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  TextField,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, Suspense } from "react";
import { useTranslation } from "react-i18next";

import GameForm from "./components/GameForm";
import GameList from "./components/GameList";
import SettingsPanel from "./components/Settings/Platforms";
import "./i18n";

const App = () => {
  const { t, i18n } = useTranslation();
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const [lng, setLng] = useState(i18n.language);
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const changeLanguage = () => {
    setLng(lng === "en" ? "fr" : "en");
    i18n.changeLanguage(lng === "en" ? "fr" : "en");
  };

  const loadGames = async () => {
    fetch("/api/games?$expand=platform")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }
        return response.json();
      })
      .then((data) => {
        setGames(data.games); // Supposons que setGames est utilisé pour stocker la liste des jeux
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      });
  };

  const loadPlatforms = async () => {
    fetch("/api/platforms")
      .then((response) => response.json())
      .then((data) => setPlatforms(data.platforms))
      .catch((error) => console.error("Error fetching platforms:", error));
  };

  useEffect(() => {
    loadGames();
    loadPlatforms();
  }, []);

  const addGame = async (gameData) => {
    await new Promise((r) => setTimeout(r, 2000));
    await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to add game");
        }
        setSnackbarMessage(t("gameForm.added"));
        setSnackbarOpen(true);
        return response.json();
      })
      .then(async () => {
        await loadGames();
      });
  };

  const updateGame = async (gameData) => {
    await new Promise((r) => setTimeout(r, 2000));
    fetch(`/api/games/${gameData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add game");
        }
        setSnackbarMessage(t("gameForm.updated"));
        setSnackbarOpen(true);
        return response.json();
      })

      .then((data) => {
        console.log("Game updated:", data);
        loadGames();
      })
      .catch((error) => {
        throw error;
      });
  };

  const deleteGame = async (idToDelete) => {
    fetch(`/api/games/${idToDelete}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setSnackbarMessage(t("gameForm.deleted"));
        setSnackbarOpen(true);
        loadGames();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const editGame = (idToEdit) => {
    setCurrentGame(games.find((game) => game.id === idToEdit));
  };

  const onReset = () => {
    setCurrentGame(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openPlatformSettings = () => {
    setOpenSettings(true);
    handleClose();
  };

  const handleCloseSettings = (e, reason) => {
    if (reason === "backdropClick") {
      return;
    }
    setOpenSettings(false);
  };

  const handlePlatformChange = (event) => {
    setSelectedPlatforms(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredGames = games.filter((game) => {
    return (
      (selectedPlatforms.length === 0 ||
        selectedPlatforms.includes(game.platform.id)) &&
      (!searchTerm ||
        game.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Suspense fallback="loading">
      <CssBaseline />
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.common.white,
          padding: 3,
          borderRadius: 4,
        }}
      >
        <Stack direction={"row"} justifyContent={"flex-end"} width="100%">
          <IconButton onClick={handleClick} data-testid="app.settingsButton">
            <SettingsIcon />
          </IconButton>
          <Menu
            id="settings-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={changeLanguage}
              data-testid="app.settingsMenu.lang"
            >
              <ListItemIcon>
                <TranslateIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                {t(`app.settingsMenu.lang.${lng === "en" ? "fr" : "en"}`)}
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={openPlatformSettings}
              data-testid="app.settingsMenu.platforms"
            >
              <ListItemIcon>
                <SportsEsportsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t("app.settingsMenu.platforms")}</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
        <Typography variant="h4" py={2}>
          {t("app.title")}
        </Typography>
        <Box
          sx={{
            border: 1,
            borderRadius: 8,
            borderColor: "grey.300",
            px: 8,
            py: 2,
            backgroundColor: "grey.100",
          }}
        >
          <GameForm
            onAdd={addGame}
            onUpdate={updateGame}
            existingGame={currentGame}
            onReset={onReset}
          />
        </Box>
        <Box sx={{ my: 2 }}>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("app.filter.platform")}</InputLabel>
              <Select
                multiple
                value={selectedPlatforms}
                onChange={handlePlatformChange}
                input={
                  <OutlinedInput
                    id="select-multiple-chip"
                    label={t("app.filter.platform")}
                  />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={platforms.find((p) => p.id === value)?.name}
                      />
                    ))}
                  </Box>
                )}
              >
                {platforms.map((platform) => (
                  <MenuItem key={platform.id} value={platform.id}>
                    {platform.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label={t("app.filter.search")}
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
            />
          </Stack>
        </Box>
        <GameList
          games={filteredGames}
          onDeleteGame={deleteGame}
          onEditGame={editGame}
        />
        {openSettings && (
          <SettingsPanel open={openSettings} onClose={handleCloseSettings} />
        )}
        <Snackbar
          data-testid="app.snackbar"
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Suspense>
  );
};

export default App;
