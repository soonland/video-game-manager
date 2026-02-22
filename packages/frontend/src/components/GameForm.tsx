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
  Rating,
  Select,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Game, Genre, GENRES, Platform, STATUSES, Status } from "@vgm/types";
import { FormEvent, useEffect, useState } from "react";
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

interface GameFormProps {
  onAdd: (gameData: {
    name: string;
    year: number;
    platform: number;
    genre: Genre;
    status: Status;
    rating: number | null;
  }) => Promise<void>;
  onUpdate: (gameData: {
    id: number;
    name: string;
    year: number;
    platform: number;
    genre: Genre;
    status: Status;
    rating: number | null;
  }) => Promise<void>;
  onReset: () => void;
  existingGame?: Game | null;
}

const GameForm = ({
  onAdd,
  onUpdate,
  existingGame,
  onReset,
}: GameFormProps) => {
  const { t } = useTranslation();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [name, setName] = useState(existingGame ? existingGame.name : "");
  const [year, setYear] = useState<number | string>(
    existingGame ? existingGame.year : "",
  );
  // Always store platform as ID (number), not as object
  const [platform, setPlatform] = useState<number | "">(
    existingGame?.platform?.id ?? "",
  );
  const [genre, setGenre] = useState<Genre | "">(
    existingGame ? existingGame.genre : "",
  );
  const [status, setStatus] = useState<Status>(
    existingGame?.status ?? "Not Started",
  );
  const [rating, setRating] = useState<number | null>(
    existingGame?.rating ?? null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

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
      .then((data: { platforms: Platform[] }) => {
        setPlatforms(data.platforms);
      })
      .catch((error: Error) => {
        console.error("Error fetching platforms:", error);
      });
  };

  useEffect(() => {
    if (existingGame) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setName(existingGame.name);
      setYear(existingGame.year);
      setPlatform(existingGame.platform?.id ?? "");
      setGenre(existingGame.genre);
      setStatus(existingGame.status ?? "Not Started");
      setRating(existingGame.rating ?? null);
      setIsEditing(true);
      /* eslint-enable react-hooks/set-state-in-effect */
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (name && year && platform && genre) {
      setIsProcessing(true);
      if (isEditing && existingGame) {
        await onUpdate({
          id: existingGame.id,
          name,
          year: Number(year),
          platform: platform as number,
          genre: genre as Genre,
          status,
          rating,
        })
          .then(() => {
            setName("");
            setYear("");
            setPlatform("");
            setGenre("");
            setStatus("Not Started");
            setRating(null);
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
        await onAdd({
          name,
          year: Number(year),
          platform: platform as number,
          genre: genre as Genre,
          status,
          rating,
        })
          .then(() => {
            setName("");
            setYear("");
            setPlatform("");
            setGenre("");
            setStatus("Not Started");
            setRating(null);
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
        (
          [
            !name && "gameForm.errorName",
            !year && "gameForm.errorYear",
            !platform && "gameForm.errorPlatform",
            !genre && "gameForm.errorGenre",
          ] as Array<string | false>
        ).filter(Boolean) as string[],
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
    setStatus("Not Started");
    setRating(null);
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
            fullWidth
            size="small"
            error={errors.includes("gameForm.errorName")}
          />
          <TextField
            id={yearId}
            data-testid="app.gameForm.year"
            label={t("gameForm.year")}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            sx={{ width: 140, flexShrink: 0 }}
            size="small"
            error={errors.includes("gameForm.errorYear")}
          />
        </Stack>

        <FormControl
          fullWidth
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
            onChange={(e) => setPlatform(e.target.value as number)}
            size="small"
            required
          >
            {platforms.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          size="small"
          required
          error={errors.includes("gameForm.errorGenre")}
        >
          <InputLabel id={`${genreId}-label`}>{t("gameForm.genre")}</InputLabel>
          <Select
            id={genreId}
            data-testid="app.gameForm.genre"
            labelId={`${genreId}-label`}
            label={t("gameForm.genre")}
            value={genre}
            onChange={(e) => setGenre(e.target.value as Genre)}
            size="small"
            required
          >
            {GENRES.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" required>
          <InputLabel>{t("gameForm.status")}</InputLabel>
          <Select
            value={status}
            label={t("gameForm.status")}
            onChange={(e) => setStatus(e.target.value as Status)}
            data-testid="app.gameForm.status"
          >
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {t(`status.${s.replace(" ", "")}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Typography variant="caption" color="text.secondary">
            {t("gameForm.rating")}
          </Typography>
          <Rating
            value={rating}
            onChange={(_e, val) => setRating(val)}
            size="small"
            data-testid="app.gameForm.rating"
          />
        </Box>

        {/* flex-end + gap keeps buttons close together and right-aligned,
            instead of space-evenly which pushed them to opposite edges */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          data-test="app.gameForm.buttons"
        >
          <Button
            type="reset"
            data-testid="app.gameForm.btn.reset"
            variant="outlined"
            disabled={isProcessing}
            color="inherit"
            onClick={resetForm}
          >
            {t("button.cancel")}
          </Button>
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
        </Stack>
      </Stack>
    </form>
  );
};

export default GameForm;
