import React, { useEffect } from "react";
import "./App.css";
import ApiListPanel from "./components/ApiListPanel";
import WorkflowCanvas from "./components/WorkflowCanvas";
import ConfigPanel from "./components/ConfigPanel";
import ExportButton from "./components/ExportButton";
import useWorkflowStore from "./store/workflowStore";
import sampleApi from "./constants/sampleApi.json";
import { extractEndpoints } from "./utils/openApiParser";

let initialized = false;

function App() {
  const endpoints = useWorkflowStore((state) => state.endpoints);

  // Initialize on mount - only once
  useEffect(() => {
    if (!initialized) {
      initialized = true;
      try {
        const extracted = extractEndpoints(sampleApi);
        useWorkflowStore.setState({
          openApiSpec: sampleApi,
          endpoints: extracted,
        });
      } catch (err) {
        console.error("Failed to load sample API:", err);
      }
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Visual API Orchestration & Configuration
            </p>
          </div>
          <div className="flex gap-3">
            {endpoints?.length > 0 && <ExportButton />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-full gap-0">
        {/* Left Panel */}
        <div className="w-80 bg-white border-r border-gray-300 overflow-hidden">
          <ApiListPanel />
        </div>

        {/* Canvas - Center */}
        <div className="flex-1 relative">
          <WorkflowCanvas />
        </div>

        {/* Right Panel */}
        {/* <div className="w-96 bg-white border-l border-gray-300 overflow-hidden">
          <ConfigPanel />
        </div> */}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 px-6 py-2 text-xs text-center">
        <p>
          💡 Tip: Drag endpoints to canvas, click on nodes to configure them in the right panel
        </p>
      </footer>
    </div>
  );
}

export default App;
