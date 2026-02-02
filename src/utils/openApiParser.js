import SwaggerParser from "@apidevtools/swagger-parser";
import YAML from "js-yaml";

/**
 * Parse OpenAPI spec from various formats
 * @param {File|string} input - File object or YAML/JSON string
 * @returns {Promise<Object>} Parsed OpenAPI spec
 */
export async function parseOpenAPI(input) {
  try {
    let spec;

    if (input instanceof File) {
      const text = await input.text();
      if (input.name.endsWith(".json")) {
        spec = JSON.parse(text);
      } else if (input.name.endsWith(".yaml") || input.name.endsWith(".yml")) {
        spec = YAML.load(text);
      } else {
        throw new Error("Unsupported file format. Please use JSON or YAML.");
      }
    } else if (typeof input === "string") {
      try {
        spec = JSON.parse(input);
      } catch {
        try {
          spec = YAML.load(input);
        } catch {
          const response = await fetch(input);
          const text = await response.text();
          try {
            spec = JSON.parse(text);
          } catch {
            spec = YAML.load(text);
          }
        }
      }
    }

    if (!spec.openapi && !spec.swagger) {
      throw new Error("Invalid OpenAPI spec: missing openapi or swagger version");
    }
    if (!spec.info) {
      throw new Error("Invalid OpenAPI spec: missing info object");
    }
    
    return spec;
  } catch (error) {
    console.error("OpenAPI Parse Error:", error);
    throw new Error(`Failed to parse OpenAPI: ${error.message}`);
  }
}

/**
 * Extract endpoints from OpenAPI spec
 * @param {Object} spec - Parsed OpenAPI spec
 * @returns {Array} Array of endpoint objects
 */
export function extractEndpoints(spec) {
  const endpoints = [];
  let id = 1;

  if (!spec.paths) {
    return endpoints;
  }

  Object.entries(spec.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, operation]) => {
      if (method.toLowerCase() === method.toUpperCase() || ["get", "post", "put", "delete", "patch", "head", "options"].includes(method.toLowerCase())) {
        endpoints.push({
          id: `api-${id++}`,
          path,
          method: method.toUpperCase(),
          summary: operation.summary || "",
          description: operation.description || "",
          parameters: operation.parameters || [],
          requestBody: operation.requestBody || null,
          responses: operation.responses || {},
          tags: operation.tags || [],
          operationId: operation.operationId || `${method}_${path}`,
        });
      }
    });
  });

  return endpoints;
}

/**
 * Get parameter details
 * @param {Object} param - Parameter object from OpenAPI
 * @returns {Object} Formatted parameter
 */
export function formatParameter(param) {
  return {
    name: param.name,
    in: param.in, // query, header, path, cookie
    required: param.required || false,
    description: param.description || "",
    schema: param.schema || {},
  };
}

/**
 * Get request body schema
 * @param {Object} requestBody - RequestBody object from OpenAPI
 * @returns {Object} Formatted request body
 */
export function formatRequestBody(requestBody) {
  if (!requestBody) return null;

  const contentTypes = Object.keys(requestBody.content || {});
  const firstContentType = contentTypes[0];
  const schema = requestBody.content?.[firstContentType]?.schema || {};

  return {
    required: requestBody.required || false,
    contentType: firstContentType,
    schema,
  };
}

/**
 * Create node data from endpoint
 * @param {Object} endpoint - Endpoint object
 * @returns {Object} Node data for React Flow
 */
export function endpointToNodeData(endpoint) {
  return {
    endpoint: endpoint.path,
    method: endpoint.method,
    summary: endpoint.summary,
    operationId: endpoint.operationId,
    headers: {},
    queryParams: {},
    pathParams: {},
    body: null,
    parameters: endpoint.parameters,
    requestBody: formatRequestBody(endpoint.requestBody),
    responses: endpoint.responses,
  };
}
