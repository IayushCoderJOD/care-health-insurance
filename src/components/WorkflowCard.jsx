import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box
} from "@mui/material";

export default function WorkflowCard({ workflow, onOpen }) {
  const statusColor =
    workflow.status === "PUBLISHED" ? "success" : "warning";

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6">
          {workflow.name}
        </Typography>

        <Box mt={1} mb={2}>
          <Chip
            label={workflow.status}
            color={statusColor}
            size="small"
          />
        </Box>

        <Typography variant="body2">
          Version: {workflow.version}
        </Typography>

        <Typography variant="body2">
          Last Updated: {workflow.updatedAt}
        </Typography>

        <Box mt={2}>
          <Button variant="outlined" onClick={onOpen}>
            Open Workflow
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}