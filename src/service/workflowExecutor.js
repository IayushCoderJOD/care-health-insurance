// services/workflowExecutor.js

/**
 * Resolves variables in a string like "{{previousStep.userId}}" or "{{variables.apiKey}}"
 */
const resolveVariables = (template, context) => {
  if (typeof template !== "string") return template;
  
  return template.replaceAll(/\{\{([^}]+)\}\}/g, (match, path) => {
    const keys = path.trim().split(".");
    let value = context;
    
    for (const key of keys) {
      if (value === undefined || value === null) return match;
      value = value[key];
    }
    
    return value === undefined || value === null ? match : value;
  });
};

/**
 * Recursively resolve variables in an object
 */
const resolveObjectVariables = (obj, context) => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === "string") {
    return resolveVariables(obj, context);
  }
  
  if (Array.isArray(obj)) {
    return obj.map((item) => resolveObjectVariables(item, context));
  }
  
  if (typeof obj === "object") {
    const resolved = {};
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = resolveObjectVariables(value, context);
    }
    return resolved;
  }
  
  return obj;
};

/**
 * Build the execution order from nodes and edges (topological sort)
 */
export const buildExecutionOrder = (nodes, edges) => {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const inDegree = new Map(nodes.map((n) => [n.id, 0]));
  const adjacencyList = new Map(nodes.map((n) => [n.id, []]));
  
  // Build adjacency list and calculate in-degrees
  edges.forEach((edge) => {
    adjacencyList.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });
  
  // Find starting nodes (in-degree = 0)
  const queue = [];
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) queue.push(nodeId);
  });
  
  const executionOrder = [];
  
  while (queue.length > 0) {
    const nodeId = queue.shift();
    executionOrder.push(nodeMap.get(nodeId));
    
    adjacencyList.get(nodeId)?.forEach((neighbor) => {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    });
  }
  
  return executionOrder;
};

/**
 * Get previous node in the execution chain
 */
export const getPreviousNode = (nodeId, edges) => {
  const incomingEdge = edges.find((edge) => edge.target === nodeId);
  return incomingEdge?.source || null;
};

/**
 * Execute a single API node
 */
export const executeNode = async (node, inputData, context) => {
  const { data } = node;
  
  // Handle connector nodes (MongoDB, Kafka, Timer, etc.)
  if (data.connector) {
    const startTime = Date.now();
    let output = null;
    let status = 200;
    let statusText = "OK";
    let errorData = null;

    try {
      const config = data.config || {};
      const backendUrl = config.backendUrl || "http://localhost:8080";

      // MongoDB connector: handle insert and findAll operations
      if (data.connector === "mongodb") {
        const operation = config.operation || "findAll";
        const collection = config.collection || "users";

        if (operation === "insert") {
          // POST to /users endpoint to insert
          const response = await fetch(`${backendUrl}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inputData),
          });
          output = await response.json();
          status = response.status;
          statusText = response.statusText;
        } else if (operation === "findAll") {
          // GET from /users endpoint to retrieve all
          const response = await fetch(`${backendUrl}/users`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          output = await response.json();
          status = response.status;
          statusText = response.statusText;
        } else {
          // Generic query support for other operations
          const response = await fetch(`${backendUrl}/${collection}`, {
            method: operation === "insert" ? "POST" : "GET",
            headers: { "Content-Type": "application/json" },
            ...(operation === "insert" && { body: JSON.stringify(inputData) }),
          });
          output = await response.json();
          status = response.status;
          statusText = response.statusText;
        }
      }
      // Kafka connector: log/stub
      else if (data.connector === "kafka") {
        output = {
          message: "Message sent to Kafka",
          topic: config.topic || "default-topic",
          data: inputData,
        };
      }
      // Timer connector: stub
      else if (data.connector === "timer") {
        output = {
          message: "Timer executed",
          delay: config.delay || 1000,
          timestamp: new Date().toISOString(),
        };
      }
      // Default/generic connector
      else {
        output = {
          connector: data.connector,
          config,
          input: inputData,
        };
      }
    } catch (error) {
      status = 500;
      statusText = "Error";
      errorData = error.message;
      output = {
        error: errorData,
        connector: data.connector,
      };
    }

    const endTime = Date.now();
    return {
      status,
      statusText,
      headers: {},
      data: output,
      timing: {
        startTime,
        endTime,
        duration: endTime - startTime,
      },
      request: {
        connector: data.connector,
        config: data.config || {},
      },
    };
  }

  // Build resolution context
  const resolutionContext = {
    input: inputData,
    previousStep: inputData,
    variables: context.variables || {},
    env: process.env || {},
  };
  
  // Resolve variables in URL, headers, params, body
  const resolvedUrl = resolveVariables(data.url || "", resolutionContext);
  const resolvedHeaders = resolveObjectVariables(data.headers || {}, resolutionContext);
  const resolvedParams = resolveObjectVariables(data.queryParams || {}, resolutionContext);
  const resolvedBody = resolveObjectVariables(data.body, resolutionContext);
  
  // Build URL with query params
  const url = new URL(resolvedUrl);
  Object.entries(resolvedParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  
  // Prepare fetch options
  const fetchOptions = {
    method: data.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...resolvedHeaders,
    },
  };
  
  // Add body for non-GET requests
  if (data.method !== "GET" && resolvedBody) {
    fetchOptions.body = JSON.stringify(resolvedBody);
  }
  
  // Execute request
  const startTime = Date.now();
  const response = await fetch(url.toString(), fetchOptions);
  const endTime = Date.now();
  
  // Parse response
  let responseData;
  const contentType = response.headers.get("content-type");
  
  if (contentType?.includes("application/json")) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }
  
  return {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    data: responseData,
    timing: {
      startTime,
      endTime,
      duration: endTime - startTime,
    },
    request: {
      url: url.toString(),
      method: data.method,
      headers: resolvedHeaders,
      body: resolvedBody,
    },
  };
};

/**
 * Execute entire workflow
 */
export const executeWorkflow = async (nodes, edges, initialInput, callbacks) => {
  const {
    onStart,
    onNodeStart,
    onNodeComplete,
    onNodeError,
    onComplete,
    onError,
  } = callbacks;
  
  // Get execution order
  const executionOrder = buildExecutionOrder(nodes, edges);
  
  if (executionOrder.length === 0) {
    throw new Error("No nodes to execute");
  }
  
  onStart?.(executionOrder);
  
  const context = {
    variables: {},
    results: {},
  };
  
  let currentInput = initialInput;
  let finalOutput = null;
  
  for (const node of executionOrder) {
    try {
      onNodeStart?.(node, currentInput);
      
      // Execute the node
      const result = await executeNode(node, currentInput, context);
      
      // Store result
      context.results[node.id] = result;
      
      // Extract output for next step (response data)
      const output = result.data;
      
      onNodeComplete?.(node, {
        input: currentInput,
        output,
        result,
      });
      
      // Pass output to next step
      currentInput = output;
      finalOutput = output;
      
    } catch (error) {
      onNodeError?.(node, error);
      onError?.(error, node);
      throw error;
    }
  }
  
  onComplete?.(finalOutput, context.results);
  
  return {
    success: true,
    output: finalOutput,
    results: context.results,
  };
};