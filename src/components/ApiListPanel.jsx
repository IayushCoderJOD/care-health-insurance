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
  const connectors = useWorkflowStore((state) => state.connectors || []);

  const handleDragStart = (e, item, isConnector = false) => {
    // if the item is a connector, we will carry its component name so the
    // node modal can render appropriate configuration fields.  otherwise we
    // treat it as an API endpoint.
    let nodeData;
    if (isConnector) {
      nodeData = {
        connector: item.component,
        name: item.name,
        category: item.category,
      };
    } else {
      nodeData = {
        endpoint: item.path,
        method: item.method,
        summary: item.summary,
        operationId: item.operationId,
        parameters: item.parameters,
        requestBody: item.requestBody,
      };
    }

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/reactflow", JSON.stringify(nodeData));
  };

  // if there are no connectors *and* no endpoints, show empty state
  if (connectors.length === 0 && endpoints.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 px-6">
        <p className="text-sm font-medium">No API Endpoints or Connectors</p>
        <p className="text-xs mt-1 text-gray-400">
          Upload an OpenAPI spec or configure connectors to begin
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-2 space-y-2">
        {connectors.length > 0 && (
          <>
            <h4 className="px-2 text-xs font-semibold text-gray-500">
              Connectors
            </h4>
            {connectors.map((conn) => (
              <div
                key={conn.id}
                draggable
                onDragStart={(e) => handleDragStart(e, conn, true)}
                role="button"
                tabIndex={0}
                className="m-2 p-2 h-14 border border-gray-200 rounded-md bg-gray-50 cursor-move hover:border-gray-400 hover:bg-gray-100 transition flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded text-indigo-600 bg-indigo-50">
                    {conn.category}
                  </span>
                  <code className="text-xs font-mono text-gray-800 truncate">
                    {conn.name}
                  </code>
                </div>
              </div>
            ))}
            <hr className="my-2" />
          </>
        )}

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
