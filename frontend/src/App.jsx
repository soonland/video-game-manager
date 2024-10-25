import { Container, Typography, Button, CssBaseline, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, Suspense } from "react";
import { useTranslation } from "react-i18next";

import GameForm from "./components/GameForm";
import GameList from "./components/GameList";

import "./i18n";

const App = () => {
  const { t, i18n } = useTranslation();
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const theme = useTheme();
  const [lng, setLng] = useState(i18n.language);

  const changeLanguage = () => {
    setLng(lng === "en" ? "fr" : "en");
    i18n.changeLanguage(lng === "en" ? "fr" : "en");
  };

  const loadGames = async () => {
    fetch("/api/games")
      .then((response) => response.json())
      .then((data) => {
        setGames(data.games); // Supposons que setGames est utilisé pour stocker la liste des jeux
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      });
  };

  useEffect(() => {
    loadGames();
  }, []);

  const addGame = async (gameData) => {
    await new Promise((r) => setTimeout(r, 2000));
    fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    })
      .then((response) => response.json())
      .then(() => {
        loadGames();
      })
      .catch((error) => {
        console.error("Error:", error);
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
      .then((response) => response.json())
      .then((data) => {
        console.log("Game updated:", data);
        loadGames();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteGame = async (idToDelete) => {
    fetch(`/api/games/${idToDelete}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Game deleted:", data);
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
        <Button
          variant="contained"
          onClick={changeLanguage}
          data-testid="app.btn.switch.language"
        >
          {lng === "en" ? "Switch to French" : "Passer en anglais"}
        </Button>
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
        <GameList
          games={games}
          onDeleteGame={deleteGame}
          onEditGame={editGame}
        />
      </Container>
    </Suspense>
  );
};

export default App;
