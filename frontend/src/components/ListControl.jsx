import { Delete, Download } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import PropTypes from "prop-types";

const ListControl = ({ count, onDelete }) => {
  return (
    <Stack
      direction={"row"}
      paddingBottom={1}
      justifyContent={"space-between"}
      data-test="app.listControl.buttons"
    >
      <Button
        variant="contained"
        color="primary"
        endIcon={<Download />}
        data-testid="app.listControl.btn.export"
      >
        Exporter
      </Button>
      <Button
        variant="contained"
        color="secondary"
        disabled={count === 0}
        endIcon={<Delete />}
        onClick={onDelete}
        data-testid="app.listControl.btn.delete"
      >
        {count === 0 ? "Supprimer" : `Supprimer (${count})`}
      </Button>
    </Stack>
  );
};

// PropTypes pour GameForm
ListControl.propTypes = {
  count: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ListControl;
