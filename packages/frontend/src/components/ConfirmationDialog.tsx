import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: (event: object, reason: "backdropClick" | "escapeKeyDown") => void;
  onConfirm: () => void;
}

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
}: ConfirmationDialogProps) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    onConfirm();
    setIsProcessing(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {t("app.confirmDeletionTitle")}
          <IconButton onClick={() => onClose({}, "escapeKeyDown")}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>{t("app.confirmDeletionMessage")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose({}, "escapeKeyDown")}
          data-testid="app.confirmationDialog.btnCancel"
          variant="contained"
          color="secondary"
          disabled={isProcessing}
        >
          Annuler
        </Button>
        <Button
          onClick={handleConfirm}
          data-testid="app.confirmationDialog.btnConfirm"
          variant="contained"
          color="primary"
          disabled={isProcessing}
          endIcon={
            isProcessing ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
