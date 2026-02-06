
import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  // MiniMap,
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
import { Button } from '@mui/material';
import TagMappingModal from "../utils/TagMappingModal";

const nodeTypes = {
  apiNode: ApiNode,
};

export default function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const storeNodes = useWorkflowStore((state) => state.nodes);
  const storeEdges = useWorkflowStore((state) => state.edges);
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const setStoreNodes = useWorkflowStore((state) => state.setNodes);
  const setStoreEdges = useWorkflowStore((state) => state.setEdges);

  // Sync store nodes to canvas when store updates
  useEffect(() => {
    if (storeNodes.length > 0) {
      const nodesWithSelection = storeNodes.map((node) => ({
        ...node,
        selected: node.id === selectedNodeId,
      }));
      setNodes(nodesWithSelection);
    }
  }, [storeNodes, selectedNodeId, setNodes]);

  // Sync store edges to canvas
  useEffect(() => {
    if (storeEdges.length > 0) {
      setEdges(storeEdges);
    }
  }, [storeEdges, setEdges]);

  // Only update store when nodes actually change from user interactions
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );


  // Only update store when edges actually change from user interactions
  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  // Validate connection before allowing it
  const isValidConnection = useCallback(
    (connection) => {
      const { source, target, targetHandle } = connection;

      // Prevent self-connections
      if (source === target) {
        return false;
      }

      // Check if target node already has an incoming connection to this handle
      const targetHasConnection = edges.some(
        (edge) => edge.target === target && edge.targetHandle === targetHandle
      );
      // Only allow connection if both handles are free
      return !targetHasConnection;
    },
    [edges]
  );

  const onConnect = useCallback(
    (connection) => {
      // Double-check validation before adding
      if (!isValidConnection(connection)) {
        console.warn("Connection rejected: handle already connected");
        return;
      }

      const newEdge = {
        ...connection,
        id: `edge-${Date.now()}`,
        type: "smoothstep", // or 'default', 'straight', 'step'
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

  return (
    <div className="w-full h-full bg-gray-50">
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
        <Background color="none" gap={16} />
        <Controls />
        {/* <MiniMap /> */}
      </ReactFlow>
    </div>
  );
}