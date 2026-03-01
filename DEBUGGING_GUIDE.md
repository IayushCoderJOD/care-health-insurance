# MongoDB Integration - Debugging Guide

## 📋 Complete System Verification

### Part 1: Backend Verification

#### Test 1.1: Backend Running?
```bash
curl -v http://localhost:8080/users
```

**Success** ✅:
```json
HTTP/1.1 200 OK
[
  {"_id": {...}, "name": "John", "age": 25},
  {"_id": {...}, "name": "Jane", "age": 30},
  ...
]
```

**Failure** ❌:
```
Connection refused
→ MongoDB backend not running
→ Start: npm start in backend folder
```

#### Test 1.2: Insert Works?
```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{"name":"TestUser","age":99}'
```

**Success** ✅:
```json
{"_id": "...", "name": "TestUser", "age": 99}
```

### Part 2: Frontend Code Verification

#### Check 2.1: ExecuteButton in Toolbar
1. Open app in browser
2. Press F5 (refresh)
3. Look at top toolbar next to "Save" button
4. Should see: **Execute Workflow** (blue button)

**If missing**:
```
→ Hard refresh: Ctrl+Shift+R
→ Clear browser cache
→ Close and reopen tab
```

#### Check 2.2: Backend URL Configuration
1. Click on MongoDB Connector node (purple)
2. Should open config modal
3. Look for "Backend URL" field
4. Should show: `http://localhost:8080`

**If different**:
```
→ Click field and change to: http://localhost:8080
→ Save changes
```

#### Check 2.3: Code Verification (Browser DevTools)

Press `F12` to open DevTools

**Console Tab**:
```javascript
// Run this in console to check store
useWorkflowStore.getState().workflows[0].nodes
```

Should show nodes including connector node with config:
```javascript
{
  id: "node-3",
  type: "connectorNode",
  data: {
    connector: "mongodb",
    config: {
      backendUrl: "http://localhost:8080",
      operation: "findAll"
    }
  }
}
```

**Network Tab**:
1. Click "Execute Workflow"
2. Click "Output" in modal
3. Watch Network tab
4. Should see `GET http://localhost:8080/users`
5. Response should be your users array

### Part 3: Workflow Execution Test

#### Test 3.1: Execute and Monitor

1. **Click Execute Workflow**
   - Look for blue button in toolbar
   - Click it

2. **Modal Opens**
   - Shows "Executing..." text
   - Shows spinner

3. **Wait for Execution**
   - Each step should execute
   - Shows step progress
   - Should complete in 1-2 seconds

4. **Check Results**
   - Look for "Workflow Completed" at bottom
   - See "Final Output:" field
   - Should show your users array

#### Test 3.2: View Step Details

1. In modal, find workflow steps
2. Each step shows: `Node Name`
3. Click: **Show Details** button
4. Expand shows tabs:
   - **Input Tab**: Data passed in
   - **Output Tab**: ← Response from backend
   - **Request Tab**: HTTP request config
   - **Response Tab**: Status code + timing

5. Click **Output Tab**
   - For GET /users node
   - Should show your users array:
     ```json
     [
       {"_id": {...}, "name": "John", "age": 25},
       {"_id": {...}, "name": "Jane", "age": 30}
     ]
     ```

### Part 4: Debug Mode - Check Console

#### 4.1: Enable Debug Logging

Press `F12` → **Console tab**

You'll see logs like:
```
Executing workflow...
Node executed: GET /users
Backend response received
Output: [{_id, name, age}, ...]
Final output set
Workflow completed
```

#### 4.2: Check for Errors

If something fails, console shows:
```
Error executing node: GET /users
TypeError: fetch failed
→ Backend not running? Check port 8080
```

Or:
```
Error: response.json() failed
Status: 404
→ Wrong endpoint? Check /users path
```

#### 4.3: Inspect Zustand Store

Type in console:
```javascript
// Get current workflow
useWorkflowStore.getState().workflows[0]

// Get execution results
useWorkflowExecutionStore.getState().executionContext

// Get final output
useWorkflowExecutionStore.getState().executionContext.finalOutput
```

Should show your data structure

### Part 5: Network Analysis

#### 5.1: Check Network Requests

1. Press F12 → **Network** tab
2. Refresh page
3. Click **Execute Workflow**
4. Look for request: `GET http://localhost:8080/users`
5. Click it, check:
   - **Headers**: 
     ```
     GET /users HTTP/1.1
     Host: localhost:8080
     Content-Type: application/json
     ```
   - **Response**:
     ```json
     [{"_id": {...}, "name": "...", "age": ...}, ...]
     ```
   - **Status**: Should be 200
   - **Timing**: Response time (usually <100ms)

#### 5.2: Check for CORS Issues

If you see errors like:
```
Access to XMLHttpRequest at 'http://localhost:8080/users' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution**: Backend needs CORS headers:
```javascript
// In your Express backend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

## 🔍 Step-by-Step Trace

### Scenario: Click "Execute Workflow" → See Users

**Step 1: Click Execute Button**
```
Location: /src/components/ExecuteButton.jsx
Action: onClick={() => setOpen(true)}
Effect: WorkflowExecutor modal opens
```

**Step 2: Modal Opens**
```
Location: /src/components/WorkflowExecutor.jsx
Component: <WorkflowExecutor open={open} onClose={...} />
Effect: Modal visible with current workflow
```

**Step 3: User Clicks Execute in Modal**
```
Location: WorkflowExecutor.jsx line 200+
Function: handleExecute()
Action: Calls executeWorkflow()
```

**Step 4: Execute Each Node**
```
Location: /src/service/workflowExecutor.js
Function: executeWorkflow() → for each node → executeNode()

For MongoDB connector:
├─ data.connector = "mongodb"
├─ config.operation = "findAll"
├─ config.backendUrl = "http://localhost:8080"
└─ execute:
   ├─ fetch(`http://localhost:8080/users`, { method: "GET" })
   ├─ response.json()
   ├─ output = [{_id, name, age}, ...]
   └─ return { data: output, status: 200, ... }
```

**Step 5: Store Results**
```
Location: /src/store/workflowExecutionStore.js
Action: context.results[nodeId] = result
Effect: Results stored in Zustand store
```

**Step 6: Display in UI**
```
Location: /src/components/WorkflowExecutor.jsx
Component: StepResultViewer
Display:
├─ Input tab: {currentInput}
├─ Output tab: {result.output} ← YOUR USERS HERE
├─ Request tab: {result.request}
└─ Response tab: {result.status, result.timing}
```

**Step 7: Final Output**
```
Location: WorkflowExecutor.jsx line 460+
Component: Final Output TextField
Display: JSON.stringify(finalOutput)
Content: Your users array [{_id, name, age}, ...]
```

## 🧪 Minimal Test Workflow

Create simplest possible test:

### Setup
1. Start with blank canvas (no nodes)
2. From API List panel, drag **GET** endpoint
3. Configure as:
   - Method: GET
   - Path: /users
   - Base URL: http://localhost:8080

### Execute
1. Click "Execute Workflow"
2. Modal shows single node execution
3. Check Output tab
4. Should see your MongoDB users

### Expected Output
```json
[
  {"_id": {...}, "name": "User1", "age": 25},
  {"_id": {...}, "name": "User2", "age": 30},
  ...
]
```

## 🎯 Verification Checklist

```
Code Integration
[x] ExecuteButton.jsx exists
[x] ExecuteButton imported in CreateNewWorkflow
[x] ExecuteButton rendered in toolbar
[x] WorkflowExecutor.jsx handles execution
[x] workflowExecutor.js makes fetch calls
[x] ConnectorNode supports backendUrl config
[x] Zustand store holds execution results
[x] StepResultViewer displays tabs

Configuration
[x] backendUrl defaults to "http://localhost:8080"
[x] MongoDB connector configured for /users endpoint
[x] GET operation calls correct URL
[x] POST operation calls correct URL
[x] Operation dropdown has "findAll" option

Runtime
[ ] Browser shows Execute button
[ ] Clicking button opens modal
[ ] Modal shows workflow execution
[ ] GET /users request succeeds (Network tab)
[ ] Response shows users array
[ ] Output tab displays the data
[ ] Final Output shows users array

Debugging
[ ] Browser console has no errors (F12)
[ ] Network tab shows 200 status (F12)
[ ] Backend curl test works
[ ] Store state shows results (console log)
```

## 📞 When to Check What

| Symptom | Check | Fix |
|---------|-------|-----|
| Button not visible | Code exists? → Browser cache | Ctrl+Shift+R |
| Modal doesn't open | Button click works? → Console | F12 Console for JS errors |
| Modal blank | Workflow exists? → Store state | Check useWorkflowStore in console |
| No results shown | Modal runs? → Network tab | Check GET request in F12 Network |
| Wrong URL | Config modal | Edit backendUrl in ConnectorNode |
| CORS error | Browser console | Add CORS headers to backend |
| Empty array returned | Backend working? → Test curl | curl http://localhost:8080/users |

---

**Complete System Flow**:
```
User clicks Execute
    ↓
ExecuteButton onClick
    ↓
WorkflowExecutor modal opens
    ↓
executeWorkflow() called
    ↓
For each node: executeNode()
    ↓
For MongoDB connector:
    fetch(`http://localhost:8080/users`)
    ↓
Backend returns users array
    ↓
StepResultViewer displays in tabs
    ↓
Final Output shows last result
    ↓
User sees their MongoDB users ✅
```
