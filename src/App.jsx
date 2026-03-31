import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";

// Lazy load route components for better initial load performance
const Dashboard = lazy(() => import("./Dashboard.jsx"));
const CreateNewWorkflow = lazy(() => import("./CreateNewWorkflow"));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#666" }}>
    Loading...
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-workflow" element={<CreateNewWorkflow />} />
      </Routes>
    </Suspense>
  );
}

export default App;