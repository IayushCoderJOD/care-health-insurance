import { Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./Dashboard.jsx";
import CreateNewWorkflow from "./CreateNewWorkflow";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create-workflow" element={<CreateNewWorkflow />} />
    </Routes>
  );
}

export default App;