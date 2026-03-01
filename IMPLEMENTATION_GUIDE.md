# 🔗 API Workflow Builder

A visual API workflow orchestration tool built with React. Design, configure, and connect APIs from an OpenAPI spec, then export your workflow as YAML or JSON.

## Features

✅ **Load OpenAPI Specs** - Upload JSON/YAML files or paste OpenAPI specs directly  
✅ **Visual Canvas** - Drag & drop API endpoints onto the canvas using React Flow  
✅ **Connect APIs** - Draw connections between endpoints to define workflow order  
✅ **Configure Endpoints** - Edit headers, query params, and request body for each endpoint  
✅ **Export Workflows** - Download your workflow as YAML, JSON, or view it inline  

## Project Structure

```
src/
├── components/
│   ├── OpenApiUploader.jsx      # Upload/paste OpenAPI specs
│   ├── ApiListPanel.jsx         # Draggable endpoint list (left sidebar)
│   ├── ApiNode.jsx              # Custom node component for React Flow
│   ├── WorkflowCanvas.jsx       # Main canvas with React Flow
│   ├── ConfigPanel.jsx          # Configuration panel (right sidebar)
│   └── ExportButton.jsx         # Export workflow button
├── utils/
│   ├── openApiParser.js         # Parse OpenAPI specs
│   └── yamlExporter.js          # Export workflow as YAML/JSON
├── store/
│   └── workflowStore.js         # Zustand state management
├── App.jsx                      # Main app component
└── index.css                    # Tailwind CSS styles
```

## Tech Stack

- **React 18** - UI framework
- **React Flow** - Canvas and node management
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Swagger Parser** - OpenAPI parsing
- **js-yaml** - YAML handling
- **Vite** - Build tool

## Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

The app will run on `http://localhost:5173/`

## Usage

### 1. Load an OpenAPI Spec

**Option A: Upload a file**
- Click "Upload OpenAPI File" 
- Select a `.json` or `.yaml` file from your computer

**Option B: Paste specification**
- Paste OpenAPI JSON/YAML in the textarea
- Or enter a URL to a public OpenAPI spec
- Press `Ctrl+Enter` or click "Load Spec"

### 2. Explore Endpoints

Once loaded, you'll see:
- **Left Panel**: List of all API endpoints extracted from the spec
- Each endpoint shows:
  - HTTP method (GET, POST, etc.) with color coding
  - Endpoint path
  - Summary/description
  - Tags
  - Number of parameters and request body info

### 3. Build Your Workflow

**Drag & Drop**
- Drag any endpoint from the left panel
- Drop it onto the canvas in the center
- Each endpoint becomes a **node** on the canvas

**Create Connections**
- Hover over the right side of a node (exit point)
- Click and drag to another node's left side (entry point)
- This defines the workflow order/flow

**Pan & Zoom**
- Use mouse wheel to zoom
- Click and drag background to pan
- Use controls in bottom-left corner

### 4. Configure Nodes

**Select a Node**
- Click any node on the canvas to select it
- The right panel will show configuration options

**Configure Headers**
- Click the "Headers" tab
- Add custom headers for the API call
- Each header has a name and value

**Configure Query Parameters**
- Click the "Query Params" tab
- Add query parameters that will be sent with the request

**Configure Request Body**
- Click the "Body" tab (if the endpoint has a request body)
- Enter JSON data for the request

### 5. Export Your Workflow

Click the **"📤 Export Workflow"** button to choose export format:

**Download as YAML**
```yaml
version: 1.0
nodes:
  - id: node-123
    endpoint: /users
    method: GET
    headers: {}
    queryParams: {}
edges:
  - source: node-123
    target: node-456
```

**Download as JSON**
```json
{
  "version": "1.0",
  "nodes": [...],
  "edges": [...]
}
```

**View YAML** - Preview directly in the browser

## API Workflow Example

### Scenario: User Signup and Enrollment

1. **Create User** (POST /users)
   - Body: `{ "name": "John", "email": "john@example.com" }`

2. **Get User** (GET /users/{userId})
   - Extracts userId from previous response

3. **Enroll in Course** (POST /enrollments)
   - Uses userId and courseId

4. **Export** the workflow to share or automate

   > **Connectors:** The builder also includes non-HTTP "connector" nodes
   > (MongoDB, Kafka, timer, etc.). These appear in a separate section of the
   > API list when the OpenAPI spec contains an `x-connectors` declaration or
   > when defaults are provided. Connector nodes are rendered with a purple
   > style and have their own configuration modal (see *ConnectorNode* below).


## Component Details

### OpenApiUploader
Handles loading OpenAPI specs from files or URLs.
- Supports `.json`, `.yaml`, `.yml` files
- Validates specs using `swagger-parser`
- Extracts all endpoints automatically

### ApiListPanel
Left sidebar displaying draggable endpoints.
- Color-coded by HTTP method
- Shows endpoint path, summary, tags
- Displays parameter and body info

### WorkflowCanvas
React Flow canvas for visual workflow design.
- Nodes = API endpoints
- Edges = connections between endpoints
- Supports drag, zoom, pan operations

### ConfigPanel
Right sidebar for node configuration.
- Tabbed interface (Headers, Params, Body)
- Add/remove headers and parameters
- JSON editor for request bodies

### ExportButton
Exports workflow to YAML or JSON format.
- Downloads file or displays inline
- Includes all node and edge data

## State Management (Zustand)

The app uses Zustand for state management:

```javascript
// Access workflow state
const nodes = useWorkflowStore((state) => state.nodes);
const edges = useWorkflowStore((state) => state.edges);

// Update state
useWorkflowStore.setState({ nodes: [...] });

// Use actions
useWorkflowStore((state) => state.addNode(newNode));
```

## Sample OpenAPI Spec

A sample `sample-api.json` is included in the `public/` folder with:
- User management endpoints (GET, POST, PUT, DELETE)
- Course endpoints
- Enrollment endpoints
- Health check endpoint

**To test**: Load the sample spec from `public/sample-api.json`

## Exported Workflow Format

```yaml
version: 1.0
nodes:
  - id: node-1
    type: apiNode
    position: { x: 100, y: 150 }
    data:
      endpoint: /users
      method: GET
      summary: Get all users
      headers:
        Authorization: Bearer token123
      queryParams:
        limit: '10'
      pathParams: {}
      body: null
edges:
  - id: edge-1
    source: node-1
    target: node-2
```

## Advanced Features (Future)

- 🔄 Workflow execution/testing
- 📊 Response mapping between nodes
- 🔐 Environment variables & secrets
- 💾 Save/load workflows
- 🔗 API integration with real endpoints
- 📝 Workflow templates

## Troubleshooting

### "Failed to parse OpenAPI"
- Ensure your spec is valid OpenAPI 3.0 JSON/YAML
- Try using an OpenAPI validator: https://www.swagger.io/tools/swagger-editor/

### Drag & drop not working
- Make sure you're dragging from the left panel
- Drag to the canvas area in the center

### Can't see nodes on canvas
- Use the "Fit View" button (bottom-left controls)
- Use the zoom controls or mouse wheel

### Export not working
- Ensure you have at least one node
- Check browser console for errors

## Development

### Build for production
```bash
npm run build
```

### Run ESLint
```bash
npm run lint
```

### File Structure
- Components use React Hooks
- State managed via Zustand
- Styling with Tailwind CSS
- No external backend required (client-side only)

## License

MIT

## Next Steps

1. **Test the app**: Load `public/sample-api.json`
2. **Drag endpoints** to the canvas
3. **Configure** each endpoint with headers/params
4. **Connect** them to create a workflow
5. **Export** as YAML to see the structure

Enjoy building your API workflows! 🚀
