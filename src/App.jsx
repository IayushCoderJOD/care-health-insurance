import React, { useEffect, useState} from "react";
import "./App.css";
import ApiListPanel from "./components/ApiListPanel";
import WorkflowCanvas from "./components/WorkflowCanvas";
import ConfigPanel from "./components/ConfigPanel";
import ExportButton from "./components/ExportButton";
import useWorkflowStore from "./store/workflowStore";
import sampleApi from "./constants/sampleApi.json";
import { extractEndpoints } from "./utils/openApiParser";
import { Button } from '@mui/material';
import TagMappingModal from "./utils/TagMappingModal";

let initialized = false;

function App() {
  const endpoints = useWorkflowStore((state) => state.endpoints);
  console.log("Current endpoints in store:", endpoints);


     const [modalOpen, setModalOpen] = useState(false);
  
    // Your custom source data (Services)
    const services = [
      { id: "svc-1", name: "Authentication Service", category: "Core" },
      { id: "svc-2", name: "Payment Gateway", category: "Finance" },
      { id: "svc-3", name: "Email Service", category: "Communication" },
      { id: "svc-4", name: "Analytics Engine", category: "Data" },
    ];
  
    // Your custom target data (Endpoints/APIs)
    const Target = [
      { id: "ep-1", name: "User Login API", category: "Auth" },
      { id: "ep-2", name: "Process Payment", category: "Payments" },
      { id: "ep-3", name: "Send Notification", category: "Alerts" },
    ];
  
    // Existing mappings (if any)
    const existingMappings = [
      { id: "map-1", sourceId: "svc-1", targetId: "ep-1" },
    ];
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
        <div className="w-70 bg-white border-r border-gray-300 overflow-hidden">
          <ApiListPanel />
        </div>
        {/* Canvas - Center */}
        <div className="flex-1 relative">
          <WorkflowCanvas />
        </div>
        
      </div>

      <div className="flex justify-center bg-gray-900 text-white " >
          <Button onClick={() => setModalOpen(true)}>
            Tag Mappings
          </Button>

          <TagMappingModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            sources={services}
            targets={Target}
            initialMappings={existingMappings}
            sourceLabel="Services"
            targetLabel="Endpoints"
            title="Service to Endpoint Mapping"
            onSave={(mappings) => {
              console.log("Mappings:", mappings);
              // Save to your backend or state
            }}
          />
        </div>
    </div>
  );
}

export default App;
