export const services = [
      { id: "svc-1", name: "Authentication Service", category: "Core" },
      { id: "svc-2", name: "Payment Gateway", category: "Finance" },
      { id: "svc-3", name: "Email Service", category: "Communication" },
      { id: "svc-4", name: "Analytics Engine", category: "Data" },
    ];
  
   export  const Target = [
      { id: "ep-1", name: "User Login API", category: "Auth" },
      { id: "ep-2", name: "Process Payment", category: "Payments" },
      { id: "ep-3", name: "Send Notification", category: "Alerts" },
    ];

// connectors are available Camel components / utilities that can be used
// in workflows in addition to regular HTTP endpoints.
export const connectors = [
  { id: "conn-1", name: "MongoDB", category: "Database", component: "mongodb" },
  { id: "conn-2", name: "Kafka", category: "Messaging", component: "kafka" },
  { id: "conn-3", name: "File", category: "Storage", component: "file" },
  { id: "conn-4", name: "HTTP (Generic)", category: "Transport", component: "http" },
  { id: "conn-5", name: "Timer/Delay", category: "Utility", component: "timer" }
];