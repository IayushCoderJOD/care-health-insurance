import React, { useState } from "react";
import useWorkflowStore from "../store/workflowStore";

export default function ConfigModal() {

  const editingNodeId = useWorkflowStore((state) => state.editingNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const setEditingNodeId = useWorkflowStore((state) => state.setEditingNodeId);

  const editingNode = nodes.find((n) => n.id === editingNodeId);
  const [activeTab, setActiveTab] = useState("headers");

 
  if (!editingNode) return null;

  const data = editingNode.data;

  const handleHeaderChange = (key, value) => {
    updateNode(editingNodeId, {
      headers: { ...data.headers, [key]: value },
    });
  };

  const handleAddHeader = () => {
    updateNode(editingNodeId, {
      headers: { ...data.headers, [`header-${Date.now()}`]: "" },
    });
  };

  const handleRemoveHeader = (key) => {
    const newHeaders = { ...data.headers };
    delete newHeaders[key];
    updateNode(editingNodeId, { headers: newHeaders });
  };

  const handleParamChange = (key, value) => {
    updateNode(editingNodeId, {
      queryParams: { ...data.queryParams, [key]: value },
    });
  };

  const handleAddParam = () => {
    updateNode(editingNodeId, {
      queryParams: { ...data.queryParams, [`param-${Date.now()}`]: "" },
    });
  };

  const handleRemoveParam = (key) => {
    const newParams = { ...data.queryParams };
    delete newParams[key];
    updateNode(editingNodeId, { queryParams: newParams });
  };

  const handleBodyChange = (e) => {
    try {
      const parsed = JSON.parse(e.target.value);
      updateNode(editingNodeId, { body: parsed });
    } catch {
      // Keep raw value for now
    }
  };

  const handleClose = () => {
    setEditingNodeId(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Configure API Endpoint</h2>
          <button
            onClick={handleClose}
            className="text-2xl font-bold hover:text-gray-300 transition"
          >
            ✕
          </button>
        </div>

        
        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Node Info */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600">Endpoint</p>
            <p className="font-mono text-sm font-semibold">{data.endpoint}</p>
            <p className="text-xs text-gray-600 mt-2">Method</p>
            <p className="font-semibold text-sm">{data.method}</p>
            {data.summary && (
              <>
                <p className="text-xs text-gray-600 mt-2">Description</p>
                <p className="text-sm text-gray-700">{data.summary}</p>
              </>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-300">
            <button
              onClick={() => setActiveTab("headers")}
              className={`px-4 py-2 font-medium transition ${activeTab === "headers"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Headers
            </button>
            <button
              onClick={() => setActiveTab("params")}
              className={`px-4 py-2 font-medium transition ${activeTab === "params"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Query Params
            </button>
            <button
              onClick={() => setActiveTab("body")}
              className={`px-4 py-2 font-medium transition ${activeTab === "body"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Body
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "headers" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Request Headers</h3>
              <div className="space-y-3 mb-4">
                {Object.entries(data.headers || {}).map(([key, value]) => (
                  <div key={key} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Header name"
                      value={key}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                    <input
                      type="text"
                      placeholder="Header value"
                      value={value}
                      onChange={(e) => handleHeaderChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={() => handleRemoveHeader(key)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddHeader}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                + Add Header
              </button>
            </div>
          )}

          {activeTab === "params" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Query Parameters</h3>
              <div className="space-y-3 mb-4">
                {Object.entries(data.queryParams || {}).map(([key, value]) => (
                  <div key={key} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Parameter name"
                      value={key}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                    <input
                      type="text"
                      placeholder="Parameter value"
                      value={value}
                      onChange={(e) => handleParamChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={() => handleRemoveParam(key)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddParam}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                + Add Parameter
              </button>
            </div>
          )}

          {activeTab === "body" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Request Body</h3>
              {data.requestBody ? (
                <textarea
                  value={JSON.stringify(data.body || {}, null, 2)}
                  onChange={handleBodyChange}
                  placeholder="Request body (JSON format)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm min-h-64"
                />
              ) : (
                <p className="text-gray-500 italic">This endpoint does not have a request body</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 border-t border-gray-300 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
