import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  padding?: "normal" | "checkbox" | "none";
  width?: number | string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  /** Already-paginated rows to display on the current page. */
  rows: T[];
  rowKey: (row: T) => string | number;
  emptyMessage: string;
  page: number;
  rowsPerPage: number;
  /** Total count of filtered rows, used by the pagination controls. */
  totalCount: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  rowSelected?: (row: T) => boolean;
  rowTestId?: (row: T) => string;
}

function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  rowSelected,
  rowTestId,
}: DataTableProps<T>) {
  const { t } = useTranslation();

  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align}
                  padding={col.padding}
                  sx={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 3 }}
                  >
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={rowKey(row)}
                  hover
                  selected={rowSelected?.(row)}
                  data-testid={rowTestId?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.align}
                      padding={col.padding}
                    >
                      {col.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_e, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => {
          onRowsPerPageChange(parseInt(e.target.value, 10));
        }}
        labelRowsPerPage={t("gameList.rowsPerPage")}
      />
    </Paper>
  );
}

export default DataTable;
