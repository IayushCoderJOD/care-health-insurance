import React, { useState, useCallback } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { generateSampleTargetsFromCopybook, COMBSTSI_SAMPLE } from "./copybookParser";

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
  overflow: "scroll",
};

// Helper function to flatten tree and filter items
const flattenTree = (items, searchTerm = "") => {
  const result = [];
  const traverse = (nodes, depth = 0) => {
    nodes.forEach((node) => {
      const matchesSearch =
        searchTerm === "" ||
        node.name.toLowerCase().includes(searchTerm.toLowerCase());

      if (matchesSearch) {
        result.push({ ...node, depth });
      }

      if (node.children) {
        traverse(node.children, depth + 1);
      }
    });
  };
  traverse(items);
  return result;
};

// Tree Node Component
const TreeNode = ({
  node,
  depth = 0,
  expandedSet,
  onToggleExpand,
  onDragStart,
  onDragEnd,
  dragOverId,
  onDragOver,
  onDragLeave,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedSet?.has(node.id);
  const isDragOver = dragOverId === node.id;
  const isCategory = node.type === "category";
  const isTask = node.type === "task";

  const getNodeColor = () => {
    if (isCategory) return { bg: "#f0f4ff", border: "#c7d2fe", text: "#3730a3" };
    if (isTask) return { bg: "#f5f3ff", border: "#ddd6fe", text: "#581c87" };
    return { bg: "#f8f8f8", border: "#e5e7eb", text: "#6b7280" };
  };

  const getNodeIcon = () => {
    if (isCategory) return "📁";
    if (isTask) return "✓";
    return "◆";
  };

  const colors = getNodeColor();

  const handleDragStart = (e) => {
    e.stopPropagation();
    onDragStart(e, node);
  };

  const handleDragEnd = (e) => {
    e.stopPropagation();
    onDragEnd();
  };

  const handleDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDragOver(e, node.id);
  };

  const handleDragLeave = (e) => {
    e.stopPropagation();
    onDragLeave();
  };

  return (
    <Box>
      <Paper
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        elevation={0}
        sx={{
          p: 1,
          mb: 0.5,
          ml: `${depth * 16}px`,
          cursor: "grab",
          border: `1.5px solid ${isDragOver ? "#6366f1" : colors.border}`,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          bgcolor: isDragOver ? "#e0e7ff" : colors.bg,
          transition: "all 0.2s",
          "&:hover": {
            borderColor: "#6366f1",
            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.1)",
          },
          "&:active": {
            cursor: "grabbing",
          },
        }}
      >
        {hasChildren && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            sx={{
              p: 0.25,
              minWidth: 24,
              minHeight: 24,
              color: colors.text,
              "&:hover": { bgcolor: "rgba(99, 102, 241, 0.05)" },
            }}
          >
            {isExpanded ? (
              <ExpandMoreIcon fontSize="small" />
            ) : (
              <ChevronRightIcon fontSize="small" />
            )}
          </IconButton>
        )}
        {!hasChildren && <Box sx={{ width: 24 }} />}

        <span style={{ fontSize: "0.9rem", marginRight: 4 }}>
          {getNodeIcon()}
        </span>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={isCategory || isTask ? 600 : 500}
            noWrap
            sx={{
              fontSize: "0.8rem",
              color: colors.text,
            }}
          >
            {node.name}
          </Typography>
        </Box>

        {node.type !== "category" && (
          <Chip
            label={node.type}
            size="small"
            sx={{
              height: 18,
              fontSize: "0.65rem",
              bgcolor: colors.border,
              color: colors.text,
            }}
          />
        )}

        <DragIndicatorIcon
          fontSize="small"
          sx={{ color: "#9ca3af", flexShrink: 0 }}
        />
      </Paper>

      {hasChildren && isExpanded && (
        <Box>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedSet={expandedSet}
              onToggleExpand={onToggleExpand}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              dragOverId={dragOverId}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

const SAMPLE_SOURCES = [
  {
    id: "ui-1",
    name: "PolicyRequest",
    type: "object",
    children: [
      { id: "ui-1-1", name: "policyNumber", type: "string" },
      { id: "ui-1-2", name: "customerName", type: "string" },
      { id: "ui-1-3", name: "customerAge", type: "number" },
      { id: "ui-1-4", name: "premiumAmount", type: "decimal" },
      {
        id: "ui-1-5",
        name: "address",
        type: "object",
        children: [
          { id: "ui-1-5-1", name: "city", type: "string" },
          { id: "ui-1-5-2", name: "state", type: "string" },
          { id: "ui-1-5-3", name: "pincode", type: "number" },
          {
            id: "ui-1-5-4",
            name: "coordinates",
            type: "object",
            children: [
              { id: "ui-1-5-4-1", name: "latitude", type: "decimal" },
              { id: "ui-1-5-4-2", name: "longitude", type: "decimal" },
              {
                id: "ui-1-5-4-3",
                name: "metadata",
                type: "object",
                children: [
                  { id: "ui-1-5-4-3-1", name: "accuracy", type: "number" },
                  { id: "ui-1-5-4-3-2", name: "timestamp", type: "date" },
                  { id: "ui-1-5-4-3-3", name: "source", type: "string" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ui-1-6",
        name: "coverage",
        type: "object",
        children: [
          { id: "ui-1-6-1", name: "type", type: "string" },
          { id: "ui-1-6-2", name: "amount", type: "decimal" },
          {
            id: "ui-1-6-3",
            name: "details",
            type: "object",
            children: [
              { id: "ui-1-6-3-1", name: "deductible", type: "decimal" },
              { id: "ui-1-6-3-2", name: "coinsurance", type: "decimal" },
              {
                id: "ui-1-6-3-3",
                name: "exclusions",
                type: "object",
                children: [
                  { id: "ui-1-6-3-3-1", name: "preExisting", type: "boolean" },
                  { id: "ui-1-6-3-3-2", name: "waitingPeriod", type: "number" },
                  { id: "ui-1-6-3-3-3", name: "conditions", type: "string" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "ui-2",
    name: "CustomerRegistration",
    type: "object",
    children: [
      { id: "ui-2-1", name: "customerId", type: "string" },
      { id: "ui-2-2", name: "firstName", type: "string" },
      { id: "ui-2-3", name: "lastName", type: "string" },
      { id: "ui-2-4", name: "email", type: "string" },
      { id: "ui-2-5", name: "mobileNumber", type: "string" },
      {
        id: "ui-2-6",
        name: "profile",
        type: "object",
        children: [
          { id: "ui-2-6-1", name: "dob", type: "date" },
          { id: "ui-2-6-2", name: "gender", type: "string" },
          {
            id: "ui-2-6-3",
            name: "identity",
            type: "object",
            children: [
              { id: "ui-2-6-3-1", name: "type", type: "string" },
              { id: "ui-2-6-3-2", name: "number", type: "string" },
              { id: "ui-2-6-3-3", name: "expiryDate", type: "date" },
              {
                id: "ui-2-6-3-4",
                name: "verification",
                type: "object",
                children: [
                  { id: "ui-2-6-3-4-1", name: "status", type: "string" },
                  { id: "ui-2-6-3-4-2", name: "verifiedDate", type: "date" },
                  { id: "ui-2-6-3-4-3", name: "verifiedBy", type: "string" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ui-2-7",
        name: "contact",
        type: "object",
        children: [
          { id: "ui-2-7-1", name: "primary", type: "string" },
          { id: "ui-2-7-2", name: "secondary", type: "string" },
          {
            id: "ui-2-7-3",
            name: "addresses",
            type: "object",
            children: [
              {
                id: "ui-2-7-3-1",
                name: "home",
                type: "object",
                children: [
                  { id: "ui-2-7-3-1-1", name: "street", type: "string" },
                  { id: "ui-2-7-3-1-2", name: "city", type: "string" },
                  { id: "ui-2-7-3-1-3", name: "state", type: "string" },
                ],
              },
              {
                id: "ui-2-7-3-2",
                name: "office",
                type: "object",
                children: [
                  { id: "ui-2-7-3-2-1", name: "street", type: "string" },
                  { id: "ui-2-7-3-2-2", name: "city", type: "string" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "ui-3",
    name: "ClaimRequest",
    type: "object",
    children: [
      { id: "ui-3-1", name: "claimId", type: "string" },
      { id: "ui-3-2", name: "policyNumber", type: "string" },
      {
        id: "ui-3-3",
        name: "incident",
        type: "object",
        children: [
          { id: "ui-3-3-1", name: "date", type: "date" },
          { id: "ui-3-3-2", name: "type", type: "string" },
          {
            id: "ui-3-3-3",
            name: "location",
            type: "object",
            children: [
              { id: "ui-3-3-3-1", name: "address", type: "string" },
              { id: "ui-3-3-3-2", name: "city", type: "string" },
              {
                id: "ui-3-3-3-3",
                name: "hospital",
                type: "object",
                children: [
                  { id: "ui-3-3-3-3-1", name: "name", type: "string" },
                  { id: "ui-3-3-3-3-2", name: "registrationNo", type: "string" },
                  {
                    id: "ui-3-3-3-3-3",
                    name: "details",
                    type: "object",
                    children: [
                      { id: "ui-3-3-3-3-3-1", name: "department", type: "string" },
                      { id: "ui-3-3-3-3-3-2", name: "ward", type: "string" },
                      { id: "ui-3-3-3-3-3-3", name: "bedNumber", type: "string" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ui-3-4",
        name: "claimAmount",
        type: "object",
        children: [
          { id: "ui-3-4-1", name: "claimed", type: "decimal" },
          { id: "ui-3-4-2", name: "approved", type: "decimal" },
          {
            id: "ui-3-4-3",
            name: "breakdown",
            type: "object",
            children: [
              {
                id: "ui-3-4-3-1",
                name: "medical",
                type: "object",
                children: [
                  { id: "ui-3-4-3-1-1", name: "consultation", type: "decimal" },
                  { id: "ui-3-4-3-1-2", name: "procedures", type: "decimal" },
                  { id: "ui-3-4-3-1-3", name: "medications", type: "decimal" },
                ],
              },
              {
                id: "ui-3-4-3-2",
                name: "noncovered",
                type: "object",
                children: [
                  { id: "ui-3-4-3-2-1", name: "reason", type: "string" },
                  { id: "ui-3-4-3-2-2", name: "amount", type: "decimal" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "ui-4",
    name: "PaymentRequest",
    type: "object",
    children: [
      { id: "ui-4-1", name: "paymentId", type: "string" },
      { id: "ui-4-2", name: "policyNumber", type: "string" },
      {
        id: "ui-4-3",
        name: "transaction",
        type: "object",
        children: [
          { id: "ui-4-3-1", name: "date", type: "date" },
          { id: "ui-4-3-2", name: "amount", type: "decimal" },
          {
            id: "ui-4-3-3",
            name: "details",
            type: "object",
            children: [
              { id: "ui-4-3-3-1", name: "mode", type: "string" },
              { id: "ui-4-3-3-2", name: "reference", type: "string" },
              {
                id: "ui-4-3-3-3",
                name: "bankInfo",
                type: "object",
                children: [
                  { id: "ui-4-3-3-3-1", name: "bankName", type: "string" },
                  { id: "ui-4-3-3-3-2", name: "accountNumber", type: "string" },
                  { id: "ui-4-3-3-3-3", name: "ifsc", type: "string" },
                  {
                    id: "ui-4-3-3-3-4",
                    name: "confirmation",
                    type: "object",
                    children: [
                      { id: "ui-4-3-3-3-4-1", name: "utrnumber", type: "string" },
                      { id: "ui-4-3-3-3-4-2", name: "confirmationDate", type: "date" },
                      { id: "ui-4-3-3-3-4-3", name: "status", type: "string" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

// Generate SAMPLE_TARGETS from COBOL copybook XML
const SAMPLE_TARGETS = generateSampleTargetsFromCopybook(COMBSTSI_SAMPLE);

// Sample Response Object similar to SAMPLE_SOURCES
const SAMPLE_RESPONSES = [
  {
    id: "resp-1",
    name: "PolicyResponse",
    type: "object",
    children: [
      { id: "resp-1-1", name: "policyId", type: "string" },
      { id: "resp-1-2", name: "status", type: "string" },
      { id: "resp-1-3", name: "effectiveDate", type: "date" },
      {
        id: "resp-1-4",
        name: "coverage",
        type: "object",
        children: [
          { id: "resp-1-4-1", name: "type", type: "string" },
          { id: "resp-1-4-2", name: "limitAmount", type: "decimal" },
          { id: "resp-1-4-3", name: "premium", type: "decimal" },
        ],
      },
    ],
  },
  {
    id: "resp-2",
    name: "ClaimResponse",
    type: "object",
    children: [
      { id: "resp-2-1", name: "claimId", type: "string" },
      { id: "resp-2-2", name: "approvalStatus", type: "string" },
      {
        id: "resp-2-3",
        name: "settlement",
        type: "object",
        children: [
          { id: "resp-2-3-1", name: "approvedAmount", type: "decimal" },
          { id: "resp-2-3-2", name: "settlementDate", type: "date" },
          { id: "resp-2-3-3", name: "paymentMode", type: "string" },
        ],
      },
    ],
  },
];

export default function TagMappingModal({ data, open, onClose, onSave }) {
  const [mappings, setMappings] = useState([
    { id: "map-1", sourceId: "", targetId: "" },
  ]);


  const [sourceSearch, setSourceSearch] = useState("");
  const [targetSearch, setTargetSearch] = useState("");
  const [mappingType, setMappingType] = useState("request"); // "request" or "response"

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  // Expand/collapse state for tree nodes
  const [expandedSourceNodes, setExpandedSourceNodes] = useState(
    new Set([
      "ui-1", "ui-1-5", "ui-1-5-4", "ui-1-5-4-3", "ui-1-6", "ui-1-6-3", "ui-1-6-3-3",
      "ui-2", "ui-2-6", "ui-2-6-3", "ui-2-6-3-4", "ui-2-7", "ui-2-7-3", "ui-2-7-3-1", "ui-2-7-3-2",
      "ui-3", "ui-3-3", "ui-3-3-3", "ui-3-3-3-3", "ui-3-3-3-3-3", "ui-3-4", "ui-3-4-3", "ui-3-4-3-1", "ui-3-4-3-2",
      "ui-4", "ui-4-3", "ui-4-3-3", "ui-4-3-3-3", "ui-4-3-3-3-4"
    ])
  );
  const [expandedTargetNodes, setExpandedTargetNodes] = useState(
    new Set([
      "cb-1", "cb-1-1", "cb-1-2", "cb-1-2-1"
    ])
  );

  // Dynamically set source and target based on mapping type
  const getSourceData = () => {
    return mappingType === "request" ? SAMPLE_SOURCES : SAMPLE_TARGETS;
  };

  const getTargetData = () => {
    return mappingType === "request" ? SAMPLE_TARGETS : SAMPLE_RESPONSES;
  };

  const flattenedSources = flattenTree(getSourceData(), sourceSearch);
  const flattenedTargets = flattenTree(getTargetData(), targetSearch);

  const toggleSourceNodeExpand = useCallback((nodeId) => {
    setExpandedSourceNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const toggleTargetNodeExpand = useCallback((nodeId) => {
    setExpandedTargetNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

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
    // Set data to make drag-and-drop more reliable across browsers
    e.dataTransfer.setData("application/json", JSON.stringify({ ...item, type }));
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverId(null);
  };

  const handleDragOver = (e, nodeId = null) => {
    e.preventDefault();
    if (nodeId) setDragOverId(nodeId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
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
    setDragOverId(null);
  };

  const handleSave = () => {
    const validMappings = mappings.filter((m) => m.sourceId && m.targetId);
    
    // Transform to JSON structure
    const mappingJson = transformMappingsToJson(validMappings);
    
    console.log("Mapping JSON:", mappingJson);
    
    onSave?.(mappingJson);
    onClose();
  };

  const getMappingStatus = (mapping) => {
    if (mapping.sourceId && mapping.targetId) return "complete";
    if (mapping.sourceId || mapping.targetId) return "partial";
    return "empty";
  };

  const getItemName = (id) => {
    const findName = (items) => {
      for (let item of items) {
        if (item.id === id) return item.name;
        if (item.children) {
          const found = findName(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    return (
      findName(getSourceData()) || 
      findName(getTargetData()) || 
      findName(SAMPLE_SOURCES) || 
      findName(SAMPLE_TARGETS) || 
      findName(SAMPLE_RESPONSES)
    );
  };

  // Transform mappings into the JSON structure for backend
  const transformMappingsToJson = (mappingsData) => {
    const mappingData = {};
    
    mappingsData.forEach((mapping) => {
      const sourceName = getItemName(mapping.sourceId);
      const targetName = getItemName(mapping.targetId);
      
      if (sourceName && targetName) {
        mappingData[sourceName] = targetName;
      }
    });

    const mapKey = mappingType === "request" ? "requestMap" : "responseMap";

    return {
      metaData: {
        copyBook: "",
        mapType: mappingType,
        bpmName: "",
        serviceName: data?.summary,
      },
      [mapKey]: mappingData,
    };
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
                Map Tags & Labels
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Create mappings between nested tag hierarchies
              </Typography>
            </Box>
          </Box>

          {/* Mapping Type Selector */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={mappingType}
              onChange={(e) => {
                setMappingType(e.target.value);
                setMappings([{ id: "map-1", sourceId: "", targetId: "" }]);
              }}
              sx={{
                bgcolor: "white",
                "& .MuiOutlinedInput-root": {
                  borderColor: "#cbd5e1",
                },
              }}
            >
              <MenuItem value="request">Request Mapping</MenuItem>
              <MenuItem value="response">Response Mapping</MenuItem>
            </Select>
          </FormControl>

          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: "flex", height: "calc(90vh - 180px)", minHeight: 400 }}>
          {/* Left Panel - Source Tags (Tree) */}
          <Box
            sx={{
              width: 280,
              borderRight: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              bgcolor: "#fafbfc",
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                📁 {mappingType === "request" ? "Frontend Tags" : "Copybook Tags"}
              </Typography>
              <TextField
                size="small"
                placeholder="Search tags..."
                value={sourceSearch}
                onChange={(e) => setSourceSearch(e.target.value)}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: "#9ca3af" }} />
                      </InputAdornment>
                    ),
                    sx: { fontSize: "0.85rem" },
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: 1, overflow: "auto", p: 1.5 }}>
              {getSourceData().map((source) => (
                <TreeNode
                  key={source.id}
                  node={source}
                  depth={0}
                  expandedSet={expandedSourceNodes}
                  onToggleExpand={toggleSourceNodeExpand}
                  onDragStart={(e, item) => handleDragStart(e, item, "source")}
                  onDragEnd={handleDragEnd}
                  dragOverId={dragOverId}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />
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
                {mappingType === "request" ? "SELECT FRONTEND TAG" : "SELECT COPYBOOK TAG"}
              </Typography>
              <Box sx={{ width: 60, textAlign: "center" }}>
                <SyncAltIcon fontSize="small" sx={{ color: "#94a3b8" }} />
              </Box>
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ flex: 1, color: "#64748b", textAlign: "right" }}
              >
                {mappingType === "request" ? "SELECT COPYBOOK TAG" : "SELECT RESPONSE TAG"}
              </Typography>
            </Box>

            {/* Mapping Rows */}
            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              {mappings.map((mapping) => {
                const status = getMappingStatus(mapping);
                const sourceName = getItemName(mapping.sourceId);
                const targetName = getItemName(mapping.targetId);

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
                    {/* Source Display / Selector */}
                    <Box
                      sx={{ flex: 1 }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDragOver(e, mapping.id);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDragLeave();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDrop(e, mapping.id, "source");
                      }}
                    >
                      {mapping.sourceId ? (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            bgcolor: "#f5f3ff",
                            border: "1px solid #ddd6fe",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{ fontSize: "0.85rem" }}
                            >
                              {sourceName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: "0.7rem" }}
                            >
                              ID: {mapping.sourceId}
                            </Typography>
                          </Box>
                          <Tooltip title="Click to edit">
                            <Button
                              size="small"
                              onClick={() =>
                                handleMappingChange(mapping.id, "sourceId", "")
                              }
                              sx={{ color: "#6366f1" }}
                            >
                              Change
                            </Button>
                          </Tooltip>
                        </Paper>
                      ) : (
                        <Box
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDrop(e, mapping.id, "source");
                          }}
                        >
                          <FormControl fullWidth size="small">
                            <Select
                              value={mapping.sourceId}
                              onChange={(e) =>
                                handleMappingChange(
                                  mapping.id,
                                  "sourceId",
                                  e.target.value
                                )
                              }
                              displayEmpty
                              sx={{
                                bgcolor: "white",
                              }}
                            >
                              <MenuItem value="" disabled>
                                <Typography
                                  color="text.secondary"
                                  fontSize="0.875rem"
                                >
                                  Select a tag or drag it here
                                </Typography>
                              </MenuItem>
                              {flattenedSources.map((source) => (
                                <MenuItem key={source.id} value={source.id}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Box
                                      sx={{ ml: `${source.depth * 12}px` }}
                                    />
                                    {source.name}
                                    {source.type !== "category" && (
                                      <Chip
                                        label={source.type}
                                        size="small"
                                        sx={{
                                          height: 18,
                                          fontSize: "0.65rem",
                                          ml: 1,
                                        }}
                                      />
                                    )}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
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

                    {/* Target Display / Selector */}
                    <Box
                      sx={{ flex: 1 }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDragOver(e, mapping.id);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDragLeave();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDrop(e, mapping.id, "target");
                      }}
                    >
                      {mapping.targetId ? (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            bgcolor: "#dcfce7",
                            border: "1px solid #bbf7d0",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{ fontSize: "0.85rem" }}
                            >
                              {targetName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: "0.7rem" }}
                            >
                              ID: {mapping.targetId}
                            </Typography>
                          </Box>
                          <Tooltip title="Click to edit">
                            <Button
                              size="small"
                              onClick={() =>
                                handleMappingChange(mapping.id, "targetId", "")
                              }
                              sx={{ color: "#22c55e" }}
                            >
                              Change
                            </Button>
                          </Tooltip>
                        </Paper>
                      ) : (
                        <Box
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDrop(e, mapping.id, "target");
                          }}
                        >
                          <FormControl fullWidth size="small">
                            <Select
                              value={mapping.targetId}
                              onChange={(e) =>
                                handleMappingChange(
                                  mapping.id,
                                  "targetId",
                                  e.target.value
                                )
                              }
                              displayEmpty
                              sx={{
                                bgcolor: "white",
                              }}
                            >
                              <MenuItem value="" disabled>
                                <Typography
                                  color="text.secondary"
                                  fontSize="0.875rem"
                                >
                                  Select a label or drag it here
                                </Typography>
                              </MenuItem>
                              {flattenedTargets.map((target) => (
                                <MenuItem key={target.id} value={target.id}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Box
                                      sx={{ ml: `${target.depth * 12}px` }}
                                    />
                                    {target.name}
                                    {target.type !== "category" && (
                                      <Chip
                                        label={target.type}
                                        size="small"
                                        sx={{
                                          height: 18,
                                          fontSize: "0.65rem",
                                          ml: 1,
                                        }}
                                      />
                                    )}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
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

          {/* Right Panel - Target Labels (Tree) */}
          <Box
            sx={{
              width: 280,
              borderLeft: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              bgcolor: "#fafbfc",
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                🏷️ {mappingType === "request" ? "Copybook Tags" : "Response Tags"}
              </Typography>
              <TextField
                size="small"
                placeholder="Search labels..."
                value={targetSearch}
                onChange={(e) => setTargetSearch(e.target.value)}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: "#9ca3af" }} />
                      </InputAdornment>
                    ),
                    sx: { fontSize: "0.85rem" },
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: 1, overflow: "auto", p: 1.5 }}>
              {getTargetData().map((target) => (
                <TreeNode
                  key={target.id}
                  node={target}
                  depth={0}
                  expandedSet={expandedTargetNodes}
                  onToggleExpand={toggleTargetNodeExpand}
                  onDragStart={(e, item) => handleDragStart(e, item, "target")}
                  onDragEnd={handleDragEnd}
                  dragOverId={dragOverId}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />
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