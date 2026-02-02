import React, { useState } from "react";
import useWorkflowStore from "../store/workflowStore";
import { workflowToYAML, downloadYAML, downloadJSON } from "../utils/yamlExporter";
import DetailsViewerModal from "../utils/DetailsViewerModal";

export default function ExportButton() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info");

  const workflow = { nodes, edges };

  const handleExportYAML = () => {
    try {
      const yamlContent = workflowToYAML(workflow);
      downloadYAML(yamlContent);
      setDropdownOpen(false);
    } catch (error) {
      alert("Failed to export YAML: " + error.message);
    }
  };

  const handleExportJSON = () => {
    try {
      downloadJSON(workflow);
      setDropdownOpen(false);
    } catch (error) {
      alert("Failed to export JSON: " + error.message);
    }
  };

  const handleShowYAML = () => {
    try {
      const yamlContent = workflowToYAML(workflow);
      setModalTitle("Workflow YAML");
      setModalData(yamlContent);
      setModalType("info");
      setModalOpen(true);
      setDropdownOpen(false);
    } catch (error) {
      alert("Failed to generate YAML: " + error.message);
    }
  };

  const handleShowJSON = () => {
    try {
      setModalTitle("Workflow JSON");
      setModalData(workflow);
      setModalType("info");
      setModalOpen(true);
      setDropdownOpen(false);
    } catch (error) {
      alert("Failed to generate JSON: " + error.message);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition flex items-center gap-2"
      >
        📤 Export Workflow
        <span className="text-xs">▼</span>
      </button>

      {dropdownOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-5"
            onClick={() => setDropdownOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <button
              onClick={handleExportYAML}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm font-medium flex items-center gap-2"
            >
              📄 Download as YAML
            </button>
            <button
              onClick={handleExportJSON}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm font-medium flex items-center gap-2 border-t border-gray-200"
            >
              📋 Download as JSON
            </button>
            <button
              onClick={handleShowYAML}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm font-medium flex items-center gap-2 border-t border-gray-200"
            >
              👀 View YAML
            </button>
            <button
              onClick={handleShowJSON}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm font-medium flex items-center gap-2 border-t border-gray-200"
            >
              👁️ View JSON
            </button>
          </div>
        </>
      )}

      {/* Modal - Rendered in JSX, controlled by state */}
      <DetailsViewerModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        data={modalData}
        type={modalType}
        message="Preview of your workflow configuration"
      />
    </div>
  );
}