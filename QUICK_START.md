# Quick Start Guide - API Workflow Builder

## 🚀 Getting Started (5 minutes)

### 1. Start the Dev Server

```bash
cd /home/ayush/Desktop/openapi-workflow-demo
npm run dev
```

Then open: **http://localhost:5173/**

### 2. Load a Sample API Spec

The app will show an upload screen. You have 3 options:

**Option A: Load the sample spec**
```
Copy this URL and paste it:
/public/sample-api.json

Or use the File Upload button to select public/sample-api.json
```

**Option B: Use a public API**
```
Try: https://petstore.swagger.io/v2/swagger.json
Or: https://api.github.com/repos/swagger-api/swagger-petstore/contents/swagger.yaml
```

**Option C: Create your own OpenAPI spec**
```json
{
  "openapi": "3.0.0",
  "info": { "title": "My API", "version": "1.0.0" },
  "paths": {
    "/users": {
      "get": {
        "summary": "Get users",
        "responses": { "200": { "description": "Success" } }
      }
    }
  }
}
```

### 3. Explore the Interface

Once loaded, you'll see:

```
┌─────────────────────────────────────────────────────┐
│  🔗 API Workflow Builder    [Export Workflow] [Show/Hide] │
├──────────────┬─────────────────────────┬──────────────┤
│              │                         │              │
│  API LIST    │    CANVAS (React Flow)  │   CONFIG     │
│              │                         │              │
│  • GET /users│   ┌─────────┐           │  Headers:    │
│  • POST /users│  │ GET /users           │  Content-Type│
│  • GET /courses│ └─────────┘            │              │
│              │       ↓                 │  Query Params:│
│              │   ┌─────────┐           │  limit: 10   │
│              │  │POST /users           │              │
│              │   └─────────┘           │ Body:        │
│              │                         │ (JSON Editor)│
├──────────────┴─────────────────────────┴──────────────┤
│  💡 Tip: Drag from left → drop on canvas              │
└──────────────────────────────────────────────────────┘
```

### 4. Build Your Workflow

**Step 1: Drag Endpoints**
- Click and drag any API endpoint from the LEFT panel
- Drop it onto the CANVAS in the center

**Step 2: Connect Endpoints**
- Move mouse to the RIGHT edge of a node (you'll see a connection point)
- Click and drag to the LEFT edge of another node
- This creates a connection/edge

**Step 3: Configure Each Node**
- Click any node on the canvas to select it
- Use the RIGHT panel to configure:
  - **Headers**: Add Authorization, Content-Type, etc.
  - **Query Params**: Add filter, limit, offset, etc.
  - **Body**: Enter JSON for POST/PUT requests

**Step 4: Export Your Workflow**
- Click **"📤 Export Workflow"** button (top right)
- Choose:
  - **Download as YAML** - Best for sharing/automation
  - **Download as JSON** - Best for importing elsewhere
  - **View YAML** - Preview in browser

### 5. Exported Workflow Example

When you export, you get a file like:

```yaml
version: 1.0
nodes:
  - id: node-1
    endpoint: /users
    method: GET
    headers:
      Authorization: Bearer token123
    queryParams:
      limit: '10'
    body: null
  - id: node-2
    endpoint: /posts
    method: POST
    headers:
      Authorization: Bearer token123
    body:
      title: New Post
edges:
  - source: node-1
    target: node-2
```

## 📚 Features

| Feature | How to Use |
|---------|-----------|
| **Load APIs** | Paste OpenAPI URL, upload .json/.yaml, or paste spec |
| **Drag & Drop** | Drag from left panel → drop on canvas |
| **Configure** | Click node → edit Headers/Params/Body in right panel |
| **Connect** | Drag from right edge of node to left edge of another |
| **Export** | Click Export button → choose YAML or JSON |
| **Zoom** | Mouse wheel or use controls in bottom-left |
| **Pan** | Click and drag the canvas background |

## 🎯 Common Workflows

### Workflow 1: Get Data Then Create

```
1. GET /users?id=123     (Get user details)
   └─> Store: userId = response.id

2. POST /posts           (Create post for that user)
   ├─ Headers: Authorization: Bearer token
   └─ Body: { "userId": "${userId}", "title": "Hello" }
```

### Workflow 2: Sequential API Calls

```
1. POST /login           (Authenticate)
   └─> Get: token = response.token

2. GET /profile          (Get profile with token)
   ├─ Headers: Authorization: Bearer ${token}
   └─> Store: userId = response.userId

3. GET /settings/{userId}  (Get user settings)
   └─ Headers: Authorization: Bearer ${token}
```

### Workflow 3: Parallel Calls (Connect to same node)

```
1. POST /data
   ├─> GET /process1
   └─> GET /process2
```

## 🛠️ Troubleshooting

### Issue: "Failed to parse OpenAPI"
**Solution**: Make sure your OpenAPI spec is valid. Test at: https://www.swagger.io/tools/swagger-editor/

### Issue: Dragging doesn't work
**Solution**: 
- Make sure you're dragging FROM the left panel
- Drop ON the white canvas area in the middle
- Not on the right panel

### Issue: Can't see nodes on canvas
**Solution**: 
- Press the "Fit View" button (bottom-left)
- Or use mouse wheel to zoom out

### Issue: Export button is grayed out
**Solution**:
- Make sure you've added at least one node to the canvas
- Refresh if needed

### Issue: Browser showing "OpenAPI spec not valid"
**Solution**:
- Use a validated spec from: https://petstore.swagger.io/
- Or paste your own valid OpenAPI 3.0 JSON/YAML

## 📖 Example OpenAPI Spec to Test

```json
{
  "openapi": "3.0.0",
  "info": { "title": "Test API", "version": "1.0" },
  "paths": {
    "/authenticate": {
      "post": {
        "summary": "Login",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "properties": {
                  "username": { "type": "string" },
                  "password": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": { "200": { "description": "Success" } }
      }
    },
    "/data": {
      "get": {
        "summary": "Get data",
        "parameters": [
          { "name": "token", "in": "header", "required": true }
        ],
        "responses": { "200": { "description": "Success" } }
      }
    }
  }
}
```

## 📱 Keyboard Shortcuts

| Action | Keyboard |
|--------|----------|
| Load Spec | Ctrl+Enter (in textarea) |
| Zoom In | Mouse Wheel Up |
| Zoom Out | Mouse Wheel Down |
| Pan | Click + Drag background |
| Select Node | Click on node |
| Delete Node | Select + Delete key |
| Fit View | Ctrl+0 or button |

## 🔗 Architecture Overview

```
User Upload
    ↓
Swagger Parser (Parse OpenAPI)
    ↓
Extract Endpoints (Left Panel)
    ↓
Drag to Canvas (React Flow)
    ↓
Configure Node (Right Panel)
    ↓
Connect Nodes (Edges)
    ↓
Export as YAML/JSON
```

## 💾 Files Created

- `src/components/` - React components
- `src/utils/` - Helper functions
- `src/store/` - Zustand state management
- `public/sample-api.json` - Sample OpenAPI spec

## 🚀 Next Steps

1. **Load the sample spec** from `public/sample-api.json`
2. **Create nodes** by dragging endpoints
3. **Configure** each node with headers/params
4. **Connect** them to create a workflow
5. **Export** as YAML

Enjoy! 🎉
