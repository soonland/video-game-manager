import { Close } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

const GameDetail = ({ open, onClose, game }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {game?.name}
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {game && (
          <>
            <Typography variant="body1">{`Year: ${game.year}`}</Typography>
            <Typography variant="body1">{`Genre: ${game.genre}`}</Typography>
            {game.platform && (
              <Typography variant="body1">{`Platform: ${game.platform.name}`}</Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

GameDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  game: PropTypes.shape({
    name: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    genre: PropTypes.string.isRequired,
    platform: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }),
};

export default GameDetail;
