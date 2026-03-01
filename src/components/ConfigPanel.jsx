import React, { useState } from "react";
import useWorkflowStore from "../store/workflowStore";

export default function ConfigPanel() {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    params: true,
    headers: true,
    body: true,
  });

  if (!selectedNode) {
    return (
      <div className="h-full bg-white border-l border-gray-200 flex items-center justify-center text-gray-500">
        <p className="text-sm">Select a node to view properties</p>
      </div>
    );
  }

  const data = selectedNode.data;

  const handleHeaderChange = (key, value) => {
    updateNode(selectedNodeId, {
      headers: { ...data.headers, [key]: value },
    });
  };

  const handleAddHeader = () => {
    updateNode(selectedNodeId, {
      headers: { ...data.headers, [`header-${Date.now()}`]: "" },
    });
  };

  const handleRemoveHeader = (key) => {
    const newHeaders = { ...data.headers };
    delete newHeaders[key];
    updateNode(selectedNodeId, { headers: newHeaders });
  };

  const handleParamChange = (key, value) => {
    updateNode(selectedNodeId, {
      queryParams: { ...data.queryParams, [key]: value },
    });
  };

  const handleAddParam = () => {
    updateNode(selectedNodeId, {
      queryParams: { ...data.queryParams, [`param-${Date.now()}`]: "" },
    });
  };

  const handleRemoveParam = (key) => {
    const newParams = { ...data.queryParams };
    delete newParams[key];
    updateNode(selectedNodeId, { queryParams: newParams });
  };

  const handleBodyChange = (e) => {
    try {
      const parsed = JSON.parse(e.target.value);
      updateNode(selectedNodeId, { body: parsed });
    } catch {
      // Keep raw value for now
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const METHOD_COLORS = {
    GET: "text-gray-600",
    POST: "text-gray-600",
    PUT: "text-gray-600",
    DELETE: "text-gray-600",
    PATCH: "text-gray-600",
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-5 bg-white">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {data.connector ? "Connector" : "API Endpoint"}
            </p>
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              {data.connector || data.endpoint}
            </h2>
          </div>
          <button
            onClick={() => useWorkflowStore.setState({ selectedNodeId: null })}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none transition"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto">
        {/* General Section */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection("general")}
            className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition group"
          >
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">General</span>
            <span className={`text-gray-400 text-xs transition ${expandedSections.general ? "rotate-90" : ""}`}>
              ▶
            </span>
          </button>

          {expandedSections.general && (
            <div className="px-6 py-4 bg-gray-50 space-y-4 border-t border-gray-100">
              {data.connector ? (
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-2">
                    Component
                  </label>
                  <div className="text-sm font-bold text-gray-600">
                    {data.connector}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-2">
                    Method
                  </label>
                  <div className={`text-sm font-bold ${METHOD_COLORS[data.method] || "text-gray-600"}`}>
                    {data.method}
                  </div>
                </div>
              )}

              {data.summary && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-2">
                    Description
                  </label>
                  <p className="text-sm text-gray-600 leading-relaxed">{data.summary}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Query Parameters Section */}
        {Object.keys(data.queryParams || {}).length > 0 && (
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleSection("params")}
              className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition group"
            >
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Query Parameters
              </span>
              <span className={`text-gray-400 text-xs transition ${expandedSections.params ? "rotate-90" : ""}`}>
                ▶
              </span>
            </button>

            {expandedSections.params && (
              <div className="px-6 py-4 bg-gray-50 space-y-4 border-t border-gray-100">
                {Object.entries(data.queryParams).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-700">{key}</label>
                      <button
                        onClick={() => handleRemoveParam(key)}
                        className="text-gray-400 hover:text-red-600 text-xs transition"
                      >
                        ✕
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Value"
                      value={value}
                      onChange={(e) => handleParamChange(key, e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition"
                    />
                  </div>
                ))}
                <button
                  onClick={handleAddParam}
                  className="w-full text-xs font-semibold text-gray-600 hover:text-gray-900 py-2 border border-dashed border-gray-300 rounded hover:border-gray-400 transition"
                >
                  + Add Parameter
                </button>
              </div>
            )}
          </div>
        )}

        {/* Headers Section */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection("headers")}
            className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition group"
          >
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Headers</span>
            <span className={`text-gray-400 text-xs transition ${expandedSections.headers ? "rotate-90" : ""}`}>
              ▶
            </span>
          </button>

          {expandedSections.headers && (
            <div className="px-6 py-4 bg-gray-50 space-y-4 border-t border-gray-100">
              {Object.entries(data.headers || {}).length === 0 ? (
                <>
                  <p className="text-xs text-gray-500 text-center py-4">No headers</p>
                  <button
                    onClick={handleAddHeader}
                    className="w-full text-xs font-semibold text-gray-600 hover:text-gray-900 py-2 border border-dashed border-gray-300 rounded hover:border-gray-400 transition"
                  >
                    + Add Header
                  </button>
                </>
              ) : (
                <>
                  {Object.entries(data.headers || {}).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-gray-700">{key}</label>
                        <button
                          onClick={() => handleRemoveHeader(key)}
                          className="text-gray-400 hover:text-red-600 text-xs transition"
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Value"
                        value={value}
                        onChange={(e) => handleHeaderChange(key, e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleAddHeader}
                    className="w-full text-xs font-semibold text-gray-600 hover:text-gray-900 py-2 border border-dashed border-gray-300 rounded hover:border-gray-400 transition"
                  >
                    + Add Header
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Request Body or Connector Configuration Section */}
        {(data.requestBody || data.connector) && (
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleSection("body")}
              className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition group"
            >
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                {data.connector ? "Connector Configuration" : "Request Body"}
              </span>
              <span className={`text-gray-400 text-xs transition ${expandedSections.body ? "rotate-90" : ""}`}>
                ▶
              </span>
            </button>

            {expandedSections.body && (
              <div className="px-6 py-4 bg-gray-50 space-y-4 border-t border-gray-100">
                {data.requestBody && (
                  <div>
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-2">
                      Content Type
                    </label>
                    <div className="px-3 py-2 text-xs bg-white border border-gray-300 rounded text-gray-600 font-mono">
                      {data.requestBody.contentType}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-2">
                    {data.connector ? "Config" : "Body"}
                  </label>
                  <textarea
                    placeholder="Enter JSON..."
                    value={
                      data.connector
                        ? JSON.stringify(data.config || {}, null, 2)
                        : data.body
                        ? JSON.stringify(data.body, null, 2)
                        : ""
                    }
                    onChange={(e) => {
                      if (data.connector) {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          updateNode(selectedNodeId, { config: parsed });
                        } catch {}
                      } else {
                        handleBodyChange(e);
                      }
                    }}
                    className="w-full h-32 px-3 py-2 text-xs border border-gray-200 rounded font-mono focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
