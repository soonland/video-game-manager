import { Add, Edit, Delete, Check, Cancel } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const SettingsPanel = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const currentYear = new Date().getFullYear();
  const [newPlatformName, setNewPlatformName] = useState("");
  const [newYear, setNewYear] = useState(currentYear);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingPlatformName, setEditingPlatformName] = useState("");
  const [editingYear, setEditingYear] = useState(currentYear);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Générer la liste des années, de manière décroissante.
  const years = Array.from(
    { length: currentYear - 1975 + 2 },
    (_, i) => currentYear + 1 - i,
  );

  const simulateDatabaseDelay = (callback) => {
    setIsProcessing(true);
    setTimeout(() => {
      callback();
      setIsProcessing(false);
    }, 2000);
  };

  const handleAddPlatform = () => {
    if (newPlatformName.trim() && newYear) {
      simulateDatabaseDelay(() => {
        fetch("/api/platforms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newPlatformName, year: newYear }),
        });
        const newPlatform = {
          name: newPlatformName,
          year: newYear,
        };
        setPlatforms([...platforms, newPlatform]);
        setNewPlatformName("");
        setNewYear(currentYear);
        setSnackbarMessage(t("app.modal.platforms.added"));
        setSnackbarOpen(true);
      });
    }
  };

  const handleEditPlatform = (index) => {
    setEditingIndex(index);
    setEditingPlatformName(platforms[index].name);
    setEditingYear(platforms[index].year);
  };

  const handleUpdatePlatform = () => {
    simulateDatabaseDelay(() => {
      const updatedPlatforms = platforms.map((platform, index) =>
        index === editingIndex
          ? { name: editingPlatformName, year: editingYear }
          : platform,
      );
      setPlatforms(updatedPlatforms);
      setEditingIndex(null);
      setEditingPlatformName("");
      setEditingYear(currentYear);
      setSnackbarMessage(t("app.modal.platforms.updated"));
      setSnackbarOpen(true);
    });
  };

  const handleDeletePlatform = (index) => {
    simulateDatabaseDelay(() => {
      fetch(`/api/platforms/${platforms[index].id}`, {
        method: "DELETE",
      });
      const updatedPlatforms = platforms.filter((_, i) => i !== index);
      setPlatforms(updatedPlatforms);
      setSnackbarMessage(t("app.modal.platforms.deleted"));
      setSnackbarOpen(true);
    });
  };

  const clearFields = () => {
    setNewPlatformName("");
    setNewYear(currentYear);
  };

  const loadPlatforms = async () => {
    fetch("/api/platforms")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch platforms");
        }
        return response.json();
      })
      .then((data) => {
        setPlatforms(data.platforms);
      })
      .catch((error) => {
        console.error("Error fetching platforms:", error);
      });
  };

  const handleClose = () => {
    if (newPlatformName.trim() && newYear) {
      // show modal for leaving without saving
      return;
    }
    setEditingIndex(null);
    setEditingPlatformName("");
    setEditingYear(currentYear);
    onClose();
  };

  useEffect(() => {
    loadPlatforms();
  }, []);

  return (
    <>
      <Dialog open={open} onClose={onClose} disableEscapeKeyDown>
        <DialogTitle>{t("app.modal.platforms.title")}</DialogTitle>
        <DialogContent>
          <List>
            {platforms.map((platform, index) => (
              <ListItem
                key={platform.id}
                sx={{ display: "flex", alignItems: "center", padding: 0 }}
              >
                {editingIndex === index ? (
                  <>
                    <TextField
                      value={editingPlatformName}
                      onChange={(e) => setEditingPlatformName(e.target.value)}
                      label={t("app.modal.platforms.name")}
                      fullWidth
                      size="small"
                      sx={{ marginRight: "8px" }}
                    />
                    <FormControl
                      fullWidth
                      sx={{ marginBottom: "8px" }}
                      size="small"
                    >
                      <InputLabel>{t("app.modal.platforms.year")}</InputLabel>
                      <Select
                        value={editingYear}
                        onChange={(e) => setEditingYear(Number(e.target.value))}
                        label={t("app.modal.platforms.year")}
                      >
                        {years.map((year) => (
                          <MenuItem key={`year-${year}`} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                ) : (
                  <ListItemText
                    primary={`${platform.name} (${platform.year})`}
                  />
                )}
                <Stack direction={"row"}>
                  {editingIndex === index ? (
                    <>
                      <IconButton
                        onClick={handleUpdatePlatform}
                        aria-label="Save"
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        onClick={() => setEditingIndex(null)}
                        aria-label="Cancel"
                      >
                        <Cancel />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        onClick={() => handleEditPlatform(index)}
                        aria-label="Edit"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeletePlatform(index)}
                        aria-label="Delete"
                      >
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </Stack>
              </ListItem>
            ))}
          </List>

          {editingIndex === null && (
            <Stack
              direction={"row"}
              justifyContent={"flex-end"}
              width="100%"
              spacing={2}
            >
              <TextField
                label={t("app.modal.platforms.name")}
                value={newPlatformName}
                onChange={(e) => setNewPlatformName(e.target.value)}
                fullWidth
                size="small"
                sx={{ marginBottom: "8px" }}
              />
              <FormControl fullWidth sx={{ marginBottom: "8px" }} size="small">
                <InputLabel>{t("app.modal.platforms.year")}</InputLabel>
                <Select
                  value={newYear}
                  onChange={(e) => setNewYear(Number(e.target.value))}
                  label={t("app.modal.platforms.year")}
                >
                  {years.map((year) => (
                    <MenuItem key={`new-year-${year}`} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton onClick={handleAddPlatform} aria-label="Add platform">
                <Add />
              </IconButton>
              <IconButton onClick={clearFields} aria-label="Add platform">
                <Cancel />
              </IconButton>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            color="secondary"
            disabled={
              isProcessing ||
              Boolean(editingIndex) ||
              Boolean(newPlatformName.trim())
            }
            startIcon={isProcessing && <CircularProgress size={20} />}
          >
            {t("app.modal.common.close")}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
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
    </>
  );
};

SettingsPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SettingsPanel;
