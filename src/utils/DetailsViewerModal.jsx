// utils/DetailsViewerModal.jsx
import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Chip,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CheckIcon from "@mui/icons-material/Check";

// Modal styles
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  minWidth: 500,
  maxWidth: 800,
  maxHeight: "85vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  outline: "none",
  overflow: "hidden",
};

// Alert type configurations
const alertConfig = {
  success: {
    icon: CheckCircleIcon,
    color: "#22c55e",
    bgColor: "#f0fdf4",
    borderColor: "#86efac",
  },
  error: {
    icon: ErrorIcon,
    color: "#ef4444",
    bgColor: "#fef2f2",
    borderColor: "#fca5a5",
  },
  warning: {
    icon: WarningIcon,
    color: "#f59e0b",
    bgColor: "#fffbeb",
    borderColor: "#fcd34d",
  },
  info: {
    icon: InfoIcon,
    color: "#3b82f6",
    bgColor: "#eff6ff",
    borderColor: "#93c5fd",
  },
};

const DetailsViewerModal = ({
  open,
  onClose,
  title = "Details",
  data,
  type = "info",
  message,
  showCopyButton = true,
  format = "auto", // 'auto' | 'json' | 'yaml' | 'text'
}) => {
  const [copied, setCopied] = useState(false);
  const config = alertConfig[type] || alertConfig.info;
  const Icon = config.icon;

  // Detect format
  const detectFormat = (data) => {
    if (format !== "auto") return format;
    if (typeof data === "string") {
      // Check if it looks like YAML (has colons and newlines but not JSON braces at start)
      if (
        data.includes(":\n") ||
        data.includes(": ") ||
        (data.includes("\n") && !data.trim().startsWith("{"))
      ) {
        return "yaml";
      }
      // Check if it's JSON string
      try {
        JSON.parse(data);
        return "json";
      } catch {
        return "text";
      }
    }
    return "json";
  };

  const detectedFormat = detectFormat(data);

  // Format data for display
  const getDisplayContent = () => {
    if (data === null || data === undefined) {
      return "null";
    }

    if (typeof data === "string") {
      return data;
    }

    if (typeof data === "object") {
      return JSON.stringify(data, null, 2);
    }

    return String(data);
  };

  // Copy to clipboard
  const handleCopy = async () => {
    const textToCopy = getDisplayContent();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Render content based on format
  const renderContent = () => {
    const content = getDisplayContent();

    // For YAML or plain text - render as preformatted text
    if (detectedFormat === "yaml" || detectedFormat === "text") {
      return (
        <Paper
          variant="outlined"
          sx={{
            p: 0,
            bgcolor: "#1e293b",
            maxHeight: "50vh",
            overflow: "auto",
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1,
              bgcolor: "#334155",
              borderBottom: "1px solid #475569",
            }}
          >
            <Chip
              label={detectedFormat.toUpperCase()}
              size="small"
              sx={{
                bgcolor: "#3b82f6",
                color: "white",
                fontSize: "0.7rem",
                height: 20,
              }}
            />
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              {content.split("\n").length} lines
            </Typography>
          </Box>
          <pre
            style={{
              margin: 0,
              padding: "16px",
              fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              color: "#e2e8f0",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflow: "auto",
            }}
          >
            {content}
          </pre>
        </Paper>
      );
    }

    // For JSON objects - render with syntax highlighting
    if (detectedFormat === "json" && typeof data === "object") {
      return (
        <Paper
          variant="outlined"
          sx={{
            p: 0,
            bgcolor: "#1e293b",
            maxHeight: "50vh",
            overflow: "auto",
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1,
              bgcolor: "#334155",
              borderBottom: "1px solid #475569",
            }}
          >
            <Chip
              label="JSON"
              size="small"
              sx={{
                bgcolor: "#22c55e",
                color: "white",
                fontSize: "0.7rem",
                height: 20,
              }}
            />
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              {typeof data === "object" ? Object.keys(data).length : 0} keys
            </Typography>
          </Box>
          <pre
            style={{
              margin: 0,
              padding: "16px",
              fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              color: "#e2e8f0",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            <JsonSyntaxHighlight content={content} />
          </pre>
        </Paper>
      );
    }

    // Default text rendering
    return (
      <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f9fafb" }}>
        <Typography sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
          {content}
        </Typography>
      </Paper>
    );
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="details-modal-title">
      <Box sx={modalStyle}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 3,
            py: 2,
            bgcolor: config.bgColor,
            borderBottom: `2px solid ${config.borderColor}`,
          }}
        >
          <Icon sx={{ color: config.color, fontSize: 28 }} />
          <Typography
            id="details-modal-title"
            variant="h6"
            sx={{ flex: 1, fontWeight: 600, color: config.color }}
          >
            {title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Message */}
        {message && (
          <Box sx={{ px: 3, py: 2, bgcolor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <Typography variant="body2" color="text.secondary">
              {message}
            </Typography>
          </Box>
        )}

        {/* Content */}
        <Box sx={{ p: 3, maxHeight: "55vh", overflowY: "auto" }}>
          {data !== undefined && data !== null ? (
            renderContent()
          ) : (
            <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
              No data to display
            </Typography>
          )}
        </Box>

        {/* Footer */}
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            px: 3,
            py: 2,
            bgcolor: "#f9fafb",
          }}
        >
          {showCopyButton && data && (
            <Button
              variant="outlined"
              startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
              onClick={handleCopy}
              size="small"
              color={copied ? "success" : "primary"}
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={onClose}
            size="small"
            sx={{
              bgcolor: config.color,
              "&:hover": { bgcolor: config.color, filter: "brightness(0.9)" },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// Simple JSON Syntax Highlighting Component
const JsonSyntaxHighlight = ({ content }) => {
  const highlightJson = (json) => {
    // Replace JSON elements with colored spans
    return json
      .replace(/"([^"]+)":/g, '<span style="color: #7dd3fc;">"$1"</span>:') // keys
      .replace(/: "([^"]+)"/g, ': <span style="color: #86efac;">"$1"</span>') // string values
      .replace(/: (\d+)/g, ': <span style="color: #fcd34d;">$1</span>') // numbers
      .replace(/: (true|false)/g, ': <span style="color: #f472b6;">$1</span>') // booleans
      .replace(/: (null)/g, ': <span style="color: #fb923c;">$1</span>'); // null
  };

  return (
    <span
      dangerouslySetInnerHTML={{ __html: highlightJson(content) }}
    />
  );
};

export default DetailsViewerModal;