# MongoDB Workflow Testing Guide

## Quick Status Check

✅ **ExecuteButton Component**: Already imported and visible in toolbar
✅ **Backend URL Configuration**: Set to `http://localhost:8080` (correct for your setup)
✅ **ConnectorNode MongoDB**: Configured with proper backendUrl parameter
✅ **WorkflowExecutor**: Properly displays results in modal with tabs

## Step-by-Step Test

### 1. **Refresh Browser** (IMPORTANT!)
```
Press: F5 or Ctrl+R
Expected: "Execute Workflow" button appears in blue in toolbar next to Save button
```

### 2. **Create Test Workflow**
- The app loads with a sample workflow containing:
  - Node-1: POST request
  - Node-2: GET request  
  - Node-3: MongoDB connector (Write to Events)

### 3. **Click "Execute Workflow" Button**
- This opens the execution modal
- The modal shows:
  - Execution progress as "Executing..."
  - Loading spinner while running
  - Step-by-step execution display

### 4. **Test GET Users Flow**
If you want to test just getting users:

**Option A: Use Sample Workflow**
1. Click "Execute Workflow"
2. Modal opens and shows current workflow execution
3. Check all three nodes execute:
   - Node-1: POST request → should show request/response
   - Node-2: GET request → should show request/response
   - Node-3: MongoDB Write → should show request/response

**Option B: Create Minimal GET Workflow**
1. Add GET endpoint node to canvas
2. Configure it to hit `GET http://localhost:8080/users`
3. Click "Execute Workflow"
4. In modal, click "Show Details" on the GET node
5. Click "Output" tab - should see your MongoDB users array

### 5. **View Results in Modal**
The modal displays execution steps with tabs:

```
For each node:
├── Input Tab → Shows data passed to this node
├── Output Tab → Shows response data (YOUR USERS HERE)
├── Request Tab → Shows HTTP request details
└── Response Tab → Shows HTTP status code + timing

Final Section:
├── Workflow Completed step
└── Final Output → Shows last node's output (should be your users)
```

## Expected Output Structure

When you GET `/users` from your MongoDB backend, you should see:

```json
[
  {
    "_id": {"$oid": "..."},
    "name": "User Name",
    "age": 25
  },
  ...9 more users
]
```

This data will appear in:
1. **Output Tab** of the GET node step
2. **Final Output** section at the bottom

## Troubleshooting

### Issue: Button Not Visible
**Solution**: 
- Browser cache issue
- Press: `Ctrl+Shift+R` (hard refresh)
- Or: Clear browser cache and refresh

### Issue: Data Shows in Console but Not in Modal
**The modal still displays the data**, check:
1. Click "Show Details" button on nodes
2. Make sure you're on the "Output" tab
3. The Output field shows JSON data from your backend

### Issue: 404 or Connection Error
**Check**:
1. Is MongoDB backend running? `curl http://localhost:8080/users`
2. Does backend respond with users array?
3. Check browser Network tab (F12 → Network) for fetch requests

### Issue: Blank Modal or Hanging Execution
**Try**:
1. Check browser console (F12 → Console) for error messages
2. Verify MongoDB is running: `mongosh`
3. Try a fresh browser tab (Ctrl+T) and navigate to app

## Sample cURL Commands for Testing

### Check if backend is running
```bash
curl http://localhost:8080/users
```

### Should return
```json
[
  {"_id": {...}, "name": "...", "age": ...},
  {"_id": {...}, "name": "...", "age": ...}
]
```

### Insert a test user
```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","age":30}'
```

## What Happens Behind the Scenes

1. **Click Execute Workflow**
   ↓
2. **WorkflowExecutor Modal Opens**
   ↓
3. **For Each Node:**
   - ExecuteNode runs the API call
   - workflowExecutor.js makes HTTP fetch to your backend
   - Backend returns JSON data
   - Data stored in result.output
   ↓
4. **Modal Displays:**
   - Each step shows Input/Output/Request/Response tabs
   - Final Output shows last node's response (your users)

## Architecture Overview

```
Frontend Components
├── ExecuteButton.jsx
│   └── Opens WorkflowExecutor modal
│
└── WorkflowExecutor.jsx
    ├── Displays execution steps
    ├── Shows StepResultViewer for each node
    │   └── Tabs: Input | Output | Request | Response
    └── Shows Final Output section

Backend Service
└── workflowExecutor.js
    ├── executeNode() - executes single node
    ├── For MongoDB connector:
    │   ├── Reads config.backendUrl ("http://localhost:8080")
    │   ├── Makes fetch call to backend
    │   ├── Returns response in result.data
    │   └── Stores in context.results[nodeId]
    └── executeWorkflow() - chains all nodes

Store (Zustand)
├── workflowStore.js - workflow definition (nodes/edges)
└── workflowExecutionStore.js - execution state & results
```

## Configuration Locations

**Backend URL** is configured at:
1. `/src/constants/constants.js` - Default for new connectors
2. `/src/components/ConnectorNode.jsx` - Editable in modal
3. `/src/store/workflowStore.js` - Pre-configured in sample workflow

All default to: `http://localhost:8080` ✅

## Success Checklist

- [ ] Browser refreshed (F5)
- [ ] "Execute Workflow" button visible in toolbar
- [ ] Button is blue color
- [ ] Clicking button opens modal
- [ ] Modal shows workflow steps
- [ ] Can expand steps with "Show Details"
- [ ] Output tab shows JSON data
- [ ] Final Output shows users array
- [ ] Backend is accessible: `curl http://localhost:8080/users`

## Next Steps

Once testing works:

1. **Create custom workflows** by dragging nodes
2. **Configure MongoDB operations** in ConnectorNode modal
3. **Chain multiple operations** (insert → query → process)
4. **Export workflows** using Export button
5. **Monitor execution** in real-time modal

---

**Still having issues?** Check:
- Browser Network tab (F12) for actual HTTP requests
- Backend logs for errors
- Browser Console (F12) for JavaScript errors
