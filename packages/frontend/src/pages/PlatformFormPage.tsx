import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Platform } from "@vgm/types";
import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const PlatformFormPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined;

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1975 + 2 },
    (_, i) => currentYear + 1 - i,
  );

  const [name, setName] = useState("");
  const [year, setYear] = useState<number>(currentYear);

  useEffect(() => {
    if (isEditing) {
      fetch(`/api/platforms/${id}`)
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch platform");
          return r.json();
        })
        .then((data: { platform: Platform }) => {
          setName(data.platform.name);
          setYear(data.platform.year);
        })
        .catch((err: Error) => console.error(err));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const body = JSON.stringify({ name, year });

    if (isEditing) {
      const response = await fetch(`/api/platforms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!response.ok) throw new Error("Failed to update platform");
      navigate("/platforms", {
        state: { message: t("app.modal.platforms.updated") },
      });
    } else {
      const response = await fetch("/api/platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!response.ok) throw new Error("Failed to add platform");
      navigate("/platforms", {
        state: { message: t("app.modal.platforms.added") },
      });
    }
  };

  return (
    <Card
      elevation={0}
      variant="outlined"
      sx={{ borderRadius: 2, maxWidth: 480 }}
    >
      <CardHeader
        title={
          isEditing
            ? t("app.modal.platforms.edit")
            : t("app.modal.platforms.add")
        }
        titleTypographyProps={{ variant: "h5" }}
        sx={{ borderBottom: "1px solid", borderColor: "divider", pb: 2 }}
      />
      <CardContent sx={{ pt: 3 }}>
        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label={t("app.modal.platforms.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              size="small"
              data-testid="platform-name-form"
            />
            <FormControl fullWidth size="small">
              <InputLabel>{t("app.modal.platforms.year")}</InputLabel>
              <Select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                label={t("app.modal.platforms.year")}
                data-testid="platform-year-form"
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/platforms")}
              >
                {t("button.cancel")}
              </Button>
              {isEditing ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  data-testid="save-platform"
                >
                  {t("button.save")}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  data-testid="add-platform"
                >
                  {t("app.modal.platforms.add")}
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlatformFormPage;
