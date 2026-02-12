import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  FileDownload as DownloadIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Description as YamlIcon,
  Visibility as ViewIcon,
  Code as JsonIcon,
} from "@mui/icons-material";
import useWorkflowStore from "../store/workflowStore";
import { workflowToYAML, downloadYAML } from "../utils/yamlExporter";
import DetailsViewerModal from "../utils/DetailsViewerModal";

export default function ExportButton() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info");

  const workflow = { nodes, edges };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportYAML = () => {
    try {
      const yamlContent = workflowToYAML(workflow);
      downloadYAML(yamlContent);
      handleClose();
    } catch (error) {
      alert("Failed to export YAML: " + error.message);
    }
  };

  const handleShowYAML = () => {
    try {
      const yamlContent = workflowToYAML(workflow);
      setModalTitle("Workflow YAML");
      setModalData(yamlContent);
      setModalType("info");
      setModalOpen(true);
      handleClose();
    } catch (error) {
      alert("Failed to generate YAML: " + error.message);
    }
  };

  const handleShowJSON = () => {
    try {
      setModalTitle("Workflow JSON");
      setModalData(workflow);
      setModalType("info");
      setModalOpen(true);
      handleClose();
    } catch (error) {
      alert("Failed to generate JSON: " + error.message);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        endIcon={<ArrowDownIcon />}
        onClick={handleClick}
        sx={{
          backgroundColor: "#4caf50",
          color: "#fff",
          textTransform: "none",
          fontWeight: 500,
          px: 2,
          "&:hover": {
            backgroundColor: "#43a047",
          },
        }}
      >
        Export Workflow
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: "1px solid #e0e0e0",
          },
        }}
      >
        {/* Download Options */}
        <MenuItem onClick={handleExportYAML}>
          <ListItemIcon>
            <YamlIcon fontSize="small" sx={{ color: "#1976d2" }} />
          </ListItemIcon>
          <ListItemText 
            primary="Download as YAML" 
            primaryTypographyProps={{ fontSize: 14 }}
          />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        {/* View Options */}
        <MenuItem onClick={handleShowYAML}>
          <ListItemIcon>
            <ViewIcon fontSize="small" sx={{ color: "#666" }} />
          </ListItemIcon>
          <ListItemText 
            primary="View YAML" 
            primaryTypographyProps={{ fontSize: 14 }}
          />
        </MenuItem>

        <MenuItem onClick={handleShowJSON}>
          <ListItemIcon>
            <JsonIcon fontSize="small" sx={{ color: "#666" }} />
          </ListItemIcon>
          <ListItemText 
            primary="View JSON" 
            primaryTypographyProps={{ fontSize: 14 }}
          />
        </MenuItem>
      </Menu>

      {/* Modal */}
      <DetailsViewerModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        data={modalData}
        type={modalType}
        message="Preview of your workflow configuration"
      />
    </>
  );
}