import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    onConfirm();
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onClose={onClose} disableEscapeKeyDown>
      <DialogTitle>{t("app.confirmDeletionTitle")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("app.confirmDeletionMessage")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
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

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmationDialog;
