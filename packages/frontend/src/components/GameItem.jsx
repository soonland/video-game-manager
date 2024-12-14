import { Edit } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ListItem as MuiListItem,
  ListItemText,
  IconButton,
  styled,
  Checkbox,
  Stack,
} from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const ListItem = styled(MuiListItem)(() => ({
  border: `1px solid #F1D302`,
  borderRadius: "8px",
  marginBottom: "8px",
  "&:hover": {
    backgroundColor: "#F1D302",
    cursor: "pointer",
  },
  "&.checked": {
    backgroundColor: "#F1D302",
  },
}));

const GameItem = ({ game, onDelete, onEdit, onCheck, isChecked }) => {
  const { t } = useTranslation();

  const subText = `${t("gameList.year")} : ${game.year} ${t("gameList.genre")} : ${game.genre}`;
  const labelId = `checkbox-list-label-${game.id}`;
  return (
    <ListItem
      className={isChecked ? "checked" : ""}
      data-testid={`gameList.item.root.${game.id}`}
      secondaryAction={
        <Stack direction={"row"} spacing={1}>
          <IconButton
            edge="end"
            color="info"
            aria-label="edit"
            data-testid={`gameList.item.edit.${game.id}`}
            onClick={() => onEdit(parseInt(game.id, 10))}
          >
            <Edit />
          </IconButton>
          <IconButton
            edge="end"
            color="error"
            aria-label="delete"
            data-testid={`gameList.item.delete.${game.id}`}
            onClick={() => onDelete(game.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      }
    >
      <Checkbox
        edge="start"
        checked={isChecked}
        tabIndex={-1}
        onClick={() => onCheck(game.id)}
        data-testid={`app.gameList.item.checkbox.${game.id}`}
        inputProps={{
          "aria-labelledby": labelId,
        }}
      />
      <ListItemText
        onClick={() => onCheck(game.id)}
        primary={game.name}
        secondary={subText}
        primaryTypographyProps={{
          variant: "h6",
        }}
        secondaryTypographyProps={{
          variant: "caption",
        }}
      />
    </ListItem>
  );
};

GameItem.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    platform: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired,
  }).isRequired,
  isChecked: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCheck: PropTypes.func.isRequired,
};

export default GameItem;
