# Developer README

## 🎯 Project Overview

**API Workflow Builder** - A visual, drag-and-drop interface to design, configure, and export OpenAPI workflows as YAML/JSON.

### Status: ✅ MVP Complete & Production Ready

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Server runs on: `http://localhost:5173/`

---

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── OpenApiUploader.jsx
│   ├── ApiListPanel.jsx
│   ├── WorkflowCanvas.jsx
│   ├── ApiNode.jsx
│   ├── ConfigPanel.jsx
│   └── ExportButton.jsx
├── utils/                   # Helper functions
│   ├── openApiParser.js     # OpenAPI validation & parsing
│   └── yamlExporter.js      # Export to YAML/JSON
├── store/                   # State management
│   └── workflowStore.js     # Zustand store
├── App.jsx                  # Main app component
├── index.css                # Tailwind + global styles
└── main.jsx                 # Entry point
```

---

## 🧩 Component Guide

### OpenApiUploader.jsx
Handles loading OpenAPI specs from:
- File upload (.json, .yaml, .yml)
- URL input
- Raw paste (JSON/YAML)

**Key Functions:**
- `parseOpenAPI()` - Validates & parses specs
- `extractEndpoints()` - Gets all endpoints
- Zustand integration for state updates

### ApiListPanel.jsx
Left sidebar displaying draggable API endpoints.

**Features:**
- Color-coded by HTTP method
- Drag event handling
- Shows metadata (params, body, tags)
- Responsive scrolling

### WorkflowCanvas.jsx
React Flow canvas for workflow design.

**Features:**
- Node placement & movement
- Connection creation
- Zoom & pan controls
- Minimap display
- State synchronization with Zustand

### ApiNode.jsx
Custom React Flow node component.

**Customizable:**
- Node styling
- Handle positions (left/right/top/bottom)
- Data display format
- Color scheme per HTTP method

### ConfigPanel.jsx
Right sidebar for node configuration.

**Tabs:**
- Headers - Add/edit/remove headers
- Query Params - Configure query parameters
- Body - JSON editor for request body

### ExportButton.jsx
Dropdown menu for workflow export.

**Options:**
- Download YAML
- Download JSON
- View YAML inline

---

## 🔧 State Management (Zustand)

Store location: [src/store/workflowStore.js](src/store/workflowStore.js)

### State Structure

```javascript
{
  openApiSpec: Object,        // Full OpenAPI specification
  endpoints: Array,           // Extracted endpoints
  nodes: Array,               // Workflow nodes
  edges: Array,               // Node connections
  selectedNodeId: String      // Currently selected node
}
```

### Available Actions

```javascript
// Read state
const nodes = useWorkflowStore((state) => state.nodes);

// Use actions
const addNode = useWorkflowStore((state) => state.addNode);
const updateNode = useWorkflowStore((state) => state.updateNode);
const deleteNode = useWorkflowStore((state) => state.deleteNode);
const addEdge = useWorkflowStore((state) => state.addEdge);
const deleteEdge = useWorkflowStore((state) => state.deleteEdge);

// Get exported workflow
const workflow = useWorkflowStore((state) => state.getWorkflowJSON());

// Reset everything
const reset = useWorkflowStore((state) => state.reset);
```

---

## 🎨 Styling

### Tailwind CSS

Classes used throughout components:
- Flexbox: `flex`, `flex-col`, `gap-x`
- Sizing: `w-full`, `h-screen`, `px-4`
- Colors: `bg-blue-500`, `text-gray-700`
- Effects: `shadow-md`, `rounded-lg`, `border-2`

### CSS Files

- `src/index.css` - Global styles + Tailwind imports
- `src/App.css` - App layout styles
- Components use inline Tailwind classes

### Custom Colors per HTTP Method

```javascript
const METHOD_COLORS = {
  GET: "bg-blue-100 text-blue-800",
  POST: "bg-green-100 text-green-800",
  PUT: "bg-yellow-100 text-yellow-800",
  DELETE: "bg-red-100 text-red-800",
  PATCH: "bg-purple-100 text-purple-800",
  HEAD: "bg-gray-100 text-gray-800",
  OPTIONS: "bg-indigo-100 text-indigo-800",
};
```

---

## 🔌 React Flow Integration

### Basic Setup

```javascript
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}
```

### Custom Nodes

Passed as `nodeTypes` prop:

```javascript
const nodeTypes = {
  apiNode: ApiNode,
};

<ReactFlow nodeTypes={nodeTypes} {...props} />;
```

### Handle Positions

```javascript
import { Handle, Position } from "reactflow";

<Handle type="target" position={Position.Left} />   // Input
<Handle type="source" position={Position.Right} />  // Output
```

---

## 📝 OpenAPI Parser Utils

### Main Functions

**parseOpenAPI(input)**
```javascript
// Accepts: File, URL string, or raw JSON/YAML string
const spec = await parseOpenAPI(fileOrString);
```

**extractEndpoints(spec)**
```javascript
// Returns array of endpoints with metadata
const endpoints = extractEndpoints(spec);
// [
//   { id, path, method, summary, parameters, requestBody, ... }
// ]
```

**endpointToNodeData(endpoint)**
```javascript
// Convert endpoint to React Flow node data
const nodeData = endpointToNodeData(endpoint);
```

---

## 💾 Export & YAML

### Exported Workflow Format

```yaml
version: 1.0
nodes:
  - id: node-123
    type: apiNode
    position: { x: 100, y: 150 }
    data:
      endpoint: /users
      method: GET
      summary: Get all users
      headers: {}
      queryParams: {}
      body: null
edges:
  - id: edge-1
    source: node-123
    target: node-456
```

### Export Functions

```javascript
import { workflowToYAML, downloadYAML, downloadJSON } from "../utils/yamlExporter";

// Convert to YAML string
const yamlString = workflowToYAML(workflow);

// Download YAML file
downloadYAML(yamlString, "workflow.yaml");

// Download JSON file
downloadJSON(workflow, "workflow.json");
```

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Structure
```
src/
├── components/
│   └── __tests__/
│       ├── OpenApiUploader.test.jsx
│       ├── ApiNode.test.jsx
│       └── WorkflowCanvas.test.jsx
└── utils/
    └── __tests__/
        ├── openApiParser.test.js
        └── yamlExporter.test.js
```

### Example Test
```javascript
import { render, screen } from "@testing-library/react";
import ApiNode from "../ApiNode";

describe("ApiNode", () => {
  it("renders endpoint path", () => {
    render(<ApiNode data={{ endpoint: "/users", method: "GET" }} />);
    expect(screen.getByText("/users")).toBeInTheDocument();
  });
});
```

---

## 🚀 Performance Optimization

### Code Splitting
```javascript
import { lazy, Suspense } from "react";

const Canvas = lazy(() => import("./Canvas"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Canvas />
    </Suspense>
  );
}
```

### Memoization
```javascript
import { memo } from "react";

const ApiNode = memo(
  function ApiNode({ data }) {
    return <div>{data.endpoint}</div>;
  },
  (prev, next) => prev.data === next.data
);
```

---

## 🔒 Accessibility

### WCAG 2.1 Compliance

✅ Keyboard Navigation
- Tab through elements
- Enter/Space to activate
- Arrow keys for navigation

✅ ARIA Labels
```javascript
<button
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  aria-label="Add node"
>
  Add
</button>
```

✅ Color Contrast
- Text meets AA standards
- Method colors are distinct

---

## 🐛 Debugging

### Enable Console Logging

```javascript
// src/utils/openApiParser.js
const DEBUG = true;

function log(msg, data) {
  if (DEBUG) console.log(`[Parser] ${msg}`, data);
}
```

### Browser DevTools

1. **React DevTools** - Inspect components
2. **Redux DevTools** - View state changes
3. **Network Tab** - Check API calls
4. **Console** - Error messages

### Common Issues

| Issue | Solution |
|-------|----------|
| Drag not working | Check drag handlers in ApiListPanel |
| Nodes not appearing | Check React Flow setup in Canvas |
| State not updating | Check Zustand action calls |
| Styles not applying | Clear Tailwind cache, restart dev |

---

## 📚 File Reference

### Key Files to Know

| File | Purpose | Lines |
|------|---------|-------|
| [src/App.jsx](src/App.jsx) | Main layout | 70 |
| [src/store/workflowStore.js](src/store/workflowStore.js) | State management | 60 |
| [src/components/WorkflowCanvas.jsx](src/components/WorkflowCanvas.jsx) | React Flow | 80 |
| [src/utils/openApiParser.js](src/utils/openApiParser.js) | OpenAPI logic | 150 |
| [src/utils/yamlExporter.js](src/utils/yamlExporter.js) | Export logic | 60 |

---

## 🔄 Development Workflow

### 1. Local Development
```bash
npm run dev
# Edit files → auto-reload in browser
```

### 2. Linting & Type Checking
```bash
npm run lint      # Check for errors
npm run format    # Auto-format code
```

### 3. Build & Test
```bash
npm run build     # Production build
npm run preview   # Test production build
```

### 4. Deployment
```bash
# Deploy to Vercel
vercel

# Deploy to GitHub Pages
npm run build
npx gh-pages -d dist
```

---

## 🎯 Contributing

### Code Style
- Use ES6+ syntax
- Component-based architecture
- Functional components with hooks
- Descriptive variable names

### Adding Features

1. Create component/util file
2. Import in appropriate parent
3. Update store if needed
4. Test in browser
5. Update documentation

### Example: Add New Export Format

```javascript
// 1. Add to yamlExporter.js
export function workflowToXML(workflow) {
  // Implementation
}

// 2. Update ExportButton.jsx
<button onClick={handleExportXML}>
  📋 Download as XML
</button>

// 3. Update docs
```

---

## 📦 Dependencies

### Core
- **react**: UI framework
- **react-dom**: React for web
- **reactflow**: Node-based UI

### State & Data
- **zustand**: State management
- **js-yaml**: YAML parsing
- **axios**: HTTP (if needed)

### Dev Dependencies
- **vite**: Build tool
- **tailwindcss**: Utility CSS
- **postcss**: CSS processing
- **autoprefixer**: CSS vendor prefixes

### API Parsing
- **@apidevtools/swagger-parser**: OpenAPI validation
- **@apidevtools/json-schema-ref-parser**: JSON Schema resolution

---

## 🔗 Useful Resources

- [React Docs](https://react.dev)
- [React Flow Docs](https://reactflow.dev/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [OpenAPI Spec](https://spec.openapis.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Guide](https://vitejs.dev/)

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- `Ctrl+Enter` - Load spec from textarea
- `Mouse Wheel` - Zoom on canvas
- `Click + Drag` - Pan canvas
- `Tab` - Navigate elements

### Performance
- Use React DevTools Profiler
- Memoize expensive components
- Code split large features
- Check bundle size: `npm run build`

### Debugging
- Use browser DevTools (F12)
- React DevTools extension
- Console logging
- Network tab for API calls

---

## 🎉 You're All Set!

The project is production-ready. Start developing:

```bash
npm run dev
# Navigate to http://localhost:5173/
# Load a sample OpenAPI spec
# Build your first workflow!
```

Happy coding! 🚀

---

**Questions?** Check [QUICK_START.md](QUICK_START.md), [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md), or [ADVANCED.md](ADVANCED.md)
