import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import ApiListPanel from "./components/ApiListPanel";
import WorkflowCanvas from "./components/WorkflowCanvas";
import ExportButton from "./components/ExportButton";
import useWorkflowStore from "./store/workflowStore";
import sampleApi from "./constants/sampleApi.json";
import { extractEndpoints } from "./utils/openApiParser";
import TagMappingModal from "./utils/TagMappingModal";
import { Target } from "./constants/constants";
import About from "./pages/About.jsx";

let initialized = false;

function App() {
  const endpoints = useWorkflowStore((state) => state.endpoints);

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
    <Routes>
      {/* /administration */}
      <Route
        path="/"
        element={
          <div className="h-screen flex flex-col bg-gray-100">
            <header className="bg-gray-900 text-white px-6 py-3 shadow-md">
              <HeaderDetails endpoints={endpoints} />
            </header>

            <div className="flex flex-1 overflow-hidden">
              <div className="w-80 bg-white border-r border-gray-200">
                <ApiListPanel />
              </div>

              <div className="flex-1 relative bg-gray-50">
                <WorkflowCanvas />
              </div>
            </div>
          </div>
        }
      />

      {/* /administration/about */}
      <Route path="about" element={<About />} />
    </Routes>
  );
}

export default App;





export const HeaderDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <h1
        onClick={() => navigate(".")}
        className="text-sm font-semibold cursor-pointer"
      >
        Visual API Orchestration & Configuration
      </h1>

      <button
        onClick={() => navigate("about")}
        className="px-4 py-1.5 rounded-md border border-gray-400 text-gray-200 text-sm font-medium hover:border-white hover:text-white transition"
      >
        about
      </button>

      {/* rest unchanged */}
    </div>
  );
};