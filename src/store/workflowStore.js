import { create } from "zustand";

const useWorkflowStore = create((set, get) => ({
  // OpenAPI related
  openApiSpec: null,
  endpoints: [],

  // Workflow related
  nodes: [],
  edges: [],
  selectedNodeId: null,
  editingNodeId: null,

  // Actions
  setOpenApiSpec: (spec) => {
    set({ openApiSpec: spec });
  },

  setEndpoints: (endpoints) => {
    set({ endpoints });
  },

  setNodes: (nodes) => {
    set({ nodes });
  },

  setEdges: (edges) => {
    set({ edges });
  },

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  updateNode: (nodeId, updates) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...updates } } : node
      ),
    }));
  },

  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    }));
  },

  addEdge: (edge) => {
    set((state) => ({
      edges: [...state.edges, edge],
    }));
  },

  deleteEdge: (edgeId) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    }));
  },

  setSelectedNodeId: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  setEditingNodeId: (nodeId) => {
    set({ editingNodeId: nodeId });
  },

  getWorkflowJSON: () => {
    const state = get();
    return {
      version: "1.0",
      nodes: state.nodes,
      edges: state.edges,
      openApiSpec: state.openApiSpec,
    };
  },

  reset: () => {
    set({
      openApiSpec: null,
      endpoints: [],
      nodes: [],
      edges: [],
      selectedNodeId: null,
      editingNodeId: null,
    });
  },
}));

export default useWorkflowStore;
