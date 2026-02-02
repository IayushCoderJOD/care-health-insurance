// store/workflowExecutionStore.js
import { create } from "zustand";

const useWorkflowExecutionStore = create((set, get) => ({
  // Execution state
  isExecuting: false,
  currentNodeId: null,
  executionStatus: "idle", // 'idle' | 'running' | 'paused' | 'completed' | 'error'
  
  // Step results - stores output of each node
  stepResults: {}, // { nodeId: { input, output, status, error, startTime, endTime } }
  
  // Execution context - data passed between nodes
  executionContext: {
    variables: {},      // Global variables
    initialInput: null, // Initial input to workflow
    finalOutput: null,  // Final output from workflow
  },
  
  // Execution history
  executionHistory: [], // Array of execution runs
  
  // Actions
  setIsExecuting: (value) => set({ isExecuting: value }),
  setCurrentNodeId: (nodeId) => set({ currentNodeId: nodeId }),
  setExecutionStatus: (status) => set({ executionStatus: status }),
  
  // Initialize execution
  initExecution: (initialInput = {}) => {
    set({
      isExecuting: true,
      currentNodeId: null,
      executionStatus: "running",
      stepResults: {},
      executionContext: {
        variables: {},
        initialInput,
        finalOutput: null,
      },
    });
  },
  
  // Set step result
  setStepResult: (nodeId, result) => {
    set((state) => ({
      stepResults: {
        ...state.stepResults,
        [nodeId]: {
          ...state.stepResults[nodeId],
          ...result,
        },
      },
    }));
  },
  
  // Update execution context
  updateContext: (updates) => {
    set((state) => ({
      executionContext: {
        ...state.executionContext,
        ...updates,
      },
    }));
  },
  
  // Set variable in context
  setVariable: (key, value) => {
    set((state) => ({
      executionContext: {
        ...state.executionContext,
        variables: {
          ...state.executionContext.variables,
          [key]: value,
        },
      },
    }));
  },
  
  // Complete execution
  completeExecution: (finalOutput) => {
    const state = get();
    const historyEntry = {
      id: `exec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: "completed",
      stepResults: state.stepResults,
      initialInput: state.executionContext.initialInput,
      finalOutput,
      duration: Object.values(state.stepResults).reduce((acc, step) => {
        return acc + (step.endTime - step.startTime);
      }, 0),
    };
    
    set((state) => ({
      isExecuting: false,
      executionStatus: "completed",
      executionContext: {
        ...state.executionContext,
        finalOutput,
      },
      executionHistory: [historyEntry, ...state.executionHistory].slice(0, 50),
    }));
  },
  
  // Fail execution
  failExecution: (error, nodeId) => {
    const state = get();
    const historyEntry = {
      id: `exec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: "error",
      error: error.message,
      failedNodeId: nodeId,
      stepResults: state.stepResults,
      initialInput: state.executionContext.initialInput,
    };
    
    set((state) => ({
      isExecuting: false,
      executionStatus: "error",
      executionHistory: [historyEntry, ...state.executionHistory].slice(0, 50),
    }));
  },
  
  // Reset execution
  resetExecution: () => {
    set({
      isExecuting: false,
      currentNodeId: null,
      executionStatus: "idle",
      stepResults: {},
      executionContext: {
        variables: {},
        initialInput: null,
        finalOutput: null,
      },
    });
  },
  
  // Get step output (for next step's input)
  getStepOutput: (nodeId) => {
    const state = get();
    return state.stepResults[nodeId]?.output || null;
  },
}));

export default useWorkflowExecutionStore;