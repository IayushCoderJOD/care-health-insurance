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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
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
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "Accept": "application/json",
      "X-API-Key": "your-api-key-here"
    },
    POST: {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "Accept": "application/json",
      "X-Request-ID": "req-12345"
    },
    PUT: {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "If-Match": "etag-value"
    },
    DELETE: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "X-Confirm-Delete": "true"
    }
  },
  queryParams: {
    GET: {
      "page": 1,
      "limit": 10,
      "sort": "createdAt",
      "order": "desc",
      "search": "keyword",
      "filter[status]": "active"
    },
    POST: {
      "notify": true,
      "async": false
    },
    PUT: {
      "validate": true
    },
    DELETE: {
      "soft": true,
      "cascade": false
    }
  },
  body: {
    GET: null,
    POST: {
      "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "age": 30,
        "roles": ["admin", "user"],
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "zipCode": "10001"
        }
      },
      "metadata": {
        "source": "web",
        "campaign": "summer2024"
      }
    },
    PUT: {
      "id": "user-123",
      "updates": {
        "firstName": "Jane",
        "email": "jane.doe@example.com",
        "status": "verified"
      },
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    PATCH: {
      "operations": [
        { "op": "replace", "path": "/email", "value": "new@example.com" },
        { "op": "add", "path": "/tags/-", "value": "premium" }
      ]
    },
    DELETE: {
      "reason": "User requested account deletion",
      "backupRequired": true
    }
  }
};

const ApiNode = ({ id, data, selected }) => {
  // Store actions
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId);
  const editingNodeId = useWorkflowStore((state) => state.editingNodeId);
  const setEditingNodeId = useWorkflowStore((state) => state.setEditingNodeId);
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  // Local state
  const [tabValue, setTabValue] = useState(0);
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
        dummyValue = DUMMY_DATA.queryParams[method] || DUMMY_DATA.queryParams.GET;
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

  // Load all dummy data
  const loadAllDummyData = () => {
    const method = formData.method;
    const headers = JSON.stringify(
      DUMMY_DATA.headers[method] || DUMMY_DATA.headers.GET,
      null,
      2
    );
    const queryParams = JSON.stringify(
      DUMMY_DATA.queryParams[method] || DUMMY_DATA.queryParams.GET,
      null,
      2
    );
    const body = JSON.stringify(
      DUMMY_DATA.body[method] ?? null,
      null,
      2
    );

    setFormData((prev) => ({
      ...prev,
      headers,
      queryParams,
      body,
    }));
    setJsonErrors({ headers: null, queryParams: null, body: null });
  };

  const handleSave = () => {
    try {
      // Parse and validate JSON fields
      const parsedHeaders = JSON.parse(formData.headers || "{}");
      const parsedQueryParams = JSON.parse(formData.queryParams || "{}");
      const parsedBody = JSON.parse(formData.body || "null");

      // Update node in store with ALL data
      updateNode(id, {
        name: formData.name,
        method: formData.method,
        url: formData.url,
        headers: parsedHeaders,
        queryParams: parsedQueryParams,
        body: parsedBody,
      });

      console.log("Node saved successfully:", {
        id,
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
      alert("Invalid JSON in one of the fields. Please check the errors and try again.");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this node?")) {
      deleteNode(id);
      handleClose();
    }
  };

  // Format JSON helper
  const formatJson = (field) => {
    try {
      const parsed = JSON.parse(formData[field]);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormData((prev) => ({
        ...prev,
        [field]: formatted,
      }));
      setJsonErrors((prev) => ({ ...prev, [field]: null }));
    } catch (err) {
      // Already invalid, error is shown
    }
  };

  // Count items in JSON object
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

  // Add this helper text to your ApiNode modal to show users how to use variables

const VariableHelperText = () => (
  <Paper sx={{ p: 2, mb: 2, bgcolor: "#f0f9ff", border: "1px solid #bae6fd" }}>
    <Typography variant="subtitle2" color="primary" gutterBottom>
      💡 Using Variables
    </Typography>
    <Typography variant="caption" component="div">
      You can reference data from previous steps using these patterns:
    </Typography>
    <Box component="ul" sx={{ m: 0, pl: 2, "& li": { fontSize: "0.75rem" } }}>
      <li><code>{"{{input.userId}}"}</code> - Initial workflow input</li>
      <li><code>{"{{previousStep.data.id}}"}</code> - Previous step's output</li>
      <li><code>{"{{variables.apiKey}}"}</code> - Global variables</li>
    </Box>
    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
      Example URL: <code>https://api.example.com/users/{"{{previousStep.userId}}"}</code>
    </Typography>
  </Paper>
);

  // Method color mapping for Tailwind
  const methodColors = {
    GET: "bg-green-500",
    POST: "bg-blue-500",
    PUT: "bg-yellow-500",
    PATCH: "bg-orange-500",
    DELETE: "bg-red-500",
  };

  // Method color mapping for MUI
  const methodColorsMUI = {
    GET: "#22c55e",
    POST: "#3b82f6",
    PUT: "#eab308",
    PATCH: "#f97316",
    DELETE: "#ef4444",
  };

  const methodColor = methodColors[data.method] || "bg-gray-500";

  // Calculate counts for display
  const headerCount = getItemCount(JSON.stringify(data.headers || {}));
  const paramCount = getItemCount(JSON.stringify(data.queryParams || {}));
  const hasBody = data.body !== null && data.body !== undefined;

  return (
    <>
      {/* Node Card */}
      <div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[220px] cursor-pointer transition-all ${
          selected
            ? "border-blue-500 shadow-blue-200"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* Input Handle - Left Side */}
        <Handle
          type="target"
          position={Position.Left}
          id="input"
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white hover:!bg-blue-500 transition-colors"
          style={{ top: "50%" }}
        />

        {/* Node Content */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`${methodColor} text-white text-xs font-bold px-2 py-1 rounded`}
          >
            {data.method}
          </span>
          <span className="text-sm font-medium text-gray-700 truncate flex-1">
            {data.name || "API Node"}
          </span>
          <IconButton
            size="small"
            onClick={handleOpenModal}
            sx={{
              padding: "2px",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
            }}
          >
            <SettingsIcon sx={{ fontSize: 16, color: "gray" }} />
          </IconButton>
        </div>

        <div className="text-xs text-gray-500 truncate mb-2">
          {data.url || "/endpoint"}
        </div>

        {/* Show indicators for configured data */}
        <div className="flex gap-1 flex-wrap">
          {headerCount > 0 && (
            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
              {headerCount} headers
            </span>
          )}
          {paramCount > 0 && (
            <span className="text-xs bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded">
              {paramCount} params
            </span>
          )}
          {hasBody && (
            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
              body
            </span>
          )}
        </div>

        {/* Output Handle - Right Side */}
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white hover:!bg-green-500 transition-colors"
          style={{ top: "50%" }}
        />
      </div>

      {/* Configuration Modal */}
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="api-node-modal-title"
      >
        <Box sx={modalStyle}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              bgcolor: methodColorsMUI[formData.method] || methodColorsMUI.GET,
            }}
          >
            <Box>
              <Typography
                id="api-node-modal-title"
                variant="h6"
                component="h2"
                sx={{ color: "white", fontWeight: 600 }}
              >
                Configure API Node
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Node ID: {id}
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Body */}
          <Box
            sx={{ p: 3, maxHeight: "calc(90vh - 200px)", overflowY: "auto" }}
          >
            {/* Basic Info */}
            <Stack spacing={3}>
              <TextField
                label="Node Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                size="small"
                placeholder="Enter a name for this node"
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Method</InputLabel>
                  <Select
                    name="method"
                    value={formData.method}
                    label="Method"
                    onChange={handleChange}
                  >
                    <MenuItem value="GET">GET</MenuItem>
                    <MenuItem value="POST">POST</MenuItem>
                    <MenuItem value="PUT">PUT</MenuItem>
                    <MenuItem value="PATCH">PATCH</MenuItem>
                    <MenuItem value="DELETE">DELETE</MenuItem>
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
                />
              </Box>

            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Tabs for Headers, Params, Body */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="API configuration tabs"
              >
                <Tab
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Headers
                      {getItemCount(formData.headers) > 0 && (
                        <Chip
                          label={getItemCount(formData.headers)}
                          size="small"
                          sx={{ height: 20, fontSize: "0.7rem" }}
                        />
                      )}
                    </Box>
                  }
                  id="tab-0"
                />
                <Tab
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Query Params
                      {getItemCount(formData.queryParams) > 0 && (
                        <Chip
                          label={getItemCount(formData.queryParams)}
                          size="small"
                          sx={{ height: 20, fontSize: "0.7rem" }}
                        />
                      )}
                    </Box>
                  }
                  id="tab-1"
                />
                <Tab
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Body
                      {formData.body !== "null" && formData.body !== "{}" && (
                        <Chip
                          label="✓"
                          size="small"
                          color="success"
                          sx={{ height: 20, fontSize: "0.7rem" }}
                        />
                      )}
                    </Box>
                  }
                  id="tab-2"
                />
              </Tabs>
            </Box>

            {/* Headers Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Enter headers as JSON object
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button size="small" onClick={() => formatJson("headers")}>
                    Format
                  </Button>
                  <Button size="small" onClick={() => loadDummyData("headers")}>
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
                  sx: { fontFamily: "monospace", fontSize: "0.875rem" },
                }}
              />
            </TabPanel>

            {/* Query Params Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Enter query parameters as JSON object
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button size="small" onClick={() => formatJson("queryParams")}>
                    Format
                  </Button>
                  <Button size="small" onClick={() => loadDummyData("queryParams")}>
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
                  sx: { fontFamily: "monospace", fontSize: "0.875rem" },
                }}
              />
            </TabPanel>

            {/* Body Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Enter request body as JSON (use null for no body)
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button size="small" onClick={() => formatJson("body")}>
                    Format
                  </Button>
                  <Button size="small" onClick={() => loadDummyData("body")}>
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
                  sx: { fontFamily: "monospace", fontSize: "0.875rem" },
                }}
              />
            </TabPanel>
          </Box>

          {/* Footer */}
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              bgcolor: "grey.50",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              size="small"
            >
              Delete Node
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={handleClose} size="small">
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                size="small"
                disabled={
                  !!jsonErrors.headers ||
                  !!jsonErrors.queryParams ||
                  !!jsonErrors.body
                }
                sx={{
                  bgcolor: methodColorsMUI[formData.method],
                  "&:hover": {
                    bgcolor: methodColorsMUI[formData.method],
                    filter: "brightness(0.9)",
                  },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default memo(ApiNode);