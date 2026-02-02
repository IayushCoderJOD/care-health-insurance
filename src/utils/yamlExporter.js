import YAML from "js-yaml";

/**
 * Convert workflow to YAML format
 * @param {Object} workflow - Workflow object with nodes and edges
 * @returns {string} YAML string
 */
export function workflowToYAML(workflow) {
  const yamlWorkflow = {
    version: "1.0",
    name: "API Workflow",
    description: "Auto-generated API workflow",
    nodes: workflow.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        endpoint: node.data.endpoint,
        method: node.data.method,
        summary: node.data.summary,
        headers: node.data.headers,
        queryParams: node.data.queryParams,
        pathParams: node.data.pathParams,
        body: node.data.body,
      },
    })),
    edges: workflow.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    })),
  };

  try {
    return YAML.dump(yamlWorkflow, {
      indent: 2,
      lineWidth: -1,
    });
  } catch (error) {
    console.error("Failed to convert to YAML:", error);
    throw new Error("Failed to export workflow as YAML");
  }
}

/**
 * Download YAML file
 * @param {string} yamlContent - YAML content
 * @param {string} filename - Filename for download
 */
export function downloadYAML(yamlContent, filename = "workflow.yaml") {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:text/yaml;charset=utf-8,${encodeURIComponent(yamlContent)}`
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Download workflow as JSON
 * @param {Object} workflow - Workflow object
 * @param {string} filename - Filename for download
 */
export function downloadJSON(workflow, filename = "workflow.json") {
  const jsonString = JSON.stringify(workflow, null, 2);
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
