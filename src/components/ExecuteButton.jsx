// components/ExecuteButton.jsx
import React, { useState, useCallback, memo } from "react";
import { Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import WorkflowExecutor from "./WorkflowExecutor";

const ExecuteButton = memo(function ExecuteButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PlayArrowIcon />}
        onClick={handleOpen}
        sx={{
          bgcolor: "#3b82f6",
          "&:hover": { bgcolor: "#2563eb" },
        }}
      >
        Execute Workflow
      </Button>

      <WorkflowExecutor open={open} onClose={handleClose} />
    </>
  );
});

export default ExecuteButton;