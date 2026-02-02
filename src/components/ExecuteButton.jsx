// components/ExecuteButton.jsx
import React, { useState } from "react";
import { Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import WorkflowExecutor from "./WorkflowExecutor";

export default function ExecuteButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PlayArrowIcon />}
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: "#3b82f6",
          "&:hover": { bgcolor: "#2563eb" },
        }}
      >
        Execute Workflow
      </Button>

      <WorkflowExecutor open={open} onClose={() => setOpen(false)} />
    </>
  );
}