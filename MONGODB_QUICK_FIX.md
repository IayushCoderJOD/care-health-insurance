# MongoDB BPM - Quick Start (5 Minutes)

## 🎯 What You Need

✅ MongoDB running locally
✅ Backend running at `http://localhost:8080`
✅ Frontend app open in browser
✅ The `/users` endpoint working (GET and POST)

## ⚡ Quick Test (3 Steps)

### Step 1: Refresh Browser
```
Press: F5 (or Ctrl+R)
Wait for page to load
```

### Step 2: Look for Blue Button
In the top toolbar, next to the "Save" button, you should see:
```
🎮 Execute Workflow  (blue button with play icon)
```

If you don't see it:
- Hard refresh: `Ctrl+Shift+R`
- Clear cache and reload

### Step 3: Click "Execute Workflow"
```
1. Click the blue "Execute Workflow" button
2. Modal window opens
3. Shows: "Executing..." with loading spinner
4. Displays workflow steps as they execute
```

## 📊 View Your MongoDB Users

Once the modal is open:

### For each workflow step:
```
Node Name
├── Button: "Show Details"
│   └── Click it to expand
└── Expanded view shows:
    ├── Input Tab - data passed in
    ├── Output Tab ← YOUR USERS HERE
    ├── Request Tab - HTTP details
    └── Response Tab - status code + timing
```

### Final Output:
```
At bottom of modal:
┌─────────────────────────┐
│ Workflow Completed      │
│ Final Output:           │
│ [                       │
│   {                     │
│     "_id": {...},       │
│     "name": "...",      │
│     "age": ...          │
│   },                    │
│   ... 9 more users      │
│ ]                       │
└─────────────────────────┘
```

## 🔄 Test Data Flow

### Option 1: Use Sample Workflow
- App loads with pre-built workflow
- Click Execute Workflow
- Results show automatically

### Option 2: Create GET Users Workflow
1. On canvas, drag a GET endpoint node
2. Configure it: `GET http://localhost:8080/users`
3. Click Execute Workflow
4. View results

## ✅ Success Indicators

```
✅ Blue Execute button visible
✅ Modal opens when clicked
✅ Shows "Executing..." then steps
✅ Each step has "Show Details"
✅ Output tab shows your users array
✅ Final Output shows users at bottom
```

## ❌ Troubleshooting

| Problem | Fix |
|---------|-----|
| Button missing | Hard refresh: `Ctrl+Shift+R` |
| Modal blank | Check: F12 → Console for errors |
| No data shown | Click "Show Details" → "Output" tab |
| 404 error | Backend not running on :8080 |
| Timeout | MongoDB not connected to backend |

## 🧪 Verify Backend

Before using frontend, test backend:

```bash
# Test if backend is running
curl http://localhost:8080/users

# Should return
[
  {"_id": {...}, "name": "User1", "age": 25},
  {"_id": {...}, "name": "User2", "age": 30},
  ...
]
```

## 🎨 UI Layout

```
┌─────────────────────────────────────────┐
│  Create New Workflow               ← You are here
│  ┌──────────────────────────────────┐   │
│  │  API List                Canvas  │   │
│  │  ├─ GET                  [Node] ┌┤   │
│  │  ├─ POST           →     [Node] ││   │
│  │  └─ Connector            [Node] ││   │
│  │                              │  │    │
│  │  Config Panel         Toolbar  │  │   │
│  │  └─ Properties        [Save] │  │   │
│  │                    [Execute] ← CLICK │
│  │                      [Export]  │  │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘

     Modal opens when Execute clicked
     └─ Shows workflow execution live
```

## 📈 Complete Data Flow

```
1. User clicks "Execute Workflow" button
   ↓
2. WorkflowExecutor modal opens
   ↓
3. For each node in workflow:
   ├─ executeNode(node, inputData)
   │  ├─ For MongoDB connector:
   │  │  ├─ read config.backendUrl = "http://localhost:8080"
   │  │  ├─ fetch("http://localhost:8080/users")
   │  │  ├─ receive: [{_id, name, age}, ...]
   │  │  └─ return as result.output
   │  └─ For API node:
   │     ├─ make HTTP request
   │     └─ return response
   │
   └─ Display in StepResultViewer with tabs
      ├─ Input tab: data passed in
      ├─ Output tab: ← YOUR USERS ARRAY
      ├─ Request tab: HTTP details
      └─ Response tab: status + timing
   ↓
4. Final Output section shows last result
   ↓
5. User can see complete workflow execution
```

## 🚀 Next Steps After Verification

Once you see your users in the modal:

1. **Create complex workflows**
   - Drag multiple nodes
   - Connect them
   - Execute full flow

2. **MongoDB operations**
   - Insert new users
   - Query users
   - Chain operations

3. **Data transformation**
   - Use workflow to process data
   - Chain API calls
   - Filter/map results

## 📱 Browser DevTools

If something doesn't work, check:

```
Press: F12 (or Ctrl+Shift+I)

Console Tab:
└─ Shows JavaScript errors
   └─ Look for fetch errors or JSON parse issues

Network Tab:
└─ Shows HTTP requests
   └─ Check GET /users request
   └─ Verify 200 status code
   └─ See response body

Storage Tab (optional):
└─ View Zustand store state
```

## 🎯 Goal Achieved

Your MongoDB BPM is ready when:
- ✅ Execute button visible
- ✅ Modal opens
- ✅ Sees your users array in Output tab
- ✅ Full workflow execution shows

---

**Ready?** 
1. Press F5
2. Click Execute Workflow
3. Check Output tab
4. See your 9 users! 🎉
