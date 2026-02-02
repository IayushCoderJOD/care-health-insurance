# Advanced Features & Configuration

## 🔧 Customization

### Styling
Edit [src/index.css](src/index.css) to customize colors, fonts, and layout.

Tailwind CSS classes are used throughout. Key files:
- [src/App.jsx](src/App.jsx) - Main layout
- [src/components/](src/components/) - Component styles

### Colors by HTTP Method

Located in each component file, customize the METHOD_COLORS object:

```javascript
const METHOD_COLORS = {
  GET: "bg-blue-100 text-blue-800",
  POST: "bg-green-100 text-green-800",
  PUT: "bg-yellow-100 text-yellow-800",
  DELETE: "bg-red-100 text-red-800",
  PATCH: "bg-purple-100 text-purple-800",
};
```

## 📊 State Management with Zustand

### Store Structure

Located in [src/store/workflowStore.js](src/store/workflowStore.js):

```javascript
const useWorkflowStore = create((set, get) => ({
  // State
  openApiSpec: null,
  endpoints: [],
  nodes: [],
  edges: [],
  selectedNodeId: null,
  
  // Actions
  addNode: (node) => { /* ... */ },
  updateNode: (nodeId, updates) => { /* ... */ },
  deleteNode: (nodeId) => { /* ... */ },
  addEdge: (edge) => { /* ... */ },
  getWorkflowJSON: () => { /* ... */ },
}));
```

### Using Store in Components

```javascript
import useWorkflowStore from "../store/workflowStore";

function MyComponent() {
  // Read state
  const nodes = useWorkflowStore((state) => state.nodes);
  
  // Use actions
  const addNode = useWorkflowStore((state) => state.addNode);
  
  return <div>{nodes?.length} nodes</div>;
}
```

## 🎨 React Flow Customization

### Node Types

Customize how nodes are rendered in [src/components/ApiNode.jsx](src/components/ApiNode.jsx):

```javascript
const METHOD_COLORS = {
  GET: "bg-blue-100 border-blue-300",
  POST: "bg-green-100 border-green-300",
  // Add more...
};

export default function ApiNode({ data, isSelected }) {
  return (
    <div className={classNames}>
      {/* Custom node UI */}
    </div>
  );
}
```

### Handle Positions

Modify handle positions in ApiNode.jsx:

```javascript
<Handle type="target" position={Position.Left} />    // Input
<Handle type="source" position={Position.Right} />   // Output
// Or use Top/Bottom for vertical layout
```

### Canvas Controls

Edit [src/components/WorkflowCanvas.jsx](src/components/WorkflowCanvas.jsx):

```javascript
<ReactFlow nodes={nodes} edges={edges}>
  <Background color="#aaa" gap={16} />
  <Controls />
  <MiniMap />
</ReactFlow>
```

## 🔄 API Integration (Future)

Currently, workflows are designed only. To integrate real API execution:

### Step 1: Add Execution Engine

```javascript
// utils/executionEngine.js
export async function executeWorkflow(workflow) {
  for (const node of workflow.nodes) {
    const response = await fetch(node.data.endpoint, {
      method: node.data.method,
      headers: node.data.headers,
      body: node.data.body ? JSON.stringify(node.data.body) : undefined,
    });
    
    // Store response for next nodes
    node.data.response = await response.json();
  }
}
```

### Step 2: Add Execute Button

```javascript
// Add to ExportButton or new ExecuteButton
const handleExecute = async () => {
  const workflow = useWorkflowStore.getState().getWorkflowJSON();
  const results = await executeWorkflow(workflow);
  console.log("Workflow executed:", results);
};
```

## 🔐 Environment Variables

Store sensitive data (API keys, tokens) safely:

### Option 1: .env file

Create `.env` in project root:
```
VITE_API_KEY=your-api-key-here
VITE_API_BASE_URL=https://api.example.com
```

Use in code:
```javascript
const apiKey = import.meta.env.VITE_API_KEY;
```

### Option 2: Store in Zustand

```javascript
const useConfigStore = create((set) => ({
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
  setHeaders: (headers) => set({ headers }),
}));
```

## 📝 Response Mapping

Pass data from one node to the next:

```javascript
// In node data
const nodeData = {
  endpoint: "/users/{userId}",
  method: "GET",
  parameters: [
    {
      name: "userId",
      mappedFrom: "node-1.response.id", // Map from previous response
    }
  ],
};
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Add Test File

Create `src/components/__tests__/ApiNode.test.jsx`:

```javascript
import { render } from "@testing-library/react";
import ApiNode from "../ApiNode";

describe("ApiNode", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <ApiNode data={{ endpoint: "/users", method: "GET" }} />
    );
    expect(getByText("/users")).toBeInTheDocument();
  });
});
```

## 🚀 Performance Optimization

### Code Splitting

For large workflows, split canvas into lazy-loaded components:

```javascript
import { lazy, Suspense } from "react";

const WorkflowCanvas = lazy(() => import("./WorkflowCanvas"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <WorkflowCanvas />
    </Suspense>
  );
}
```

### Memoization

Optimize expensive renders:

```javascript
import { memo } from "react";

const ApiNode = memo(function ApiNode({ data, isSelected }) {
  return <div>{data.endpoint}</div>;
}, (prev, next) => prev.data === next.data);

export default ApiNode;
```

## 📦 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to GitHub Pages

1. Update `vite.config.js`:
```javascript
export default {
  base: '/openapi-workflow-demo/',
}
```

2. Deploy:
```bash
npm run build
npx gh-pages -d dist
```

## 🔗 Adding More Features

### Add New Button

1. Create component:
```javascript
// src/components/MyNewFeature.jsx
export default function MyNewFeature() {
  return <button>My Feature</button>;
}
```

2. Import in App.jsx:
```javascript
import MyNewFeature from "./components/MyNewFeature";
```

3. Use:
```javascript
<MyNewFeature />
```

### Add New Panel

1. Create component with sidebar styling
2. Add to layout in App.jsx
3. Connect to Zustand store

## 📚 Resources

- **React Flow Docs**: https://reactflow.dev/
- **Zustand Docs**: https://github.com/pmndrs/zustand
- **OpenAPI Spec**: https://spec.openapis.org/
- **Tailwind CSS**: https://tailwindcss.com/
- **Vite**: https://vitejs.dev/

## 🐛 Debugging

### Enable Debug Logging

Add to [src/utils/openApiParser.js](src/utils/openApiParser.js):

```javascript
const DEBUG = true;

function log(msg, data) {
  if (DEBUG) console.log(`[OpenAPI Parser] ${msg}`, data);
}

log("Parsing OpenAPI spec", spec);
```

### React DevTools

Install React DevTools browser extension to inspect components and state.

### Redux DevTools (if using Redux)

For Zustand, use the middleware:

```javascript
import { devtools } from "zustand/middleware";

export const useWorkflowStore = create(
  devtools((set) => ({
    // ... store definition
  }))
);
```

## 🎯 Next Phase Ideas

1. **Workflow Templates** - Save and reuse workflows
2. **Variable Interpolation** - `${node-1.response.id}`
3. **Conditional Flows** - If/else logic
4. **Loop Support** - Repeat nodes
5. **Error Handling** - Retry logic
6. **Execution Engine** - Run workflows
7. **History** - Undo/redo
8. **Collaboration** - Share workflows
9. **Authentication** - OAuth, API keys
10. **Monitoring** - Logs and metrics

---

Questions? Check the [QUICK_START.md](QUICK_START.md) or [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)!
