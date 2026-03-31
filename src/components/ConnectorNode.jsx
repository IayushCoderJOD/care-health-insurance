import React, { useState, useRef, memo, useCallback } from "react";
import PropTypes from "prop-types";
import { Handle, Position } from "reactflow";
import useWorkflowStore from "../store/workflowStore";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import StorageIcon from "@mui/icons-material/Storage";

// color scheme distinct from ApiNode
const CONNECTOR_COLORS = {
  background: "#f3e8ff", // light purple
  border: "#9b5de5",
  borderHover: "#7b2cbf",
  selectedBorder: "#9b5de5",
  handleColor: "#9b5de5",
  taskIcon: "#9b5de5",
  text: "#3c096c",
  textSecondary: "#6a4c93",
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxHeight: "80vh",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  outline: "none",
  overflow: "auto",
};

const ConnectorNode = memo(function ConnectorNode({ id, data, selected }) {
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId);
  const editingNodeId = useWorkflowStore((state) => state.editingNodeId);
  const setEditingNodeId = useWorkflowStore((state) => state.setEditingNodeId);
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  const nodeRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [configString, setConfigString] = useState("{}");
  const [operation, setOperation] = useState("findAll");
  const [backendUrl, setBackendUrl] = useState("http://localhost:8080");
  const [formData, setFormData] = useState({ name: data.name || "" });

  const isOpen = editingNodeId === id;

  // helper to open modal and initialize form state
  const openModal = useCallback(() => {
    const cfg = data.config || {};
    setConfigString(JSON.stringify(cfg, null, 2));
    setOperation(cfg.operation || "findAll");
    setBackendUrl(cfg.backendUrl || "http://localhost:8080");
    setFormData({ name: data.name || "" });
    setEditingNodeId(id);
  }, [data, id, setEditingNodeId]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    setSelectedNodeId(id);
  }, [id, setSelectedNodeId]);

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    openModal();
  }, [openModal]);

  const handleSettingsClick = useCallback((e) => {
    e.stopPropagation();
    openModal();
  }, [openModal]);

  const handleClose = useCallback(() => {
    setEditingNodeId(null);
  }, [setEditingNodeId]);

  const handleSave = useCallback(() => {
    let parsed;
    try {
      parsed = JSON.parse(configString || "{}");
    } catch (error) {
      console.error("Invalid JSON configuration", error);
      alert("Invalid JSON configuration");
      return;
    }
    // Add operation and backendUrl to config
    const finalConfig = {
      ...parsed,
      operation,
      backendUrl,
    };
    updateNode(id, {
      name: formData.name,
      config: finalConfig,
    });
    handleClose();
  }, [configString, operation, backendUrl, formData.name, id, updateNode, handleClose]);

  const handleNameChange = useCallback((e) => {
    setFormData({ ...formData, name: e.target.value });
  }, [formData]);

  const handleDelete = useCallback(() => {
    if (globalThis.confirm("Delete this connector node?")) {
      deleteNode(id);
      handleClose();
    }
  }, [id, deleteNode, handleClose]);

  let borderColor;
  if (selected) {
    borderColor = CONNECTOR_COLORS.selectedBorder;
  } else if (isHovered) {
    borderColor = CONNECTOR_COLORS.borderHover;
  } else {
    borderColor = CONNECTOR_COLORS.border;
  }

  let boxShadow;
  if (selected) {
    boxShadow = `0 0 0 2px ${CONNECTOR_COLORS.selectedBorder}40`;
  } else if (isHovered) {
    boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  } else {
    boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
  }

  return (
    <>
      <div
        ref={nodeRef}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick(e);
        }}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          width: "160px",
          minHeight: "70px",
          backgroundColor: CONNECTOR_COLORS.background,
          border: `2px solid ${borderColor}`,
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow,
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          id="in"
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: CONNECTOR_COLORS.background,
            border: `2px solid ${CONNECTOR_COLORS.handleColor}`,
            borderRadius: "50%",
            left: "-6px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="out"
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: CONNECTOR_COLORS.background,
            border: `2px solid ${CONNECTOR_COLORS.handleColor}`,
            borderRadius: "50%",
            right: "-6px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        {isHovered && (
          <div
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              background: "rgba(255,255,255,0.9)",
              padding: "2px",
              borderRadius: "6px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }}
          >
            <Tooltip title="Options" placement="top">
              <IconButton
                size="small"
                onClick={handleSettingsClick}
                sx={{ p: "4px" }}
              >
                <SettingsIcon
                  sx={{ fontSize: 16, color: CONNECTOR_COLORS.border }}
                />
              </IconButton>
            </Tooltip>
          </div>
        )}

        <div
          style={{
            padding: "28px 8px 8px 8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <StorageIcon sx={{ color: CONNECTOR_COLORS.taskIcon, fontSize: 24 }} />
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: CONNECTOR_COLORS.text,
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {data.name || data.connector || "Connector"}
          </div>
        </div>
      </div>

      {/* configuration modal */}
      <Modal open={isOpen} onClose={handleClose} aria-labelledby="connector-modal-title">
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, py: 2, bgcolor: CONNECTOR_COLORS.border }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StorageIcon sx={{ color: "white", fontSize: 28 }} />
              <Typography id="connector-modal-title" variant="h6" component="h2" sx={{ color: "white" }}>
                Configure Connector
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small" sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 3 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={handleNameChange}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Component"
              value={data.connector}
              fullWidth
              size="small"
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              label="Backend URL"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              placeholder="http://localhost:8080"
            />
            {data.connector === "mongodb" && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Operation</InputLabel>
                <Select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  label="Operation"
                >
                  <MenuItem value="findAll">Find All (GET)</MenuItem>
                  <MenuItem value="insert">Insert (POST)</MenuItem>
                  <MenuItem value="find">Find by Query</MenuItem>
                </Select>
              </FormControl>
            )}
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Additional Config (JSON)</Typography>
            <TextField
              multiline
              rows={6}
              fullWidth
              value={configString}
              onChange={(e) => setConfigString(e.target.value)}
              sx={{ fontFamily: "monospace", mt: 1 }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}>
              <Button color="error" onClick={handleDelete}>Delete</Button>
              <Button variant="contained" onClick={handleSave}>Save</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
});

// prop validation to satisfy linter
ConnectorNode.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.shape({
    connector: PropTypes.string,
    name: PropTypes.string,
    config: PropTypes.object,
  }).isRequired,
  selected: PropTypes.bool,
};

ConnectorNode.defaultProps = {
  selected: false,
};

export default ConnectorNode;
