import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  IconButton,
  Container,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountTree as WorkflowIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HealthDatagrid from "./utils/HealthDatagrid";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#666666",
    },
  },
});

// Sample workflow data
const initialWorkflows = [
  { id: "WF-001", name: "User Authentication Flow", createdDate: "2024-01-15", status: "Active" },
  { id: "WF-002", name: "Payment Processing", createdDate: "2024-01-18", status: "Draft" },
  { id: "WF-003", name: "Notification Service", createdDate: "2024-01-20", status: "Active" },
  { id: "WF-004", name: "File Upload Handler", createdDate: "2024-01-22", status: "Inactive" },
  { id: "WF-005", name: "Analytics Tracker", createdDate: "2024-01-25", status: "Active" },
];

const PAGE_SIZE_ARRAY = [5, 10, 25, 50];

function Dashboard() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const totalElements = workflows.length;

  const paginatedWorkflows = workflows.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  // Navigate to create NEW workflow (no ID)
  const handleCreateNew = () => {
    navigate("/create-workflow");
  };

  // Navigate to EDIT existing workflow (with ID)
  const handleEdit = (id) => {
    navigate(`/create-workflow?edit=${id}`);
  };

  const handleDelete = (id) => {
    setWorkflows(workflows.filter((workflow) => workflow.id !== id));
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Draft":
        return "warning";
      case "Inactive":
        return "default";
      default:
        return "default";
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Workflow ID",
      minWidth: 120,
      renderCell: ({ value }) => (
        <Typography sx={{ color: "#1976d2", fontWeight: 500 }}>
          {value}
        </Typography>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      renderCell: ({ value }) => (
        <Typography sx={{ color: "#000" }}>{value}</Typography>
      ),
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      minWidth: 150,
      renderCell: ({ value }) => (
        <Typography sx={{ color: "#666" }}>{value}</Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color={getStatusColor(value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      align: "center",
      renderCell: ({ row }) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEdit(row.id)}
            size="small"
            title="Edit Workflow"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(row.id)}
            size="small"
            title="Delete Workflow"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
          <Toolbar>
            <WorkflowIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Workflow Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" color="black" fontWeight="500">
              My Workflows
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
            >
              Create New Workflow
            </Button>
          </Box>

          <HealthDatagrid
            key={`datagrid-${totalElements}`}
            rows={paginatedWorkflows}
            columns={columns}
            totalElements={totalElements}
            page={page}
            pageSizeArray={PAGE_SIZE_ARRAY}
            pageSize={pageSize}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
          />

          {workflows.length === 0 && (
            <Paper
              sx={{
                textAlign: "center",
                py: 8,
                mt: 2,
              }}
            >
              <WorkflowIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" color="black">
                No workflows yet
              </Typography>
              <Typography color="#666" sx={{ mb: 3 }}>
                Create your first workflow to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
              >
                Create New Workflow
              </Button>
            </Paper>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;