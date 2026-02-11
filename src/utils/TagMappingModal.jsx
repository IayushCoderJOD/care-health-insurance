import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  Divider,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import LinkIcon from "@mui/icons-material/Link";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100vw",
  maxWidth: "95vw",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  outline: "none",
  overflow: "hidden",
};

const SAMPLE_SOURCES = [
  { id: "src-1", name: "Website Development", category: "Development" },
  { id: "src-2", name: "Fixture", category: "Setup" },
  { id: "src-3", name: "Campaign Rollout", category: "Marketing" },
  { id: "src-4", name: "API Integration", category: "Development" },
  { id: "src-5", name: "Database Setup", category: "Setup" },
  { id: "src-6", name: "User Testing", category: "QA" },
  { id: "src-7", name: "Deployment", category: "DevOps" },
];

const SAMPLE_TARGETS = [
  { id: "tgt-1", name: "Marketer Request", category: "Marketing" },
  { id: "tgt-2", name: "Developer Task", category: "Development" },
  { id: "tgt-3", name: "QA Review", category: "QA" },
  { id: "tgt-4", name: "Design Review", category: "Design" },
  { id: "tgt-5", name: "Client Approval", category: "External" },
  { id: "tgt-6", name: "Documentation", category: "Docs" },
];

export default function TagMappingModal({selectedNode, open, onClose, onSave }) {
  const [mappings, setMappings] = useState([
    { id: "map-1", sourceId: "", targetId: "" },
  ]);

  const [sourceSearch, setSourceSearch] = useState("");
  const [targetSearch, setTargetSearch] = useState("");

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverMapping, setDragOverMapping] = useState(null);
  const [dragOverSide, setDragOverSide] = useState(null);

  const filteredSources = SAMPLE_SOURCES.filter((item) =>
    item.name.toLowerCase().includes(sourceSearch.toLowerCase())
  );

  const filteredTargets = SAMPLE_TARGETS.filter((item) =>
    item.name.toLowerCase().includes(targetSearch.toLowerCase())
  );

  const handleAddMapping = () => {
    setMappings((prev) => [
      ...prev,
      { id: `map-${Date.now()}`, sourceId: "", targetId: "" },
    ]);
  };

  const handleRemoveMapping = (mappingId) => {
    setMappings((prev) => prev.filter((m) => m.id !== mappingId));
  };

  const handleMappingChange = (mappingId, field, value) => {
    setMappings((prev) =>
      prev.map((m) => (m.id === mappingId ? { ...m, [field]: value } : m))
    );
  };

  const handleDragStart = (e, item, type) => {
    setDraggedItem({ ...item, type });
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverMapping(null);
    setDragOverSide(null);
  };

  const handleDragOver = (e, mappingId, side) => {
    e.preventDefault();
    setDragOverMapping(mappingId);
    setDragOverSide(side);
  };

  const handleDragLeave = () => {
    setDragOverMapping(null);
    setDragOverSide(null);
  };

  const handleDrop = (e, mappingId, side) => {
    e.preventDefault();
    if (draggedItem) {
      const field = side === "source" ? "sourceId" : "targetId";
      if (
        (side === "source" && draggedItem.type === "source") ||
        (side === "target" && draggedItem.type === "target")
      ) {
        handleMappingChange(mappingId, field, draggedItem.id);
      }
    }
    setDraggedItem(null);
    setDragOverMapping(null);
    setDragOverSide(null);
  };

  const handleSave = () => {
    const validMappings = mappings.filter((m) => m.sourceId && m.targetId);
    onSave?.(validMappings);
    onClose();
  };

  const getMappingStatus = (mapping) => {
    if (mapping.sourceId && mapping.targetId) return "complete";
    if (mapping.sourceId || mapping.targetId) return "partial";
    return "empty";
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
            bgcolor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LinkIcon sx={{ color: "#6366f1" }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Selected {selectedNode}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Map source tags to target labels
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: "flex", height: "calc(90vh - 180px)", minHeight: 400 }}>
          {/* Left Panel - Source Tags */}
          <Box
            sx={{
              width: 220,
              borderRight: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              bgcolor: "#f8fafc",
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                📁 Tags
              </Typography>
              <TextField
                size="small"
                placeholder="Search tags..."
                value={sourceSearch}
                onChange={(e) => setSourceSearch(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                  sx: { fontSize: "0.85rem" },
                }}
              />
            </Box>
            <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
              {filteredSources.map((source) => (
                <Paper
                  key={source.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, source, "source")}
                  onDragEnd={handleDragEnd}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    cursor: "grab",
                    border: "1px solid #e2e8f0",
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "white",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "#6366f1",
                      bgcolor: "#f5f3ff",
                    },
                    "&:active": {
                      cursor: "grabbing",
                    },
                  }}
                >
                  <DragIndicatorIcon
                    fontSize="small"
                    sx={{ color: "#9ca3af" }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      noWrap
                      sx={{ fontSize: "0.85rem" }}
                    >
                      {source.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.7rem" }}
                    >
                      {source.category}
                    </Typography>
                  </Box>
                  <AddIcon fontSize="small" sx={{ color: "#9ca3af" }} />
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Center Panel - Mapping Area */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Add Mapping Button */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid #e2e8f0",
                bgcolor: "#f8fafc",
              }}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddMapping}
                fullWidth
                sx={{
                  bgcolor: "#6366f1",
                  "&:hover": { bgcolor: "#4f46e5" },
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Add more tags & labels
              </Button>
            </Box>

            {/* Column Headers */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 3,
                py: 1.5,
                borderBottom: "1px solid #e2e8f0",
                bgcolor: "#f1f5f9",
              }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ flex: 1, color: "#64748b" }}
              >
                SELECT A TAG
              </Typography>
              <Box sx={{ width: 60, textAlign: "center" }}>
                <SyncAltIcon fontSize="small" sx={{ color: "#94a3b8" }} />
              </Box>
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ flex: 1, color: "#64748b", textAlign: "right" }}
              >
                SELECT A LABEL
              </Typography>
            </Box>

            {/* Mapping Rows */}
            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              {mappings.map((mapping) => {
                const status = getMappingStatus(mapping);
                const isSourceDragOver =
                  dragOverMapping === mapping.id && dragOverSide === "source";
                const isTargetDragOver =
                  dragOverMapping === mapping.id && dragOverSide === "target";

                return (
                  <Paper
                    key={mapping.id}
                    elevation={0}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      mb: 2,
                      border: "1px solid",
                      borderColor:
                        status === "complete"
                          ? "#86efac"
                          : status === "partial"
                          ? "#fcd34d"
                          : "#e2e8f0",
                      borderRadius: 2,
                      bgcolor:
                        status === "complete"
                          ? "#f0fdf4"
                          : status === "partial"
                          ? "#fffbeb"
                          : "white",
                    }}
                  >
                    {/* Source Dropdown / Drop Zone */}
                    <Box
                      sx={{ flex: 1 }}
                      onDragOver={(e) => handleDragOver(e, mapping.id, "source")}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, mapping.id, "source")}
                    >
                      <FormControl fullWidth size="small">
                        <Select
                          value={mapping.sourceId}
                          onChange={(e) =>
                            handleMappingChange(mapping.id, "sourceId", e.target.value)
                          }
                          displayEmpty
                          sx={{
                            bgcolor: isSourceDragOver ? "#ddd6fe" : "white",
                            borderColor: isSourceDragOver ? "#6366f1" : undefined,
                            transition: "all 0.2s",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: isSourceDragOver
                                ? "#6366f1"
                                : undefined,
                              borderWidth: isSourceDragOver ? 2 : 1,
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <Typography color="text.secondary" fontSize="0.875rem">
                              Select a tag
                            </Typography>
                          </MenuItem>
                          {SAMPLE_SOURCES.map((source) => (
                            <MenuItem key={source.id} value={source.id}>
                              <Box
                                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                              >
                                <Chip
                                  label={source.category}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: "0.65rem",
                                    bgcolor: "#e0e7ff",
                                    color: "#4338ca",
                                  }}
                                />
                                {source.name}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {isSourceDragOver && (
                        <Typography
                          variant="caption"
                          color="primary"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          Drop here
                        </Typography>
                      )}
                    </Box>

                    {/* Arrow Indicator */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 50,
                      }}
                    >
                      <ArrowForwardIcon
                        sx={{
                          color:
                            status === "complete"
                              ? "#22c55e"
                              : status === "partial"
                              ? "#f59e0b"
                              : "#d1d5db",
                          fontSize: 28,
                        }}
                      />
                    </Box>

                    {/* Target Dropdown / Drop Zone */}
                    <Box
                      sx={{ flex: 1 }}
                      onDragOver={(e) => handleDragOver(e, mapping.id, "target")}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, mapping.id, "target")}
                    >
                      <FormControl fullWidth size="small">
                        <Select
                          value={mapping.targetId}
                          onChange={(e) =>
                            handleMappingChange(mapping.id, "targetId", e.target.value)
                          }
                          displayEmpty
                          sx={{
                            bgcolor: isTargetDragOver ? "#d1fae5" : "white",
                            transition: "all 0.2s",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: isTargetDragOver
                                ? "#22c55e"
                                : undefined,
                              borderWidth: isTargetDragOver ? 2 : 1,
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <Typography color="text.secondary" fontSize="0.875rem">
                              Select a label
                            </Typography>
                          </MenuItem>
                          {SAMPLE_TARGETS.map((target) => (
                            <MenuItem key={target.id} value={target.id}>
                              <Box
                                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                              >
                                <Chip
                                  label={target.category}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: "0.65rem",
                                    bgcolor: "#dcfce7",
                                    color: "#166534",
                                  }}
                                />
                                {target.name}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {isTargetDragOver && (
                        <Typography
                          variant="caption"
                          color="success.main"
                          sx={{ mt: 0.5, display: "block", textAlign: "right" }}
                        >
                          Drop here
                        </Typography>
                      )}
                    </Box>

                    {/* Delete Button */}
                    <Tooltip title="Remove mapping">
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveMapping(mapping.id)}
                        disabled={mappings.length === 1}
                        sx={{
                          color: "#ef4444",
                          "&:hover": { bgcolor: "#fee2e2" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Paper>
                );
              })}

              {/* Empty State */}
              {mappings.length === 0 && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    color: "text.secondary",
                  }}
                >
                  <Typography>No mappings yet</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddMapping}
                    sx={{ mt: 2 }}
                  >
                    Add your first mapping
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          {/* Right Panel - Target Labels */}
          <Box
            sx={{
              width: 220,
              borderLeft: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              bgcolor: "#f8fafc",
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                🏷️ Labels
              </Typography>
              <TextField
                size="small"
                placeholder="Search labels..."
                value={targetSearch}
                onChange={(e) => setTargetSearch(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                  sx: { fontSize: "0.85rem" },
                }}
              />
            </Box>
            <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
              {filteredTargets.map((target) => (
                <Paper
                  key={target.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, target, "target")}
                  onDragEnd={handleDragEnd}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    cursor: "grab",
                    border: "1px solid #e2e8f0",
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "white",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "#22c55e",
                      bgcolor: "#f0fdf4",
                    },
                    "&:active": {
                      cursor: "grabbing",
                    },
                  }}
                >
                  <AddIcon fontSize="small" sx={{ color: "#9ca3af" }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      noWrap
                      sx={{ fontSize: "0.85rem" }}
                    >
                      {target.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.7rem" }}
                    >
                      {target.category}
                    </Typography>
                  </Box>
                  <DragIndicatorIcon
                    fontSize="small"
                    sx={{ color: "#9ca3af" }}
                  />
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
            borderTop: "1px solid #e2e8f0",
            bgcolor: "#f8fafc",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={`${mappings.filter((m) => m.sourceId && m.targetId).length} complete`}
              size="small"
              color="success"
              variant="outlined"
            />
            <Chip
              label={`${mappings.filter((m) => !m.sourceId || !m.targetId).length} incomplete`}
              size="small"
              color="warning"
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!mappings.some((m) => m.sourceId && m.targetId)}
              sx={{
                bgcolor: "#6366f1",
                "&:hover": { bgcolor: "#4f46e5" },
              }}
            >
              Save Mappings
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}