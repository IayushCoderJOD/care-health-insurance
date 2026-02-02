import React from "react";
import useWorkflowStore from "../store/workflowStore";

const METHOD_COLORS = {
  GET: "bg-blue-100 text-blue-800",
  POST: "bg-green-100 text-green-800",
  PUT: "bg-yellow-100 text-yellow-800",
  DELETE: "bg-red-100 text-red-800",
  PATCH: "bg-purple-100 text-purple-800",
  HEAD: "bg-gray-100 text-gray-800",
  OPTIONS: "bg-indigo-100 text-indigo-800",
};

export default function ApiListPanel() {
  const endpoints = useWorkflowStore((state) => state.endpoints || []);
  console.log("Endpoints in ApiListPanel:", endpoints);

  const handleDragStart = (e, endpoint) => {
    const nodeData = {
      endpoint: endpoint.path,
      method: endpoint.method,
      summary: endpoint.summary,
      operationId: endpoint.operationId,
      parameters: endpoint.parameters,
      requestBody: endpoint.requestBody,
    };

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/reactflow", JSON.stringify(nodeData));
  };

  if (endpoints?.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6">
        <p className="text-lg font-semibold">No API Endpoints Loaded</p>
        <p className="text-sm mt-2">Upload an OpenAPI spec to get started</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">API Endpoints</h2>
        <p className="text-xs text-gray-500 mb-4">Drag endpoints to canvas →</p>

        <div className="space-y-2">
          {endpoints.map((endpoint) => (
          <div
            key={endpoint.id}
            draggable
            onDragStart={(e) => handleDragStart(e, endpoint)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleDragStart(e, endpoint);
              }
            }}
            className="p-3 bg-white border border-gray-300 rounded-lg cursor-move hover:shadow-md hover:border-blue-400 transition group"
          >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-1 text-xs font-bold rounded ${METHOD_COLORS[endpoint.method] || "bg-gray-100"}`}
                >
                  {endpoint.method}
                </span>
                <code className="text-xs font-mono flex-1 text-gray-700 truncate">
                  {endpoint.path}
                </code>
              </div>

              {endpoint.summary && (
                <p className="text-xs text-gray-600 mb-2">{endpoint.summary}</p>
              )}

              <div className="flex flex-wrap gap-1">
                {endpoint.tags?.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                {endpoint.parameters && endpoint.parameters?.length > 0 && (
                  <p>📋 {endpoint.parameters?.length} parameter(s)</p>
                )}
                {endpoint.requestBody && <p>📦 Has request body</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
