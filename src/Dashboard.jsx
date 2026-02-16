import { useState, useMemo } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountTree as WorkflowIcon,
  Warning as WarningIcon,
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

// Helper function to format timestamp
const formatTimestamp = (date) => {
  return new Date(date).toISOString();
};

// Helper function to display timestamp in readable format
const displayTimestamp = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid Date";
  }
};

// Sample user UIDs (in real app, these would come from authentication)
const sampleUsers = {
  "user-001": "John Doe",
  "user-002": "Jane Smith",
  "user-003": "Mike Johnson",
};

// Current logged in user (mock)
const currentUserUid = "user-001";

// Initial workflows with simple WF-XXX IDs
const createInitialWorkflows = () => [
  {
    id: "WF-001",
    name: "User Authentication Flow",
    status: "Active",
    lifecycle: "Development",
    createdBy: "user-001",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedBy: "user-002",
    updatedAt: "2024-01-20T14:45:00.000Z",
  },
  {
    id: "WF-002",
    name: "Payment Processing",
    status: "Draft",
    lifecycle: "Planning",
    createdBy: "user-002",
    createdAt: "2024-01-18T09:15:00.000Z",
    updatedBy: "user-002",
    updatedAt: "2024-01-18T09:15:00.000Z",
  },
  {
    id: "WF-003",
    name: "Notification Service",
    status: "Active",
    lifecycle: "Production",
    createdBy: "user-001",
    createdAt: "2024-01-20T11:00:00.000Z",
    updatedBy: "user-003",
    updatedAt: "2024-01-25T16:30:00.000Z",
  },
  {
    id: "WF-004",
    name: "File Upload Handler",
    status: "Inactive",
    lifecycle: "Testing",
    createdBy: "user-003",
    createdAt: "2024-01-22T08:45:00.000Z",
    updatedBy: "user-001",
    updatedAt: "2024-01-28T10:00:00.000Z",
  },
  {
    id: "WF-005",
    name: "Analytics Tracker",
    status: "Active",
    lifecycle: "Testing",
    createdBy: "user-002",
    createdAt: "2024-01-25T13:20:00.000Z",
    updatedBy: "user-002",
    updatedAt: "2024-01-26T09:00:00.000Z",
  },
];

const PAGE_SIZE_ARRAY = [5, 10, 25, 50];

// Workflow lifecycle stages
const LIFECYCLE_STAGES = {
  Planning: { color: "info", order: 1 },
  Development: { color: "primary", order: 2 },
  Testing: { color: "warning", order: 3 },
  Production: { color: "success", order: 4 },
};

function Dashboard() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState(createInitialWorkflows);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState(null);

  const totalElements = workflows.length;

  const paginatedWorkflows = useMemo(() => {
    return workflows.slice(page * pageSize, page * pageSize + pageSize);
  }, [workflows, page, pageSize]);

  const handleCreateNew = () => {
    navigate("/create-workflow");
  };

  const handleEdit = (id) => {
    setWorkflows((prevWorkflows) =>
      prevWorkflows.map((workflow) => {
        if (workflow.id === id) {
          return {
            ...workflow,
            updatedAt: formatTimestamp(new Date()),
            updatedBy: currentUserUid,
          };
        }
        return workflow;
      })
    );
    navigate(`/create-workflow?edit=${id}`);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (workflow) => {
    setWorkflowToDelete(workflow);
    setDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setWorkflowToDelete(null);
  };

  // Confirm and execute delete
  const handleDeleteConfirm = () => {
    if (workflowToDelete) {
      setWorkflows((prevWorkflows) =>
        prevWorkflows.filter((workflow) => workflow.id !== workflowToDelete.id)
      );
    }
    setDeleteModalOpen(false);
    setWorkflowToDelete(null);
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

  const getLifecycleColor = (lifecycle) => {
    return LIFECYCLE_STAGES[lifecycle]?.color || "default";
  };

  // Helper to get user display name from UID
  const getUserDisplayName = (uid) => {
    if (!uid) return "Unknown";
    return sampleUsers[uid] || uid;
  };

  const columns = [
    {
      field: "id",
      headerName: "Workflow ID",
      minWidth: 120,
      renderCell: (params) => {
        const value = params?.value || params?.row?.id;
        return (
          <Typography
            sx={{
              color: "#1976d2",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            {value || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const value = params?.value || params?.row?.name;
        return <Typography sx={{ color: "#000" }}>{value || "N/A"}</Typography>;
      },
    },
    {
      field: "lifecycle",
      headerName: "Lifecycle",
      minWidth: 130,
      renderCell: (params) => {
        const value = params?.value || params?.row?.lifecycle;
        if (!value) return <Typography>N/A</Typography>;
        return (
          <Chip
            label={value}
            color={getLifecycleColor(value)}
            size="small"
            variant="filled"
          />
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 110,
      renderCell: (params) => {
        const value = params?.value || params?.row?.status;
        if (!value) return <Typography>N/A</Typography>;
        return (
          <Chip
            label={value}
            color={getStatusColor(value)}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "createdBy",
      headerName: "Created By",
      minWidth: 140,
      renderCell: (params) => {
        const value = params?.value || params?.row?.createdBy;
        return (
          <Box>
            <Typography sx={{ color: "#000", fontSize: "0.875rem" }}>
              {getUserDisplayName(value)}
            </Typography>
            <Typography
              sx={{
                color: "#999",
                fontSize: "0.7rem",
              }}
            >
              {value || "N/A"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 180,
      renderCell: (params) => {
        const value = params?.value || params?.row?.createdAt;
        return (
          <Typography sx={{ color: "#666", fontSize: "0.8rem" }}>
            {displayTimestamp(value)}
          </Typography>
        );
      },
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      minWidth: 140,
      renderCell: (params) => {
        const value = params?.value || params?.row?.updatedBy;
        return (
          <Box>
            <Typography sx={{ color: "#000", fontSize: "0.875rem" }}>
              {getUserDisplayName(value)}
            </Typography>
            <Typography
              sx={{
                color: "#999",
                fontSize: "0.7rem",
              }}
            >
              {value || "N/A"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      minWidth: 180,
      renderCell: (params) => {
        const value = params?.value || params?.row?.updatedAt;
        return (
          <Typography sx={{ color: "#666", fontSize: "0.8rem" }}>
            {displayTimestamp(value)}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        const row = params?.row;
        if (!row) return null;
        return (
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
              onClick={() => handleDeleteClick(row)}
              size="small"
              title="Delete Workflow"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
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
              Workflow Lifecycle Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h5" color="black" fontWeight="500">
                My Workflows
              </Typography>
              <Typography variant="body2" color="#666" sx={{ mt: 0.5 }}>
                Manage workflow lifecycles: Planning → Development → Testing →
                Production
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
            >
              Create New Workflow
            </Button>
          </Box>

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <HealthDatagrid
              key={`datagrid-${totalElements}-${page}-${pageSize}`}
              rows={paginatedWorkflows}
              columns={columns}
              totalElements={totalElements}
              page={page}
              pageSizeArray={PAGE_SIZE_ARRAY}
              pageSize={pageSize}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
              getRowId={(row) => row.id}
            />
          </Paper>

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

        {/* Delete Confirmation Modal */}
        <Dialog
          open={deleteModalOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 400,
            },
          }}
        >
          <DialogTitle
            id="delete-dialog-title"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#d32f2f",
            }}
          >
            <WarningIcon color="error" />
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description" sx={{ color: "#333" }}>
              Are you sure you want to delete this workflow?
            </DialogContentText>
            {workflowToDelete && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Workflow ID:</strong> {workflowToDelete.id}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Name:</strong> {workflowToDelete.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Status:</strong> {workflowToDelete.status}
                </Typography>
                <Typography variant="body2">
                  <strong>Lifecycle:</strong> {workflowToDelete.lifecycle || "N/A"}
                </Typography>
              </Box>
            )}
            <Typography
              variant="body2"
              sx={{ mt: 2, color: "#d32f2f", fontStyle: "italic" }}
            >
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleDeleteCancel}
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;