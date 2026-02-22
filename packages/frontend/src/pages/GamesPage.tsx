import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Rating,
  Select,
  Snackbar,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Game, Genre, GENRES, Platform, STATUSES, Status } from "@vgm/types";
import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import ConfirmationDialog from "../components/ConfirmationDialog";
import DataTable, { DataTableColumn } from "../components/DataTable";

type SortField = "name" | "year" | "platform";
type SortOrder = "asc" | "desc";

const GENRE_COLORS: Record<
  Genre,
  "error" | "warning" | "success" | "info" | "secondary" | "primary"
> = {
  Action: "error",
  Aventure: "warning",
  RPG: "success",
  Simulation: "info",
  Stratégie: "secondary",
  Sport: "primary",
};

const STATUS_COLORS: Record<
  Status,
  "default" | "primary" | "success" | "error"
> = {
  "Not Started": "default",
  Playing: "primary",
  Completed: "success",
  Dropped: "error",
};

function stableSort(
  games: Game[],
  orderBy: SortField,
  order: SortOrder,
): Game[] {
  return [...games].sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;
    if (orderBy === "platform") {
      aVal = a.platform.name.toLowerCase();
      bVal = b.platform.name.toLowerCase();
    } else if (orderBy === "name") {
      aVal = a.name.toLowerCase();
      bVal = b.name.toLowerCase();
    } else {
      aVal = a.year;
      bVal = b.year;
    }
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

const GamesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [games, setGames] = useState<Game[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [order, setOrder] = useState<SortOrder>("asc");
  const [orderBy, setOrderBy] = useState<SortField>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const loadGames = () => {
    fetch("/api/games?$expand=platform")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch games");
        return r.json();
      })
      .then((data: { games: Game[] }) => setGames(data.games))
      .catch((err: Error) => console.error(err));
  };

  const loadPlatforms = () => {
    fetch("/api/platforms")
      .then((r) => r.json())
      .then((data: { platforms: Platform[] }) => setPlatforms(data.platforms))
      .catch((err: Error) => console.error(err));
  };

  useEffect(() => {
    loadGames();
    loadPlatforms();
  }, []);

  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setSnackbarMessage(state.message);
      setSnackbarOpen(true);
      /* eslint-enable react-hooks/set-state-in-effect */
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  const handleSortRequest = (field: SortField) => {
    if (orderBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setOrder("asc");
    }
  };

  const filtered = games
    .filter(
      (g) =>
        !searchTerm || g.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(
      (g) =>
        !selectedPlatforms.length || selectedPlatforms.includes(g.platform.id),
    )
    .filter((g) => !selectedGenres.length || selectedGenres.includes(g.genre))
    .filter(
      (g) => !selectedStatuses.length || selectedStatuses.includes(g.status),
    );

  const sorted = stableSort(filtered, orderBy, order);
  const paginated = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const allSelected =
    filtered.length > 0 && filtered.every((g) => selected.includes(g.id));
  const someSelected = selected.length > 0 && !allSelected;

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? filtered.map((g) => g.id) : []);
  };

  const handleSelectRow = (e: MouseEvent, id: number) => {
    e.stopPropagation();
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleDeleteSingle = (e: MouseEvent, id: number) => {
    e.stopPropagation();
    setPendingDeleteIds([id]);
    setConfirmOpen(true);
  };

  const handleDeleteBulk = () => {
    setPendingDeleteIds(selected);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    for (const id of pendingDeleteIds) {
      await fetch(`/api/games/${id}`, { method: "DELETE" });
    }
    setSelected((prev) => prev.filter((id) => !pendingDeleteIds.includes(id)));
    setPendingDeleteIds([]);
    setConfirmOpen(false);
    setSnackbarMessage(t("gameForm.deleted"));
    setSnackbarOpen(true);
    loadGames();
  };

  const sortLabel = (field: SortField, label: string): ReactNode => (
    <TableSortLabel
      active={orderBy === field}
      direction={orderBy === field ? order : "asc"}
      onClick={() => handleSortRequest(field)}
    >
      {label}
    </TableSortLabel>
  );

  const columns: DataTableColumn<Game>[] = [
    {
      key: "checkbox",
      padding: "checkbox",
      header: (
        <Checkbox
          indeterminate={someSelected}
          checked={allSelected}
          onChange={handleSelectAll}
        />
      ),
      render: (game) => (
        <Checkbox
          checked={selected.includes(game.id)}
          onClick={(e) => handleSelectRow(e as MouseEvent, game.id)}
        />
      ),
    },
    {
      key: "name",
      header: sortLabel("name", t("gameList.name")),
      render: (game) => game.name,
    },
    {
      key: "year",
      width: 150,
      header: sortLabel("year", t("gameList.year")),
      align: "center",
      render: (game) => game.year,
    },
    {
      key: "platform",
      header: sortLabel("platform", t("gameList.platform")),
      render: (game) => game.platform.name,
    },
    {
      key: "genre",
      header: t("gameList.genre"),
      render: (game) => (
        <Chip
          label={game.genre}
          size="small"
          color={GENRE_COLORS[game.genre] ?? "default"}
        />
      ),
    },
    {
      key: "status",
      header: t("gameList.status"),
      align: "center",
      render: (game) => (
        <Chip
          label={t(`status.${game.status.replace(" ", "")}`)}
          size="small"
          color={STATUS_COLORS[game.status]}
        />
      ),
    },
    {
      key: "rating",
      width: 120,
      header: t("gameList.rating"),
      render: (game) =>
        game.rating ? (
          <Rating value={game.rating} readOnly size="small" />
        ) : (
          <Typography variant="caption" color="text.disabled">
            —
          </Typography>
        ),
    },
    {
      key: "actions",
      align: "right",
      header: t("gameList.actions"),
      render: (game) => (
        <>
          <Tooltip title={t("gameList.edit")}>
            <IconButton
              size="small"
              onClick={() => navigate(`/games/${game.id}/edit`)}
              data-testid={`app.editGame.${game.id}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("gameList.delete")}>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => handleDeleteSingle(e, game.id)}
              data-testid={`app.deleteGame.${game.id}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box>
      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5">{t("app.nav.games")}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/games/new")}
          data-testid="app.addGameButton"
        >
          {t("button.add")}
        </Button>
      </Box>

      {/* Filter bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          bgcolor: "#ffffff",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          p: 1,
          mb: 1.5,
        }}
      >
        {selected.length > 0 ? (
          <>
            <Typography sx={{ flex: 1 }} color="inherit" variant="subtitle1">
              {selected.length} {t("gameList.name").toLowerCase()}
            </Typography>
            <Tooltip title={t("button.delete", { count: selected.length })}>
              <IconButton color="error" onClick={handleDeleteBulk} size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <TextField
              size="small"
              placeholder={t("app.filter.search")}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>{t("app.filter.platform")}</InputLabel>
              <Select<number[]>
                multiple
                value={selectedPlatforms}
                onChange={(e) => {
                  setSelectedPlatforms(e.target.value as number[]);
                  setPage(0);
                }}
                input={<OutlinedInput label={t("app.filter.platform")} />}
                renderValue={(sel) =>
                  sel
                    .map((id) => platforms.find((p) => p.id === id)?.name)
                    .filter(Boolean)
                    .join(", ")
                }
              >
                {platforms.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t("gameList.genre")}</InputLabel>
              <Select<Genre[]>
                multiple
                value={selectedGenres}
                onChange={(e) => {
                  setSelectedGenres(e.target.value as Genre[]);
                  setPage(0);
                }}
                input={<OutlinedInput label={t("gameList.genre")} />}
                renderValue={(sel) => sel.join(", ")}
              >
                {GENRES.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>{t("app.filter.status")}</InputLabel>
              <Select<Status[]>
                multiple
                value={selectedStatuses}
                onChange={(e) => {
                  setSelectedStatuses(e.target.value as Status[]);
                  setPage(0);
                }}
                input={<OutlinedInput label={t("app.filter.status")} />}
                renderValue={(sel) =>
                  sel.map((s) => t(`status.${s.replace(" ", "")}`)).join(", ")
                }
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {t(`status.${s.replace(" ", "")}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </Box>

      {/* Data table */}
      <DataTable
        columns={columns}
        rows={paginated}
        rowKey={(game) => game.id}
        emptyMessage={t("gameList.noGames")}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filtered.length}
        onPageChange={setPage}
        onRowsPerPageChange={(n) => {
          setRowsPerPage(n);
          setPage(0);
        }}
        rowSelected={(game) => selected.includes(game.id)}
        rowTestId={(game) => `app.gameRow.${game.id}`}
      />

      <ConfirmationDialog
        open={confirmOpen}
        onClose={(_e, _reason) => {
          setConfirmOpen(false);
          setPendingDeleteIds([]);
        }}
        onConfirm={handleConfirmDelete}
      />

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
    </Box>
  );
};

export default GamesPage;
