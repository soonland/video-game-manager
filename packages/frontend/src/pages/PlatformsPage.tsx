import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Snackbar,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Game, Platform } from "@vgm/types";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import ConfirmationDialog from "../components/ConfirmationDialog";
import DataTable, { DataTableColumn } from "../components/DataTable";

type SortField = "name" | "year";
type SortOrder = "asc" | "desc";

function stableSort(
  platforms: Platform[],
  orderBy: SortField,
  order: SortOrder,
): Platform[] {
  return [...platforms].sort((a, b) => {
    const aVal = orderBy === "name" ? a.name.toLowerCase() : a.year;
    const bVal = orderBy === "name" ? b.name.toLowerCase() : b.year;
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

const PlatformsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [order, setOrder] = useState<SortOrder>("asc");
  const [orderBy, setOrderBy] = useState<SortField>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const loadPlatforms = () => {
    fetch("/api/platforms")
      .then((r) => r.json())
      .then((data: { platforms: Platform[] }) => setPlatforms(data.platforms))
      .catch((err: Error) => console.error(err));
  };

  const loadGames = () => {
    fetch("/api/games?$expand=platform")
      .then((r) => r.json())
      .then((data: { games: Game[] }) => setGames(data.games))
      .catch((err: Error) => console.error(err));
  };

  useEffect(() => {
    loadPlatforms();
    loadGames();
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

  const isPlatformInUse = (platformId: number) =>
    games.some((g) => g.platform.id === platformId);

  const gameCountForPlatform = (platformId: number) =>
    games.filter((g) => g.platform.id === platformId).length;

  const handleDeleteClick = (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId === null) return;
    await fetch(`/api/platforms/${pendingDeleteId}`, { method: "DELETE" });
    setPendingDeleteId(null);
    setConfirmOpen(false);
    setSnackbarMessage(t("app.modal.platforms.deleted"));
    setSnackbarOpen(true);
    loadPlatforms();
  };

  const handleSortRequest = (field: SortField) => {
    if (orderBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setOrder("asc");
    }
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

  const filtered = platforms.filter(
    (p) =>
      !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const sorted = stableSort(filtered, orderBy, order);
  const paginated = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const columns: DataTableColumn<Platform>[] = [
    {
      key: "name",
      header: sortLabel("name", t("app.modal.platforms.name")),
      render: (p) => p.name,
    },
    {
      key: "year",
      width: 150,
      header: sortLabel("year", t("app.modal.platforms.year")),
      align: "center",
      render: (p) => p.year,
    },
    {
      key: "games",
      width: 100,
      header: t("app.nav.games"),
      align: "center",
      render: (p) => (
        <Chip
          label={gameCountForPlatform(p.id)}
          size="small"
          color={isPlatformInUse(p.id) ? "primary" : "default"}
        />
      ),
    },
    {
      key: "actions",
      align: "right",
      header: t("gameList.actions"),
      render: (p) => (
        <>
          <Tooltip title={t("gameList.edit")}>
            <IconButton
              size="small"
              onClick={() => navigate(`/platforms/${p.id}/edit`)}
              data-testid={`edit-platform-${p.id}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("gameList.delete")}>
            <span>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteClick(p.id)}
                disabled={isPlatformInUse(p.id)}
                data-testid={`delete-platform-${p.id}`}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
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
        <Typography variant="h5">{t("app.nav.platforms")}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/platforms/new")}
          data-testid="add-platform-button"
        >
          {t("app.modal.platforms.add")}
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
        <TextField
          size="small"
          placeholder={t("app.filter.searchPlatform")}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 200 }}
        />
      </Box>

      {/* Data table */}
      <DataTable
        columns={columns}
        rows={paginated}
        rowKey={(p) => p.id}
        emptyMessage={t("app.modal.platforms.noPlatforms")}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filtered.length}
        onPageChange={setPage}
        onRowsPerPageChange={(n) => {
          setRowsPerPage(n);
          setPage(0);
        }}
        rowTestId={(p) => `platform-${p.id}`}
      />

      <ConfirmationDialog
        open={confirmOpen}
        onClose={(_e, _reason) => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
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

export default PlatformsPage;
