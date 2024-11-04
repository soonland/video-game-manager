import { CheckBox, Delete, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ListControl = ({ count, onDelete, onCheckAll }) => {
  const [checkedAll, setCheckedAll] = useState(false);
  const handleCheckAll = () => {
    setCheckedAll(!checkedAll);
    onCheckAll(checkedAll);
  };
  const { t } = useTranslation();
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
        startIcon={checkedAll ? <CheckBox /> : <CheckBoxOutlineBlank />}
        onClick={handleCheckAll}
        data-testid="app.listControl.btn.checkAll"
      >
        {checkedAll ? t("button.uncheckAll") : t("button.checkAll")}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        disabled={count === 0}
        endIcon={<Delete />}
        onClick={onDelete}
        data-testid="app.listControl.btn.delete"
      >
        {t("button.delete", { count })}
      </Button>
    </Stack>
  );
};

// PropTypes pour GameForm
ListControl.propTypes = {
  count: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCheckAll: PropTypes.func.isRequired,
};

export default ListControl;
