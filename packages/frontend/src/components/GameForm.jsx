import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CustomAlert = styled(Alert)({
  width: "100%",
  "& .MuiList-root": {
    width: "100%",
    padding: 0,
  },
  "& .MuiListItem-root": {
    width: "100%",
    padding: 0,
  },
});

const GameForm = ({ onAdd, onUpdate, existingGame, onReset }) => {
  const { t } = useTranslation();
  const [platforms, setPlatforms] = useState([]);
  const [name, setName] = useState(existingGame ? existingGame.name : "");
  const [year, setYear] = useState(existingGame ? existingGame.year : "");
  const [platform, setPlatform] = useState(
    existingGame ? existingGame.platform : "",
  );
  const [genre, setGenre] = useState(existingGame ? existingGame.genre : "");
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState([]);

  // Identifiants pour les labels
  const nameId = "game-name";
  const yearId = "game-year";
  const platformId = "game-platform";
  const genreId = "game-genre";

  const loadPlatforms = async () => {
    fetch("/api/platforms")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch platforms");
        }
        return response.json();
      })
      .then((data) => {
        setPlatforms(data.platforms); // Supposons que setGames est utilisé pour stocker la liste des jeux
      })
      .catch((error) => {
        console.error("Error fetching platforms:", error);
      });
  };

  useEffect(() => {
    if (existingGame) {
      setName(existingGame.name);
      setYear(existingGame.year);
      setPlatform(existingGame.platform);
      setGenre(existingGame.genre);
      setIsEditing(true);
    }
  }, [existingGame]);

  useEffect(() => {
    loadPlatforms();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (hasError) {
      const timer = setTimeout(() => {
        setHasError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && year && platform && genre) {
      setIsProcessing(true);
      if (isEditing) {
        await onUpdate({
          id: existingGame.id,
          name,
          year: Number(year),
          platform,
          genre,
        })
          .then(() => {
            setName("");
            setYear("");
            setPlatform("");
            setGenre("");
            setIsEditing(false);
            setHasError(false);
            setIsSuccess(true);
            setErrors([]);
          })
          .catch(() => {
            setHasError(true);
            setIsSuccess(false);
            setErrors(["gameForm.errorEdit"]);
          });
      } else {
        await onAdd({ name, year: Number(year), platform, genre })
          .then(() => {
            setName("");
            setYear("");
            setPlatform("");
            setGenre("");
            setIsEditing(false);
            setHasError(false);
            setIsSuccess(true);
            setErrors([]);
          })
          .catch(() => {
            setHasError(true);
            setIsSuccess(false);
            setErrors(["gameForm.errorAdd"]);
          });
      }
    } else {
      setHasError(true);
      setIsSuccess(false);
      setErrors(
        [
          !name && "gameForm.errorName",
          !year && "gameForm.errorYear",
          !platform && "gameForm.errorPlatform",
          !genre && "gameForm.errorGenre",
        ].filter(Boolean),
      );
    }
    setIsProcessing(false);
  };

  const resetForm = () => {
    onReset();
    setName("");
    setYear("");
    setPlatform("");
    setGenre("");
    setIsEditing(false);
    setHasError(false);
    setIsSuccess(false);
    setErrors([]);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack
        direction="column"
        spacing={2}
        data-testid="app.gameForm.container"
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h4" data-testid="app.gameForm.header">
            {isEditing ? t("gameForm.editGame") : t("gameForm.addGame")}
          </Typography>
        </Box>
        <Collapse in={hasError}>
          <CustomAlert severity="error" data-testid="app.gameForm.alert.error">
            <List>
              {errors.map((error, index) => {
                const k = `k${index}`;
                return <ListItem key={k}>{t(error)}</ListItem>;
              })}
            </List>
          </CustomAlert>
        </Collapse>
        <Stack direction="row" spacing={2} data-testid="app.gameForm.fields">
          <TextField
            id={nameId}
            data-testid="app.gameForm.name"
            label={t("gameForm.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            size="small"
            variant="filled"
            error={errors.includes("gameForm.errorName")}
          />
          <TextField
            id={yearId}
            data-testid="app.gameForm.year"
            label={t("gameForm.year")}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            size="small"
            variant="filled"
            error={errors.includes("gameForm.errorYear")}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <FormControl
            fullWidth
            margin="normal"
            size="small"
            required
            error={errors.includes("gameForm.errorPlatform")}
          >
            <InputLabel id={`${platformId}-label`}>
              {t("gameForm.platform")}
            </InputLabel>
            <Select
              id={platformId}
              data-testid="app.gameForm.platform"
              labelId={`${platformId}-label`}
              value={platform}
              label={t("gameForm.platform")}
              onChange={(e) => setPlatform(e.target.value)}
              size="small"
              required
              variant="filled"
            >
              {platforms.map((platform) => (
                <MenuItem key={platform.id} value={platform.id}>
                  {platform.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            margin="normal"
            size="small"
            required
            error={errors.includes("gameForm.errorGenre")}
          >
            <InputLabel id={`${genreId}-label`}>
              {t("gameForm.genre")}
            </InputLabel>
            <Select
              id={genreId}
              data-testid="app.gameForm.genre"
              labelId={`${genreId}-label`}
              label={t("gameForm.genre")}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              size="small"
              required
              variant="filled"
            >
              <MenuItem value="Action">Action</MenuItem>
              <MenuItem value="Aventure">Aventure</MenuItem>
              <MenuItem value="RPG">RPG</MenuItem>
              <MenuItem value="Simulation">Simulation</MenuItem>
              <MenuItem value="Stratégie">Stratégie</MenuItem>
              <MenuItem value="Sport">Sport</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          justifyContent={"space-evenly"}
          data-test="app.gameForm.buttons"
        >
          {isEditing ? (
            <Button
              type="submit"
              data-testid="app.gameForm.btn.update"
              variant="contained"
              color="primary"
              disabled={isProcessing}
              endIcon={
                isProcessing && (
                  <CircularProgress
                    sx={{
                      color: "white",
                    }}
                    size={16}
                  />
                )
              }
            >
              {t("button.update")}
            </Button>
          ) : (
            <Button
              type="submit"
              data-testid="app.gameForm.btn.add"
              variant="contained"
              color="primary"
              disabled={isProcessing}
              endIcon={
                isProcessing && (
                  <CircularProgress
                    sx={{
                      color: "white",
                    }}
                    size={16}
                  />
                )
              }
            >
              {t("button.add")}
            </Button>
          )}
          <Button
            type="reset"
            data-testid="app.gameForm.btn.reset"
            variant="contained"
            disabled={isProcessing}
            color="secondary"
            onClick={resetForm}
          >
            {t("button.reset")}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

// PropTypes pour GameForm
GameForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  existingGame: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    year: PropTypes.number,
    platform: PropTypes.string,
    genre: PropTypes.string,
  }),
};

export default GameForm;
