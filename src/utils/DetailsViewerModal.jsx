// components/DetailsViewerModal.jsx
import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Chip,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

// Modal styles
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  minWidth: 400,
  maxWidth: 700,
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
  type = "info", // 'success' | 'error' | 'warning' | 'info'
  message,
  showCopyButton = true,
}) => {
  const config = alertConfig[type] || alertConfig.info;
  const Icon = config.icon;

  // Format data for display
  const formatData = (data) => {
    if (data === null || data === undefined) {
      return "null";
    }
    if (typeof data === "object") {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  // Copy to clipboard
  const handleCopy = () => {
    const textToCopy = formatData(data);
    navigator.clipboard.writeText(textToCopy);
    alert("Copied to clipboard!");
  };

  // Render value based on type
  const renderValue = (value, key = null) => {
    if (value === null || value === undefined) {
      return <Chip label="null" size="small" sx={{ bgcolor: "#f3f4f6" }} />;
    }

    if (typeof value === "boolean") {
      return (
        <Chip
          label={value ? "true" : "false"}
          size="small"
          color={value ? "success" : "error"}
          variant="outlined"
        />
      );
    }

    if (typeof value === "number") {
      return (
        <Typography
          component="span"
          sx={{ color: "#0891b2", fontFamily: "monospace" }}
        >
          {value}
        </Typography>
      );
    }

    if (typeof value === "string") {
      // Check if it's a URL
      if (value.startsWith("http://") || value.startsWith("https://")) {
        return (
          <Typography
            component="a"
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "#3b82f6", textDecoration: "underline", wordBreak: "break-all" }}
          >
            {value}
          </Typography>
        );
      }
      return (
        <Typography
          component="span"
          sx={{ color: "#16a34a", fontFamily: "monospace", wordBreak: "break-all" }}
        >
          "{value}"
        </Typography>
      );
    }

    if (Array.isArray(value)) {
      return (
        <Box sx={{ pl: 2, borderLeft: "2px solid #e5e7eb" }}>
          {value.map((item, index) => (
            <Box key={index} sx={{ py: 0.5 }}>
              <Typography
                component="span"
                sx={{ color: "#6b7280", fontSize: "0.75rem", mr: 1 }}
              >
                [{index}]
              </Typography>
              {renderValue(item)}
            </Box>
          ))}
        </Box>
      );
    }

    if (typeof value === "object") {
      return (
        <Box sx={{ pl: 2, borderLeft: "2px solid #e5e7eb" }}>
          {Object.entries(value).map(([k, v]) => (
            <Box key={k} sx={{ py: 0.5 }}>
              <Typography
                component="span"
                sx={{ color: "#7c3aed", fontWeight: 500, mr: 1 }}
              >
                {k}:
              </Typography>
              {renderValue(v, k)}
            </Box>
          ))}
        </Box>
      );
    }

    return String(value);
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

        {/* Message (optional) */}
        {message && (
          <Box sx={{ px: 3, py: 2, bgcolor: "#f9fafb" }}>
            <Typography variant="body1" color="text.secondary">
              {message}
            </Typography>
          </Box>
        )}

        {/* Content */}
        <Box sx={{ p: 3, maxHeight: "50vh", overflowY: "auto" }}>
          {data !== undefined && data !== null ? (
            typeof data === "object" ? (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: "#f9fafb",
                  maxHeight: "40vh",
                  overflowY: "auto",
                }}
              >
                {Object.entries(data).map(([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      py: 1,
                      borderBottom: "1px solid #e5e7eb",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: "#7c3aed",
                        fontWeight: 600,
                        mr: 1,
                        fontSize: "0.9rem",
                      }}
                    >
                      {key}:
                    </Typography>
                    {renderValue(value, key)}
                  </Box>
                ))}
              </Paper>
            ) : (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f9fafb" }}>
                <Typography sx={{ fontFamily: "monospace" }}>
                  {String(data)}
                </Typography>
              </Paper>
            )
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
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
              size="small"
            >
              Copy JSON
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

export default DetailsViewerModal;