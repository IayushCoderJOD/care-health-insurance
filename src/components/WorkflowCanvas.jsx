import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import useWorkflowStore from "../store/workflowStore";
import ApiNode from "./ApiNode";
import { Box, Typography } from "@mui/material";
import { AccountTree as WorkflowIcon } from "@mui/icons-material";

const nodeTypes = {
  apiNode: ApiNode,
};

export default function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const storeNodes = useWorkflowStore((state) => state.nodes);
  const storeEdges = useWorkflowStore((state) => state.edges);
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const isEditMode = useWorkflowStore((state) => state.isEditMode);
  const setStoreNodes = useWorkflowStore((state) => state.setNodes);
  const setStoreEdges = useWorkflowStore((state) => state.setEdges);

  // Sync store nodes to canvas when store updates
  useEffect(() => {
    const nodesWithSelection = storeNodes.map((node) => ({
      ...node,
      selected: node.id === selectedNodeId,
    }));
    setNodes(nodesWithSelection);
  }, [storeNodes, selectedNodeId, setNodes]);

  // Sync store edges to canvas
  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);

      // Update store with position changes
      const positionChanges = changes.filter(
        (change) => change.type === "position" && change.dragging === false
      );

      if (positionChanges.length > 0) {
        setNodes((currentNodes) => {
          setStoreNodes(currentNodes);
          return currentNodes;
        });
      }
    },
    [onNodesChange, setNodes, setStoreNodes]
  );

  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  const isValidConnection = useCallback(() => {
    return true;
  }, []);

  const onConnect = useCallback(
    (connection) => {
      if (!isValidConnection(connection)) {
        console.warn("Connection rejected: handle already connected");
        return;
      }

      const newEdge = {
        ...connection,
        id: `edge-${Date.now()}`,
        type: "smoothstep",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
      };

      setEdges((eds) => {
        const newEdges = addEdge(newEdge, eds);
        setStoreEdges(newEdges);
        return newEdges;
      });
    },
    [setEdges, setStoreEdges, isValidConnection]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const data = event.dataTransfer.getData("application/reactflow");

      if (!data) return;

      try {
        const nodeData = JSON.parse(data);
        const position = {
          x: event.clientX - reactFlowBounds.left - 100,
          y: event.clientY - reactFlowBounds.top - 50,
        };

        const newNode = {
          id: `node-${Date.now()}`,
          type: "apiNode",
          position,
          data: {
            id: `node-${Date.now()}`,
            ...nodeData,
            headers: {},
            queryParams: {},
            pathParams: {},
            body: null,
          },
        };

        setNodes((nds) => {
          const updatedNodes = [...nds, newNode];
          setStoreNodes(updatedNodes);
          return updatedNodes;
        });
      } catch (err) {
        console.error("Failed to parse dropped data:", err);
      }
    },
    [setNodes, setStoreNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Empty state component
  const EmptyState = () => (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <WorkflowIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
      <Typography variant="h6" sx={{ color: "#999", mb: 1 }}>
        {isEditMode ? "Loading workflow..." : "No nodes yet"}
      </Typography>
      <Typography sx={{ color: "#bbb", fontSize: 14 }}>
        Drag and drop API endpoints from the left panel to get started
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#fafafa",
        position: "relative",
      }}
    >

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        isValidConnection={isValidConnection}
        fitView
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
        }}
      >
        <Background color="#ddd" gap={16} />
        <Controls
          style={{
            backgroundColor: "white",
            border: "1px solid #e0e0e0",
            borderRadius: 4,
          }}
        />
      </ReactFlow>
    </Box>
  );
}