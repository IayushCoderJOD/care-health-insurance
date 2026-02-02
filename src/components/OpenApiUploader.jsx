import React, { useState } from "react";
import { parseOpenAPI, extractEndpoints } from "../utils/openApiParser";
import useWorkflowStore from "../store/workflowStore";

export default function OpenApiUploader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");

  const setOpenApiSpec = useWorkflowStore((state) => state.setOpenApiSpec);
  const setEndpoints = useWorkflowStore((state) => state.setEndpoints);
  const reset = useWorkflowStore((state) => state.reset);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const spec = await parseOpenAPI(file);
      const endpoints = extractEndpoints(spec);

      setOpenApiSpec(spec);
      setEndpoints(endpoints);
      setInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasteOrUrl = async () => {
    if (!input.trim()) {
      setError("Please enter JSON, YAML, or a URL");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const spec = await parseOpenAPI(input);
      const endpoints = extractEndpoints(spec);

      setOpenApiSpec(spec);
      setEndpoints(endpoints);
      setInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handlePasteOrUrl();
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Load OpenAPI Spec</h2>

      {/* File Upload */}
      <div className="mb-6">
        <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
          Upload OpenAPI File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".json,.yaml,.yml"
          onChange={handleFileUpload}
          disabled={loading}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 disabled:opacity-50"
        />
        <p className="text-xs text-gray-500 mt-2">Supports .json, .yaml, .yml files</p>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      {/* Paste or URL */}
      <div className="mb-4">
        <label htmlFor="spec-textarea" className="block text-sm font-medium mb-2">
          Paste JSON/YAML or OpenAPI URL
        </label>
        <textarea
          id="spec-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Paste OpenAPI spec or enter URL..."
          disabled={loading}
          className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handlePasteOrUrl}
          disabled={loading || !input.trim()}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Loading..." : "Load Spec"}
        </button>
        <button
          onClick={() => {
            reset();
            setInput("");
            setError(null);
          }}
          className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition"
        >
          Clear
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700 text-sm">
          💡 Tip: Press Ctrl+Enter to quickly load the spec from the textarea
        </p>
      </div>
    </div>
  );
}
