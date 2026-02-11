import React, { useEffect, useState } from "react";
import "./App.css";
import ApiListPanel from "./components/ApiListPanel";
import WorkflowCanvas from "./components/WorkflowCanvas";
import ConfigPanel from "./components/ConfigPanel";
import ExportButton from "./components/ExportButton";
import useWorkflowStore from "./store/workflowStore";
import sampleApi from "./constants/sampleApi.json";
import { extractEndpoints } from "./utils/openApiParser";
import TagMappingModal from "./utils/TagMappingModal";
import { services, Target } from "./constants/constants";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
let initialized = false;

function App() {
  const endpoints = useWorkflowStore((state) => state.endpoints);
  const selectedNode = useWorkflowStore((state) => state.selectedNodeId);
  const [toggleMenu, setToggleMenu] = useState(false);
  console.log("Workflow Store State:", selectedNode);


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
      <header className= " flex bg-gray-900 text-white justify-between px-6 py-3 shadow-md">
      <button onClick={() => setToggleMenu((prev) => !prev)} className=" w-fit m-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        {toggleMenu ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </button>
        <HeaderDetails endpoints={endpoints} selectedNode={selectedNode} />
      </header>
      <div className="flex flex-1 overflow-hidden">
        {toggleMenu && <div className="w-80 bg-white border-r border-gray-200">
          <ApiListPanel />
        </div>}

        <div className="flex-1 relative bg-gray-50">
          <WorkflowCanvas />
        </div>
      </div>
    </div>
  );
}

export default App;

const HeaderDetails = ({ endpoints , selectedNode}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const existingMappings = [
    { id: "map-1", sourceId: "svc-1", targetId: "ep-1" },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
         disabled={!selectedNode}
          onClick={() => setModalOpen(true)}
          className="px-4 py-1.5 rounded-md border border-gray-400 text-gray-200 text-sm font-medium hover:border-white hover:text-white transition"
        >
          Tag Mappings
        </button>


        {endpoints?.length > 0 && <ExportButton />}

       {selectedNode &&  <TagMappingModal
          selectedNode={selectedNode}
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
          }}
        />}
      </div>
    </div>
  );
};
