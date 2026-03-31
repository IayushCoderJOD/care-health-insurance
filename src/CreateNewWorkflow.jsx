import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Paper,
  TextField,
  Chip,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AccountTree as WorkflowIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "./theme/theme";

import ApiListPanel from "./components/ApiListPanel";
import WorkflowCanvas from "./components/WorkflowCanvas";
import ExportButton from "./components/ExportButton";
import ExecuteButton from "./components/ExecuteButton";
import useWorkflowStore from "./store/workflowStore";
import sampleApi from "./constants/sampleApi.json";
import { extractEndpoints } from "./utils/openApiParser";
import TagMappingModal from "./utils/TagMappingModal";
import {  Target } from "./constants/constants";

const CreateNewWorkflow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const endpoints = useWorkflowStore((state) => state.endpoints);
  const selectedNode = useWorkflowStore((state) => state.selectedNodeId);
  const isEditMode = useWorkflowStore((state) => state.isEditMode);
  const workflowName = useWorkflowStore((state) => state.workflowName);
  const workflowId = useWorkflowStore((state) => state.workflowId);
  const loadWorkflow = useWorkflowStore((state) => state.loadWorkflow);
  const resetWorkflow = useWorkflowStore((state) => state.resetWorkflow);
  const saveWorkflow = useWorkflowStore((state) => state.saveWorkflow);

  console.log("Workflow Name:", loadWorkflow);

  const [toggleMenu, setToggleMenu] = useState(true);
  
  // Load API spec once
  useEffect(() => {
    // Load sample API spec into store
    try {
      const extracted = extractEndpoints(sampleApi);
      useWorkflowStore.setState({
        openApiSpec: sampleApi,
        endpoints: extracted,
      });
    } catch (err) {
      console.error("Failed to load sample API:", err);
    }
  }, []);

  useEffect(() => {
    if (editId) {
      const loaded = loadWorkflow(editId);
      if (!loaded) {
        console.warn(`Workflow ${editId} not found`);
      }
    } else {
      resetWorkflow();
    }
  }, [editId, loadWorkflow, resetWorkflow]);

  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleSave = useCallback(() => {
    const saved = saveWorkflow();
    console.log("Workflow saved:", saved);
    alert("Workflow saved successfully!");
  }, [saveWorkflow]);

  const handleToggleMenu = useCallback(() => {
    setToggleMenu((prev) => !prev);
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* App Bar */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#1976d2",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Left Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton color="inherit" onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>

              <IconButton
                color="inherit"
                onClick={handleToggleMenu}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                {toggleMenu ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>

              <WorkflowIcon sx={{ ml: 1 }} />

              {/* Workflow Name / Title */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isEditMode ? (
                  <>
                    <TextField
                      value={workflowName}
                      // onChange={(e) => setWorkflowName(e.target.value)}
                      
                      variant="standard"
                      placeholder="Workflow Name"
                      InputProps={{
                        sx: {
                          color: "white",
                          fontSize: "1.25rem",
                          "&::before": {
                            borderBottomColor: "rgba(255,255,255,0.5)",
                          },
                          "&:hover::before": {
                            borderBottomColor: "white !important",
                          },
                          "&::after": {
                            borderBottomColor: "white",
                          },
                        },
                      }}
                    />
                    <Chip
                      label={`ID: ${workflowId}`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontSize: "12px",
                      }}
                    />
                    <Chip
                      label="Editing"
                      size="small"
                      sx={{
                        backgroundColor: "#ff9800",
                        color: "white",
                        fontSize: "12px",
                        
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="h6">Create New Workflow</Typography>
                    <Chip
                      label="New"
                      size="small"
                      sx={{
                        backgroundColor: "#4caf50",
                        color: "white",
                        fontSize: "12px",
                      }}
                    />
                  </>
                )}
              </Box>
            </Box>

            {/* Right Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <HeaderDetails endpoints={endpoints} selectedNode={selectedNode} />

              <ExecuteButton />

              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  backgroundColor: "#4caf50",
                  "&:hover": {
                    backgroundColor: "#43a047",
                  },
                }}
              >
                Save
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {/* Side Panel */}
          {toggleMenu && (
            <Paper
              sx={{
                width: 320,
                borderRight: "1px solid #e0e0e0",
                borderRadius: 0,
                overflow: "auto",
              }}
            >
              <ApiListPanel />
            </Paper>
          )}

          {/* Workflow Canvas */}
          <Box
            sx={{
              flex: 1,
              position: "relative",
              backgroundColor: "#fafafa",
            }}
          >
            <WorkflowCanvas />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CreateNewWorkflow;

const HeaderDetails = ({ endpoints }) => {

  return (
    <>
      {endpoints?.length > 0 && <ExportButton />}
    </>
  );
};