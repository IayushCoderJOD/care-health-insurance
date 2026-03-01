import { create } from "zustand";
import { connectors as defaultConnectors } from "../constants/constants";

// Sample/dummy workflows for testing
export const dummyWorkflows = {
  "WF-001": {
    id: "WF-001",
    name: "User Authentication Flow",
    createdDate: "2024-01-15",
    status: "Active",
    nodes: [
      {
        id: "node-1",
        type: "apiNode",
        position: { x: 100, y: 100 },
        data: {
          id: "node-1",
          method: "POST",
          path: "/auth/login",
          summary: "User Login",
          description: "Request body",
          headers: {},
          queryParams: {},
          pathParams: {},
          body: { username: "", password: "" },
        },
      },
      {
        id: "node-2",
        type: "apiNode",
        position: { x: 450, y: 100 },
        data: {
          id: "node-2",
          method: "GET",
          path: "/users/profile",
          summary: "Get User Profile",
          description: "1 params",
          headers: {},
          queryParams: {},
          pathParams: {},
          body: null,
        },
      },
      {
        id: "node-3",
        type: "apiNode",
        position: { x: 800, y: 100 },
        data: {
          id: "node-3",
          method: "POST",
          path: "/auth/logout",
          summary: "User Logout",
          description: "",
          headers: {},
          queryParams: {},
          pathParams: {},
          body: null,
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "node-1",
        target: "node-2",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "edge-2",
        source: "node-2",
        target: "node-3",
        type: "smoothstep",
        animated: true,
      },
    ],
  },
  "WF-002": {
    id: "WF-002",
    name: "Payment Processing",
    createdDate: "2024-01-18",
    status: "Draft",
    nodes: [
      {
        id: "node-1",
        type: "apiNode",
        position: { x: 100, y: 150 },
        data: {
          id: "node-1",
          method: "POST",
          path: "/payments/create",
          summary: "Create Payment",
          description: "Request body",
          headers: {},
          queryParams: {},
          pathParams: {},
          body: { amount: 0, currency: "USD" },
        },
      },
      {
        id: "node-2",
        type: "apiNode",
        position: { x: 450, y: 50 },
        data: {
          id: "node-2",
          method: "POST",
          path: "/payments/process",
          summary: "Process Payment",
          description: "Request body",
          headers: {},
          queryParams: {},
          pathParams: {},
          body: null,
        },
      },
      {
        id: "node-3",
        type: "apiNode",
        position: { x: 450, y: 250 },
        data: {
          id: "node-3",
          method: "POST",
          path: "/notifications/send",
          summary: "Send Notification",
          description: "Request body",
          headers: {},
          queryParams: {},
          pathParams: {},
          body: null,
        },
      },
      {
        id: "node-4",
        type: "apiNode",
        position: { x: 800, y: 150 },
        data: {
          id: "node-4",
          method: "GET",
          path: "/payments/{id}/status",
          summary: "Get Payment Status",
          description: "1 params",
          headers: {},
          queryParams: {},
          pathParams: {},
          body: null,
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "node-1",
        target: "node-2",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "edge-2",
        source: "node-1",
        target: "node-3",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "edge-3",
        source: "node-2",
        target: "node-4",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "edge-4",
        source: "node-3",
        target: "node-4",
        type: "smoothstep",
        animated: true,
      },
    ],
  },
  "WF-003": {
    id: "WF-003",
    name: "Notification Service",
    createdDate: "2024-01-20",
    status: "Active",
    nodes: [
      {
        id: "node-1",
        type: "apiNode",
        position: { x: 150, y: 100 },
        data: {
          id: "node-1",
          method: "POST",
          path: "/notifications/send",
          summary: "Send Notification",
          description: "Request body",
          headers: {},
          queryParams: {},
          pathParams: {},
          body: { message: "", userId: "" },
        },
      },
      {
        id: "node-2",
        type: "apiNode",
        position: { x: 500, y: 100 },
        data: {
          id: "node-2",
          method: "GET",
          path: "/notifications/status/{id}",
          summary: "Check Notification Status",
          description: "1 params",
          headers: {},
          queryParams: {},
          pathParams: {},
          body: null,
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "node-1",
        target: "node-2",
        type: "smoothstep",
        animated: true,
      },
    ],
  },
  "WF-004": {
    id: "WF-004",
    name: "File Upload Handler",
    createdDate: "2024-01-22",
    status: "Inactive",
    nodes: [
      {
        id: "node-1",
        type: "apiNode",
        position: { x: 100, y: 100 },
        data: {
          id: "node-1",
          method: "POST",
          path: "/files/upload",
          summary: "Upload File",
          description: "Request body",
          headers: {},
          queryParams: {},
          pathParams: {},
          body: null,
        },
      },
    ],
    edges: [],
  },
  "WF-005": {
    id: "WF-005",
    name: "Analytics Tracker",
    createdDate: "2024-01-25",
    status: "Active",
    nodes: [
      {
        id: "node-1",
        type: "apiNode",
        position: { x: 100, y: 100 },
        data: {
          id: "node-1",
          method: "POST",
          path: "/analytics/events",
          summary: "Track Event",
          description: "Request body",
          headers: {},
          queryParams: {},
          pathParams: {},
          body: { event: "", data: {} },
        },
      },
      {
        id: "node-2",
        type: "apiNode",
        position: { x: 450, y: 100 },
        data: {
          id: "node-2",
          method: "GET",
          path: "/analytics/reports",
          summary: "Get Reports",
          description: "2 params",
          headers: {},
          queryParams: {},
          pathParams: {},
          body: null,
        },
      },
      {
        id: "node-3",
        type: "connectorNode",
        position: { x: 800, y: 100 },
        data: {
          id: "node-3",
          connector: "mongodb",
          name: "Write to Events",
          config: { database: "testdb", collection: "events", operation: "insert" },
          headers: {},
          queryParams: {},
          pathParams: {},
          body: null,
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "node-1",
        target: "node-2",
        type: "smoothstep",
        animated: true,
      },
    ],
  },
};

const useWorkflowStore = create((set, get) => ({
  // ==================
  // OpenAPI related
  // ==================
  openApiSpec: null,
  endpoints: [],
  connectors: defaultConnectors,

  // ==================
  // Workflow metadata
  // ==================
  workflowId: null,
  workflowName: "",
  isEditMode: false,

  // ==================
  // Workflow data
  // ==================
  nodes: [],
  edges: [],
  selectedNodeId: null,
  editingNodeId: null,

  // ==================
  // OpenAPI Actions
  // ==================
  setOpenApiSpec: (spec) => {
    set({ openApiSpec: spec });
  },

  setEndpoints: (endpoints) => {
    set({ endpoints });
  },

  setConnectors: (conns) => {
    set({ connectors: conns });
  },

  // ==================
  // Workflow Metadata Actions
  // ==================
  setWorkflowName: (name) => {
    set({ workflowName: name });
  },

  setWorkflowId: (id) => {
    set({ workflowId: id });
  },

  // ==================
  // Node Actions
  // ==================
  setNodes: (nodes) => {
    set({ nodes });
  },

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  updateNode: (nodeId, updates) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      ),
    }));
  },

  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNodeId:
        state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      editingNodeId:
        state.editingNodeId === nodeId ? null : state.editingNodeId,
    }));
  },

  // ==================
  // Edge Actions
  // ==================
  setEdges: (edges) => {
    set({ edges });
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

  // ==================
  // Selection Actions
  // ==================
  setSelectedNodeId: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  setEditingNodeId: (nodeId) => {
    set({ editingNodeId: nodeId });
  },

  // ==================
  // Workflow Load/Save Actions
  // ==================

  /**
   * Load an existing workflow by ID
   * @param {string} workflowId - The ID of the workflow to load
   * @returns {boolean} - True if workflow was found and loaded
   */
  loadWorkflow: (workflowId) => {
    const workflow = dummyWorkflows[workflowId];
    if (workflow) {
      set({
        workflowId: workflow.id,
        workflowName: workflow.name,
        nodes: workflow.nodes || [],
        edges: workflow.edges || [],
        isEditMode: true,
        selectedNodeId: null,
        editingNodeId: null,
      });
      return true;
    }
    console.warn(`Workflow with ID "${workflowId}" not found`);
    return false;
  },

  /**
   * Reset the store for creating a new workflow
   */
  resetWorkflow: () => {
    set({
      workflowId: null,
      workflowName: "",
      nodes: [],
      edges: [],
      isEditMode: false,
      selectedNodeId: null,
      editingNodeId: null,
    });
  },

  /**
   * Save the current workflow
   * @returns {Object} - The saved workflow object
   */
  saveWorkflow: () => {
    const state = get();
    const workflow = {
      id: state.workflowId || `WF-${Date.now()}`,
      name: state.workflowName || "Untitled Workflow",
      createdDate: new Date().toISOString().split("T")[0],
      status: "Draft",
      nodes: state.nodes,
      edges: state.edges,
    };

    // In a real app, you would save to backend here
    console.log("Saving workflow:", workflow);

    // Update the workflowId if it was a new workflow
    if (!state.workflowId) {
      set({
        workflowId: workflow.id,
        isEditMode: true,
      });
    }

    return workflow;
  },

  // ==================
  // Export Actions
  // ==================
  getWorkflowJSON: () => {
    const state = get();
    return {
      version: "1.0",
      id: state.workflowId,
      name: state.workflowName,
      nodes: state.nodes,
      edges: state.edges,
      openApiSpec: state.openApiSpec,
    };
  },

  // ==================
  // Full Reset
  // ==================
  reset: () => {
    set({
      openApiSpec: null,
      endpoints: [],
      connectors: defaultConnectors,
      workflowId: null,
      workflowName: "",
      isEditMode: false,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      editingNodeId: null,
    });
  },

  // ==================
  // Utility Actions
  // ==================

  /**
   * Get all available workflows (for Dashboard)
   * @returns {Array} - Array of workflow summaries
   */
  getAllWorkflows: () => {
    return Object.values(dummyWorkflows).map((wf) => ({
      id: wf.id,
      name: wf.name,
      createdDate: wf.createdDate,
      status: wf.status,
      nodeCount: wf.nodes?.length || 0,
      edgeCount: wf.edges?.length || 0,
    }));
  },

  /**
   * Delete a workflow by ID
   * @param {string} workflowId - The ID of the workflow to delete
   * @returns {boolean} - True if workflow was deleted
   */
  deleteWorkflow: (workflowId) => {
    if (dummyWorkflows[workflowId]) {
      delete dummyWorkflows[workflowId];
      return true;
    }
    return false;
  },

  /**
   * Check if a workflow exists
   * @param {string} workflowId - The ID to check
   * @returns {boolean}
   */
  workflowExists: (workflowId) => {
    return !!dummyWorkflows[workflowId];
  },
}));

export default useWorkflowStore;