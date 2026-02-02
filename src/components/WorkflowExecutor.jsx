// components/WorkflowExecutor.jsx
import React, { useState, useCallback } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Paper,
  Tabs,
  Tab,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import useWorkflowStore from "../store/workflowStore";
import useWorkflowExecutionStore from "../store/workflowExecutionStore";
import { buildExecutionOrder, executeWorkflow } from "../service/workflowExecutor";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  outline: "none",
  overflow: "hidden",
};

// Tab Panel
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 1 }}>{children}</Box>}
    </div>
  );
}

// Step Result Viewer
function StepResultViewer({ result, expanded, onToggle }) {
  const [tabValue, setTabValue] = useState(0);

  if (!result) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Button
        size="small"
        onClick={onToggle}
        endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      >
        {expanded ? "Hide Details" : "Show Details"}
      </Button>

      <Collapse in={expanded}>
        <Paper variant="outlined" sx={{ mt: 1, p: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            size="small"
          >
            <Tab label="Input" />
            <Tab label="Output" />
            <Tab label="Request" />
            <Tab label="Response" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={JSON.stringify(result.input, null, 2)}
              InputProps={{
                readOnly: true,
                sx: { fontFamily: "monospace", fontSize: "0.8rem" },
              }}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={JSON.stringify(result.output, null, 2)}
              InputProps={{
                readOnly: true,
                sx: { fontFamily: "monospace", fontSize: "0.8rem" },
              }}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={JSON.stringify(result.result?.request, null, 2)}
              InputProps={{
                readOnly: true,
                sx: { fontFamily: "monospace", fontSize: "0.8rem" },
              }}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box sx={{ mb: 1 }}>
              <Chip
                label={`Status: ${result.result?.status}`}
                color={result.result?.status < 400 ? "success" : "error"}
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip
                label={`Duration: ${result.result?.timing?.duration}ms`}
                size="small"
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={JSON.stringify(result.result?.data, null, 2)}
              InputProps={{
                readOnly: true,
                sx: { fontFamily: "monospace", fontSize: "0.8rem" },
              }}
            />
          </TabPanel>
        </Paper>
      </Collapse>
    </Box>
  );
}

export default function WorkflowExecutor({ open, onClose }) {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);

  const {
    isExecuting,
    currentNodeId,
    executionStatus,
    stepResults,
    initExecution,
    setCurrentNodeId,
    setStepResult,
    completeExecution,
    failExecution,
    resetExecution,
  } = useWorkflowExecutionStore();

  const [initialInput, setInitialInput] = useState("{}");
  const [activeStep, setActiveStep] = useState(-1);
  const [expandedSteps, setExpandedSteps] = useState({});
  const [error, setError] = useState(null);

  // Get execution order
  const executionOrder = buildExecutionOrder(nodes, edges);

  const toggleStepExpanded = (nodeId) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleExecute = useCallback(async () => {
    try {
      setError(null);

      // Parse initial input
      let parsedInput;
      try {
        parsedInput = JSON.parse(initialInput);
      } catch (e) {
        setError("Invalid JSON in initial input");
        return;
      }

      // Initialize execution
      initExecution(parsedInput);
      setActiveStep(0);

      // Execute workflow
      await executeWorkflow(nodes, edges, parsedInput, {
        onStart: (order) => {
          console.log("Workflow started", order);
        },

        onNodeStart: (node, input) => {
          setCurrentNodeId(node.id);
          const stepIndex = executionOrder.findIndex((n) => n.id === node.id);
          setActiveStep(stepIndex);

          setStepResult(node.id, {
            status: "running",
            input,
            startTime: Date.now(),
          });
        },

        onNodeComplete: (node, result) => {
          setStepResult(node.id, {
            status: "completed",
            input: result.input,
            output: result.output,
            result: result.result,
            endTime: Date.now(),
          });
        },

        onNodeError: (node, error) => {
          setStepResult(node.id, {
            status: "error",
            error: error.message,
            endTime: Date.now(),
          });
        },

        onComplete: (finalOutput, allResults) => {
          completeExecution(finalOutput);
          setActiveStep(executionOrder.length);
        },

        onError: (error, node) => {
          setError(`Error at "${node.data.name}": ${error.message}`);
          failExecution(error, node.id);
        },
      });
    } catch (err) {
      setError(err.message);
    }
  }, [nodes, edges, initialInput, executionOrder]);

  const handleReset = () => {
    resetExecution();
    setActiveStep(-1);
    setExpandedSteps({});
    setError(null);
  };

  const getStepIcon = (nodeId) => {
    const result = stepResults[nodeId];

    if (!result) return null;

    switch (result.status) {
      case "running":
        return <CircularProgress size={20} />;
      case "completed":
        return <CheckCircleIcon color="success" />;
      case "error":
        return <ErrorIcon color="error" />;
      default:
        return <HourglassEmptyIcon color="disabled" />;
    }
  };

  const methodColors = {
    GET: "#22c55e",
    POST: "#3b82f6",
    PUT: "#eab308",
    PATCH: "#f97316",
    DELETE: "#ef4444",
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
            bgcolor: "#1e293b",
            color: "white",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Workflow Executor
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {executionOrder.length} steps to execute
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, maxHeight: "calc(90vh - 180px)", overflowY: "auto" }}>
          {/* Initial Input */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Initial Input (JSON)
            </Typography>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              This data will be passed to the first step. Use variables like{" "}
              <code>{"{{input.userId}}"}</code> in your nodes.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={initialInput}
              onChange={(e) => setInitialInput(e.target.value)}
              disabled={isExecuting}
              placeholder='{"userId": 123, "token": "abc"}'
              sx={{ mt: 1 }}
              InputProps={{
                sx: { fontFamily: "monospace", fontSize: "0.875rem" },
              }}
            />
          </Paper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Execution Status */}
          {executionStatus !== "idle" && (
            <Alert
              severity={
                executionStatus === "completed"
                  ? "success"
                  : executionStatus === "error"
                  ? "error"
                  : "info"
              }
              sx={{ mb: 2 }}
            >
              Status: {executionStatus.toUpperCase()}
            </Alert>
          )}

          {/* Stepper */}
          <Typography variant="subtitle2" gutterBottom>
            Execution Steps
          </Typography>

          {executionOrder.length === 0 ? (
            <Alert severity="warning">
              No nodes in workflow. Add nodes to the canvas first.
            </Alert>
          ) : (
            <Stepper activeStep={activeStep} orientation="vertical">
              {executionOrder.map((node, index) => {
                const result = stepResults[node.id];
                const isExpanded = expandedSteps[node.id];

                return (
                  <Step key={node.id}>
                    <StepLabel
                      StepIconComponent={() => getStepIcon(node.id) || (
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: index <= activeStep ? "#3b82f6" : "#e5e7eb",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                          }}
                        >
                          {index + 1}
                        </Box>
                      )}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                          label={node.data.method}
                          size="small"
                          sx={{
                            bgcolor: methodColors[node.data.method],
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                        <Typography variant="body2" fontWeight={500}>
                          {node.data.name || `Step ${index + 1}`}
                        </Typography>
                        {result?.result?.timing && (
                          <Chip
                            label={`${result.result.timing.duration}ms`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        )}
                      </Box>
                    </StepLabel>

                    <StepContent>
                      <Typography variant="caption" color="text.secondary">
                        {node.data.url}
                      </Typography>

                      {result && (
                        <StepResultViewer
                          result={result}
                          expanded={isExpanded}
                          onToggle={() => toggleStepExpanded(node.id)}
                        />
                      )}
                    </StepContent>
                  </Step>
                );
              })}

              {/* Final Output Step */}
              {executionStatus === "completed" && (
                <Step>
                  <StepLabel
                    StepIconComponent={() => (
                      <CheckCircleIcon color="success" />
                    )}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      Workflow Completed
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f0fdf4" }}>
                      <Typography variant="caption" fontWeight={500}>
                        Final Output:
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={JSON.stringify(
                          useWorkflowExecutionStore.getState().executionContext.finalOutput,
                          null,
                          2
                        )}
                        InputProps={{
                          readOnly: true,
                          sx: { fontFamily: "monospace", fontSize: "0.8rem" },
                        }}
                        sx={{ mt: 1 }}
                      />
                    </Paper>
                  </StepContent>
                </Step>
              )}
            </Stepper>
          )}
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
            bgcolor: "#f9fafb",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            disabled={isExecuting}
          >
            Reset
          </Button>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={isExecuting ? <StopIcon /> : <PlayArrowIcon />}
              onClick={handleExecute}
              disabled={isExecuting || executionOrder.length === 0}
              color={isExecuting ? "error" : "primary"}
            >
              {isExecuting ? "Running..." : "Execute Workflow"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}