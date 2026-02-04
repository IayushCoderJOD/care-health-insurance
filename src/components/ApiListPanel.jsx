import React from "react";
import useWorkflowStore from "../store/workflowStore";

const METHOD_COLORS = {
  GET: "text-blue-600 bg-blue-50",
  POST: "text-green-600 bg-green-50",
  PUT: "text-yellow-700 bg-yellow-50",
  DELETE: "text-red-600 bg-red-50",
  PATCH: "text-purple-600 bg-purple-50",
  HEAD: "text-gray-600 bg-gray-50",
  OPTIONS: "text-indigo-600 bg-indigo-50",
};

export default function ApiListPanel() {
  const endpoints = useWorkflowStore((state) => state.endpoints || []);

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

  if (endpoints.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 px-6">
        <p className="text-sm font-medium">No API Endpoints</p>
        <p className="text-xs mt-1 text-gray-400">
          Upload an OpenAPI spec to begin
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-2 space-y-2">
        {endpoints.map((endpoint) => (
          <div
            key={endpoint.id}
            draggable
            onDragStart={(e) => handleDragStart(e, endpoint)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleDragStart(e, endpoint);
              }
            }}
            className="m-2 p-2 h-14 border border-gray-200 rounded-md bg-white cursor-move hover:border-gray-400 hover:bg-gray-50 transition flex flex-col justify-between"
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${METHOD_COLORS[endpoint.method]}`}
              >
                {endpoint.method}
              </span>

              <code className="text-xs font-mono text-gray-800 truncate">
                {endpoint.path}
              </code>
            </div>

            {endpoint.summary ? (
              <p className="text-xs text-gray-500 truncate">
                {endpoint.summary}
              </p>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-3 text-[11px] text-gray-400">
              {endpoint.parameters?.length > 0 && (
                <span>{endpoint.parameters.length} params</span>
              )}
              {endpoint.requestBody && <span>Request body</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
