import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
} from "@mui/material";

const HealthDatagrid = ({
  rows,
  columns,
  totalElements,
  page,
  pageSizeArray,
  pageSize,
  handlePageChange,
  handlePageSizeChange,
}) => {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || "left"}
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    fontWeight: "bold",
                    minWidth: column.minWidth || 100,
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                    "&:hover": {
                      backgroundColor: "#e3f2fd !important",
                    },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.field} align={column.align || "left"}>
                      {column.renderCell
                        ? column.renderCell({ row, value: row[column.field] })
                        : row[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={pageSizeArray}
        component="div"
        count={totalElements}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
        sx={{
          borderTop: "1px solid #e0e0e0",
        }}
      />
    </Paper>
  );
};

export default HealthDatagrid;