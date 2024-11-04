import { Box, List, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import ConfirmationDialog from "./ConfirmationDialog";
import GameItem from "./GameItem";
import ListControl from "./ListControl";

const GameList = ({ games, onDeleteGame, onEditGame }) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checked, setChecked] = useState([]);

  const addToList = (gameId) => {
    setChecked([...checked, gameId]);
  };

  const removeFromList = (gameId) => {
    setChecked(checked.filter((id) => id !== gameId));
  };

  const handleCheck = (gameId) => {
    if (checked.includes(gameId)) {
      removeFromList(gameId);
    } else {
      addToList(gameId);
    }
  };

  const handleCheckAll = () => {
    if (checked.length === games.length) {
      setChecked([]);
    } else {
      setChecked(games.map((game) => game.id));
    }
  };

  const handleConfirm = (gameIds) => {
    setChecked(gameIds);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    checked.forEach((id) => {
      onDeleteGame(id);
    });
    setChecked([]);
    setDialogOpen(false);
  };

  const handleEdit = (gameIds) => {
    onEditGame(gameIds);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 2,
          padding: 2,
        }}
      >
        <ListControl
          count={checked.length}
          onDelete={() => handleConfirm(checked)}
          onCheckAll={handleCheckAll}
        />
        {games.length === 0 ? (
          <Typography variant="h6" align="center" color="text.secondary">
            {t("gameList.noGames")}
          </Typography>
        ) : (
          <List>
            {games.map((game, index) => {
              const k = index;
              return (
                <GameItem
                  key={k}
                  game={game}
                  onDelete={() => handleConfirm([game.id])}
                  onEdit={() => handleEdit(game.id)}
                  isChecked={checked.includes(game.id)}
                  onCheck={() => handleCheck(game.id)}
                />
              );
            })}
          </List>
        )}
      </Box>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => handleDelete()}
      />
    </>
  );
};

// PropTypes pour le composant
GameList.propTypes = {
  games: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      platform: PropTypes.string.isRequired,
      genre: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onDeleteGame: PropTypes.func.isRequired,
  onEditGame: PropTypes.func.isRequired,
};

export default GameList;