import React, { memo, useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import useWorkflowStore from "../store/workflowStore";

// MUI Imports
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Chip,
  Alert,
  Paper,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HttpIcon from "@mui/icons-material/Http";
import ApiIcon from "@mui/icons-material/Api";
import SendIcon from "@mui/icons-material/Send";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  outline: "none",
  overflow: "hidden",
};

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

// Dummy data templates
const DUMMY_DATA = {
  headers: {
    GET: {
      "Content-Type": "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      Accept: "application/json",
      "X-API-Key": "your-api-key-here",
    },
    POST: {
      "Content-Type": "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      Accept: "application/json",
      "X-Request-ID": "req-12345",
    },
    PUT: {
      "Content-Type": "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "If-Match": "etag-value",
    },
    DELETE: {
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "X-Confirm-Delete": "true",
    },
  },
  queryParams: {
    GET: {
      page: 1,
      limit: 10,
      sort: "createdAt",
      order: "desc",
      search: "keyword",
      "filter[status]": "active",
    },
    POST: {
      notify: true,
      async: false,
    },
    PUT: {
      validate: true,
    },
    DELETE: {
      soft: true,
      cascade: false,
    },
  },
  body: {
    GET: null,
    POST: {
      user: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        age: 30,
        roles: ["admin", "user"],
        address: {
          street: "123 Main St",
          city: "New York",
          zipCode: "10001",
        },
      },
      metadata: {
        source: "web",
        campaign: "summer2024",
      },
    },
    PUT: {
      id: "user-123",
      updates: {
        firstName: "Jane",
        email: "jane.doe@example.com",
        status: "verified",
      },
      updatedAt: "2024-01-15T10:30:00Z",
    },
    PATCH: {
      operations: [
        { op: "replace", path: "/email", value: "new@example.com" },
        { op: "add", path: "/tags/-", value: "premium" },
      ],
    },
    DELETE: {
      reason: "User requested account deletion",
      backupRequired: true,
    },
  },
};

// Camunda-style colors
const CAMUNDA_COLORS = {
  primary: "#0d4880", // Dark blue
  secondary: "#52b0d8", // Light blue
  background: "#ffffff",
  border: "#0d4880",
  borderHover: "#52b0d8",
  selectedBorder: "#ff6b00", // Orange for selection
  taskIcon: "#0d4880",
  text: "#333333",
  textSecondary: "#666666",
  success: "#52b0d8",
  handleColor: "#0d4880",
  handleHover: "#52b0d8",
};

// Method icons mapping
const getMethodIcon = (method) => {
  switch (method) {
    case "GET":
      return <CloudDownloadIcon sx={{ fontSize: 16 }} />;
    case "POST":
      return <CloudUploadIcon sx={{ fontSize: 16 }} />;
    case "PUT":
      return <EditIcon sx={{ fontSize: 16 }} />;
    case "PATCH":
      return <EditIcon sx={{ fontSize: 16 }} />;
    case "DELETE":
      return <DeleteOutlineIcon sx={{ fontSize: 16 }} />;
    default:
      return <HttpIcon sx={{ fontSize: 16 }} />;
  }
};

const ApiNode = ({ id, data, selected }) => {
  // Store actions
  const setSelectedNodeId = useWorkflowStore(
    (state) => state.setSelectedNodeId
  );
  const editingNodeId = useWorkflowStore((state) => state.editingNodeId);
  const setEditingNodeId = useWorkflowStore((state) => state.setEditingNodeId);
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  // Local state
  const [tabValue, setTabValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [jsonErrors, setJsonErrors] = useState({
    headers: null,
    queryParams: null,
    body: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    method: "GET",
    url: "",
    headers: "{}",
    queryParams: "{}",
    body: "null",
  });

  // Check if this node's modal should be open
  const isOpen = editingNodeId === id;

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: data.name || "",
        method: data.method || "GET",
        url: data.url || "",
        headers: JSON.stringify(data.headers || {}, null, 2),
        queryParams: JSON.stringify(data.queryParams || {}, null, 2),
        body: JSON.stringify(data.body ?? null, null, 2),
      });
      setTabValue(0);
      setJsonErrors({ headers: null, queryParams: null, body: null });
    }
  }, [isOpen, data]);

  // Validate JSON in real-time
  const validateJson = (field, value) => {
    try {
      JSON.parse(value);
      setJsonErrors((prev) => ({ ...prev, [field]: null }));
      return true;
    } catch (err) {
      setJsonErrors((prev) => ({ ...prev, [field]: err.message }));
      return false;
    }
  };

  const handleClick = () => {
    setSelectedNodeId(id);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setEditingNodeId(id);
  };

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setEditingNodeId(id);
  };

  const handleClose = () => {
    setEditingNodeId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate JSON fields in real-time
    if (["headers", "queryParams", "body"].includes(name)) {
      validateJson(name, value);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Load dummy data for current method
  const loadDummyData = (field) => {
    const method = formData.method;
    let dummyValue;

    switch (field) {
      case "headers":
        dummyValue = DUMMY_DATA.headers[method] || DUMMY_DATA.headers.GET;
        break;
      case "queryParams":
        dummyValue =
          DUMMY_DATA.queryParams[method] || DUMMY_DATA.queryParams.GET;
        break;
      case "body":
        dummyValue = DUMMY_DATA.body[method] ?? DUMMY_DATA.body.POST;
        break;
      default:
        return;
    }

    const jsonString = JSON.stringify(dummyValue, null, 2);
    setFormData((prev) => ({
      ...prev,
      [field]: jsonString,
    }));
    validateJson(field, jsonString);
  };

  const handleSave = () => {
    try {
      const parsedHeaders = JSON.parse(formData.headers || "{}");
      const parsedQueryParams = JSON.parse(formData.queryParams || "{}");
      const parsedBody = JSON.parse(formData.body || "null");

      updateNode(id, {
        name: formData.name,
        method: formData.method,
        url: formData.url,
        headers: parsedHeaders,
        queryParams: parsedQueryParams,
        body: parsedBody,
      });

      handleClose();
    } catch (err) {
      console.error("Invalid JSON:", err);
      alert(
        "Invalid JSON in one of the fields. Please check the errors and try again."
      );
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this node?")) {
      deleteNode(id);
      handleClose();
    }
  };

  const formatJson = (field) => {
    const parsed = JSON.parse(formData[field]);
    const formatted = JSON.stringify(parsed, null, 2);
    setFormData((prev) => ({
      ...prev,
      [field]: formatted,
    }));
    setJsonErrors((prev) => ({ ...prev, [field]: null }));
  };

  const getItemCount = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed === null) return 0;
      if (typeof parsed === "object") {
        return Object.keys(parsed).length;
      }
      return 0;
    } catch {
      return 0;
    }
  };

  // Calculate counts for display
  const headerCount = getItemCount(JSON.stringify(data.headers || {}));
  const paramCount = getItemCount(JSON.stringify(data.queryParams || {}));
  const hasBody = data.body !== null && data.body !== undefined;

  return (
    <>
      {/* Camunda-Style Node Card */}
      <div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          width: "180px",
          minHeight: "80px",
          backgroundColor: CAMUNDA_COLORS.background,
          border: `2px solid ${
            selected
              ? CAMUNDA_COLORS.selectedBorder
              : isHovered
              ? CAMUNDA_COLORS.borderHover
              : CAMUNDA_COLORS.border
          }`,
          borderRadius: "10px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: selected
            ? `0 0 0 2px ${CAMUNDA_COLORS.selectedBorder}40`
            : isHovered
            ? "0 4px 12px rgba(0,0,0,0.15)"
            : "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Input Handle - Left Side (Camunda-style circle) */}
        <Handle
          type="target"
          position={Position.Left}
          id="input"
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: CAMUNDA_COLORS.background,
            border: `2px solid ${CAMUNDA_COLORS.handleColor}`,
            borderRadius: "50%",
            left: "-7px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        {/* Task Type Icon - Top Left Corner (Camunda style) */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: CAMUNDA_COLORS.taskIcon,
          }}
        >
          <ApiIcon sx={{ fontSize: 20 }} />
        </div>

        {/* Settings Icon - Top Right (visible on hover) */}
        {isHovered && (
          <IconButton
            size="small"
            onClick={handleOpenModal}
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              padding: "4px",
              backgroundColor: "rgba(255,255,255,0.9)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            <SettingsIcon sx={{ fontSize: 14, color: CAMUNDA_COLORS.primary }} />
          </IconButton>
        )}

        {/* Node Content */}
        <div
          style={{
            padding: "36px 12px 12px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {/* Method Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: `${CAMUNDA_COLORS.primary}15`,
              padding: "2px 8px",
              borderRadius: "4px",
              color: CAMUNDA_COLORS.primary,
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            {getMethodIcon(data.method)}
            <span>{data.method}</span>
          </div>

          {/* Node Name */}
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: CAMUNDA_COLORS.text,
              textAlign: "center",
              lineHeight: 1.3,
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {data.name || "API Task"}
          </div>

          {/* URL Preview */}
          <Tooltip title={data.url || "/endpoint"} placement="bottom">
            <div
              style={{
                fontSize: "10px",
                color: CAMUNDA_COLORS.textSecondary,
                textAlign: "center",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {data.url || "/endpoint"}
            </div>
          </Tooltip>

          {/* Data Indicators */}
          {(headerCount > 0 || paramCount > 0 || hasBody) && (
            <div
              style={{
                display: "flex",
                gap: "4px",
                marginTop: "4px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {headerCount > 0 && (
                <span
                  style={{
                    fontSize: "9px",
                    backgroundColor: `${CAMUNDA_COLORS.secondary}30`,
                    color: CAMUNDA_COLORS.primary,
                    padding: "1px 6px",
                    borderRadius: "8px",
                    fontWeight: 500,
                  }}
                >
                  H:{headerCount}
                </span>
              )}
              {paramCount > 0 && (
                <span
                  style={{
                    fontSize: "9px",
                    backgroundColor: `${CAMUNDA_COLORS.secondary}30`,
                    color: CAMUNDA_COLORS.primary,
                    padding: "1px 6px",
                    borderRadius: "8px",
                    fontWeight: 500,
                  }}
                >
                  P:{paramCount}
                </span>
              )}
              {hasBody && (
                <span
                  style={{
                    fontSize: "9px",
                    backgroundColor: `${CAMUNDA_COLORS.secondary}30`,
                    color: CAMUNDA_COLORS.primary,
                    padding: "1px 6px",
                    borderRadius: "8px",
                    fontWeight: 500,
                  }}
                >
                  Body
                </span>
              )}
            </div>
          )}
        </div>

        {/* Output Handle - Right Side (Camunda-style circle) */}
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: CAMUNDA_COLORS.background,
            border: `2px solid ${CAMUNDA_COLORS.handleColor}`,
            borderRadius: "50%",
            right: "-7px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        {/* Bottom marker line (Camunda task indicator) */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "40px",
            height: "3px",
            backgroundColor: CAMUNDA_COLORS.primary,
            borderRadius: "2px 2px 0 0",
          }}
        />
      </div>

      {/* Configuration Modal - Camunda styled */}
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="api-node-modal-title"
      >
        <Box sx={modalStyle}>
          {/* Header - Camunda blue */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              bgcolor: CAMUNDA_COLORS.primary,
              borderBottom: `3px solid ${CAMUNDA_COLORS.secondary}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ApiIcon sx={{ color: "white", fontSize: 28 }} />
              <Box>
                <Typography
                  id="api-node-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  Configure API Task
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.7)" }}
                >
                  ID: {id}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Body */}
          <Box
            sx={{ p: 3, maxHeight: "calc(90vh - 200px)", overflowY: "auto" }}
          >
            {/* Properties Panel Header */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: CAMUNDA_COLORS.primary,
                  fontWeight: 600,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <HttpIcon sx={{ fontSize: 18 }} />
                General
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  placeholder="Enter task name"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: CAMUNDA_COLORS.primary,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: CAMUNDA_COLORS.primary,
                    },
                  }}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <InputLabel
                      sx={{
                        "&.Mui-focused": { color: CAMUNDA_COLORS.primary },
                      }}
                    >
                      Method
                    </InputLabel>
                    <Select
                      name="method"
                      value={formData.method}
                      label="Method"
                      onChange={handleChange}
                      sx={{
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: CAMUNDA_COLORS.primary,
                        },
                      }}
                    >
                      <MenuItem value="GET">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CloudDownloadIcon sx={{ fontSize: 16 }} /> GET
                        </Box>
                      </MenuItem>
                      <MenuItem value="POST">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CloudUploadIcon sx={{ fontSize: 16 }} /> POST
                        </Box>
                      </MenuItem>
                      <MenuItem value="PUT">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <EditIcon sx={{ fontSize: 16 }} /> PUT
                        </Box>
                      </MenuItem>
                      <MenuItem value="PATCH">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <EditIcon sx={{ fontSize: 16 }} /> PATCH
                        </Box>
                      </MenuItem>
                      <MenuItem value="DELETE">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 16 }} /> DELETE
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="URL / Endpoint"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    placeholder="https://api.example.com/users/{userId}"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: CAMUNDA_COLORS.primary,
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: CAMUNDA_COLORS.primary,
                      },
                    }}
                  />
                </Box>
              </Stack>
            </Paper>

            {/* Tabs - Camunda styled */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 500,
                    "&.Mui-selected": {
                      color: CAMUNDA_COLORS.primary,
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: CAMUNDA_COLORS.primary,
                  },
                }}
              >
                <Tab
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Headers
                      {getItemCount(formData.headers) > 0 && (
                        <Chip
                          label={getItemCount(formData.headers)}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.7rem",
                            bgcolor: `${CAMUNDA_COLORS.secondary}40`,
                            color: CAMUNDA_COLORS.primary,
                          }}
                        />
                      )}
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Query Params
                      {getItemCount(formData.queryParams) > 0 && (
                        <Chip
                          label={getItemCount(formData.queryParams)}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.7rem",
                            bgcolor: `${CAMUNDA_COLORS.secondary}40`,
                            color: CAMUNDA_COLORS.primary,
                          }}
                        />
                      )}
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Body
                      {formData.body !== "null" && formData.body !== "{}" && (
                        <Chip
                          label="✓"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.7rem",
                            bgcolor: `${CAMUNDA_COLORS.secondary}40`,
                            color: CAMUNDA_COLORS.primary,
                          }}
                        />
                      )}
                    </Box>
                  }
                />
              </Tabs>
            </Box>

            {/* Headers Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Enter headers as JSON object
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    onClick={() => formatJson("headers")}
                    sx={{ color: CAMUNDA_COLORS.primary }}
                  >
                    Format
                  </Button>
                  <Button
                    size="small"
                    onClick={() => loadDummyData("headers")}
                    sx={{ color: CAMUNDA_COLORS.primary }}
                  >
                    Load Sample
                  </Button>
                </Box>
              </Box>
              {jsonErrors.headers && (
                <Alert severity="error" sx={{ mb: 1, py: 0 }}>
                  {jsonErrors.headers}
                </Alert>
              )}
              <TextField
                name="headers"
                value={formData.headers}
                onChange={handleChange}
                fullWidth
                multiline
                rows={8}
                size="small"
                error={!!jsonErrors.headers}
                placeholder='{"Content-Type": "application/json"}'
                InputProps={{
                  sx: {
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    bgcolor: "#f8fafc",
                  },
                }}
              />
            </TabPanel>

            {/* Query Params Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Enter query parameters as JSON object
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    onClick={() => formatJson("queryParams")}
                    sx={{ color: CAMUNDA_COLORS.primary }}
                  >
                    Format
                  </Button>
                  <Button
                    size="small"
                    onClick={() => loadDummyData("queryParams")}
                    sx={{ color: CAMUNDA_COLORS.primary }}
                  >
                    Load Sample
                  </Button>
                </Box>
              </Box>
              {jsonErrors.queryParams && (
                <Alert severity="error" sx={{ mb: 1, py: 0 }}>
                  {jsonErrors.queryParams}
                </Alert>
              )}
              <TextField
                name="queryParams"
                value={formData.queryParams}
                onChange={handleChange}
                fullWidth
                multiline
                rows={8}
                size="small"
                error={!!jsonErrors.queryParams}
                placeholder='{"page": 1, "limit": 10}'
                InputProps={{
                  sx: {
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    bgcolor: "#f8fafc",
                  },
                }}
              />
            </TabPanel>

            {/* Body Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Enter request body as JSON (use null for no body)
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    onClick={() => formatJson("body")}
                    sx={{ color: CAMUNDA_COLORS.primary }}
                  >
                    Format
                  </Button>
                  <Button
                    size="small"
                    onClick={() => loadDummyData("body")}
                    sx={{ color: CAMUNDA_COLORS.primary }}
                  >
                    Load Sample
                  </Button>
                </Box>
              </Box>
              {jsonErrors.body && (
                <Alert severity="error" sx={{ mb: 1, py: 0 }}>
                  {jsonErrors.body}
                </Alert>
              )}
              <TextField
                name="body"
                value={formData.body}
                onChange={handleChange}
                fullWidth
                multiline
                rows={8}
                size="small"
                error={!!jsonErrors.body}
                placeholder='{"name": "John", "email": "john@example.com"}'
                InputProps={{
                  sx: {
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    bgcolor: "#f8fafc",
                  },
                }}
              />
            </TabPanel>
          </Box>

          {/* Footer - Camunda styled */}
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              bgcolor: "#f8fafc",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              size="small"
            >
              Delete
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={handleClose} size="small">
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                size="small"
                startIcon={<SendIcon />}
                disabled={
                  !!jsonErrors.headers ||
                  !!jsonErrors.queryParams ||
                  !!jsonErrors.body
                }
                sx={{
                  bgcolor: CAMUNDA_COLORS.primary,
                  "&:hover": {
                    bgcolor: CAMUNDA_COLORS.primary,
                    filter: "brightness(1.1)",
                  },
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default memo(ApiNode);