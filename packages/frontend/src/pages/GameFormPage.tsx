import { Card, CardContent, CardHeader } from "@mui/material";
import { Game, Genre, Status } from "@vgm/types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import GameForm from "../components/GameForm";

const GameFormPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined;

  const [existingGame, setExistingGame] = useState<Game | null>(null);

  useEffect(() => {
    if (isEditing) {
      fetch(`/api/games/${id}?$expand=platform`)
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch game");
          return r.json();
        })
        .then((data: { game: Game }) => setExistingGame(data.game))
        .catch((err: Error) => console.error(err));
    }
  }, [id, isEditing]);

  const handleAdd = async (gameData: {
    name: string;
    year: number;
    platform: number;
    genre: Genre;
    status: Status;
    rating: number | null;
  }) => {
    await new Promise((r) => setTimeout(r, 2000));
    const response = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameData),
    });
    if (!response.ok) {
      throw new Error("Failed to add game");
    }
    navigate("/games", { state: { message: t("gameForm.added") } });
  };

  const handleUpdate = async (gameData: {
    id: number;
    name: string;
    year: number;
    platform: number;
    genre: Genre;
    status: Status;
    rating: number | null;
  }) => {
    await new Promise((r) => setTimeout(r, 2000));
    const response = await fetch(`/api/games/${gameData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameData),
    });
    if (!response.ok) {
      throw new Error("Failed to update game");
    }
    navigate("/games", { state: { message: t("gameForm.updated") } });
  };

  return (
    <Card
      elevation={0}
      variant="outlined"
      sx={{ borderRadius: 2, maxWidth: 680 }}
    >
      <CardHeader
        title={isEditing ? t("gameForm.editGame") : t("gameForm.addGame")}
        titleTypographyProps={{ variant: "h5" }}
        sx={{ borderBottom: "1px solid", borderColor: "divider", pb: 2 }}
      />
      <CardContent sx={{ pt: 3 }}>
        <GameForm
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          existingGame={existingGame}
          onReset={() => navigate("/games")}
        />
      </CardContent>
    </Card>
  );
};

export default GameFormPage;
