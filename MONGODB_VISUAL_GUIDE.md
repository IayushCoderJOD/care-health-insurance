# MongoDB Workflow - Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BPM Workflow Builder                      │
│                   (http://localhost:5173)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ (HTTP calls)
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Express Backend Server                          │
│              (http://localhost:3001)                         │
│                                                              │
│  ┌──────────────────┐        ┌──────────────────┐           │
│  │  GET /users      │        │  POST /users     │           │
│  │  (retrieves all) │        │  (inserts new)   │           │
│  └────────┬─────────┘        └────────┬─────────┘           │
└───────────┼──────────────────────────┼────────────────────┘
            │                          │
            │    (MongoDB queries)     │
            │                          │
┌───────────▼──────────────────────────▼────────────────────┐
│               MongoDB (localhost:27017)                    │
│                                                            │
│  Database: testdb                                          │
│  ├─ Collection: users                                      │
│  │  ├─ { _id, name, email, age, createdAt }              │
│  │  ├─ { _id, name, email, age, createdAt }              │
│  │  └─ { _id, name, email, age, createdAt }              │
│  └─ (more collections...)                                 │
└────────────────────────────────────────────────────────────┘
```

---

## Workflow Builder - Node Configuration

### API Node (Blue)
```
┌──────────────┐
│   POST       │  Method: POST
│  /users      │  Path: /users
│              │  Headers: {...}
└──────────────┘  Body: { name, email, age }
```

### MongoDB Connector Node (Purple)
```
┌──────────────┐
│   ⊞ ⊡ ⊞      │  Component: mongodb
│  MongoDB     │  Backend URL: http://localhost:3001
│              │  Operation: insert | findAll
└──────────────┘  Config: { collection: "users", ... }
```

---

## Data Flow Diagrams

### Insert User Workflow

```
User Form Input
│
├─ name: "Alice Smith"
├─ email: "alice@example.com"
└─ age: 28
│
▼
┌──────────────────────────┐
│   POST /users Node       │
│  (API Endpoint)          │
└─────────┬────────────────┘
│
│ HTTP POST to backend
│ Body: { name, email, age }
│
▼
┌──────────────────────────┐
│   MongoDB Node           │
│  (connector)             │
│  Operation: insert       │
└─────────┬────────────────┘
│
│ calls: POST http://localhost:3001/users
│
▼
┌──────────────────────────┐
│   Express Backend        │
│  /users POST handler     │
└─────────┬────────────────┘
│
│ Inserts into MongoDB
│
▼
┌──────────────────────────┐
│   MongoDB Insert         │
│  users.insertOne({...})  │
└─────────┬────────────────┘
│
│ Response: { success: true, data: { _id: "...", ... } }
│
▼
┌──────────────────────────┐
│   Workflow Result        │
│  (display in UI)         │
└──────────────────────────┘
```

### Retrieve Users Workflow

```
User clicks "Execute"
│
▼
┌──────────────────────────┐
│   GET /users Node        │
│  (API Endpoint)          │
└─────────┬────────────────┘
│
│ HTTP GET to backend
│
▼
┌──────────────────────────┐
│   MongoDB Node           │
│  (connector)             │
│  Operation: findAll      │
└─────────┬────────────────┘
│
│ calls: GET http://localhost:3001/users
│
▼
┌──────────────────────────┐
│   Express Backend        │
│  /users GET handler      │
└─────────┬────────────────┘
│
│ Queries MongoDB
│
▼
┌──────────────────────────┐
│   MongoDB Find           │
│  users.find({})          │
└─────────┬────────────────┘
│
│ Response: { success: true, data: [...] }
│
▼
┌──────────────────────────┐
│   Workflow Result        │
│  (array of users)        │
└──────────────────────────┘
```

---

## Configuration Panel - MongoDB Node

```
┌────────────────────────────────────────────────────┐
│  Configure Connector                         [X]    │
├────────────────────────────────────────────────────┤
│                                                    │
│  Name:           [Insert User              ]      │
│  Component:      [mongodb            ] (disabled) │
│  Backend URL:    [http://localhost:3001 ]         │
│                                                    │
│  Operation:      [Insert (POST)        ▼]         │
│                  • Find All (GET)                  │
│                  • Insert (POST)      ← selected   │
│                  • Find by Query                   │
│                                                    │
│  Additional Config (JSON):                         │
│  ┌──────────────────────────────────────────┐     │
│  │ {                                        │     │
│  │   "collection": "users",                 │     │
│  │   "database": "testdb"                   │     │
│  │ }                                        │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│                       [Delete]   [Save]           │
└────────────────────────────────────────────────────┘
```

---

## Example Request/Response Cycle

### Request 1: Insert User

```
▼ WORKFLOW EXECUTES
POST /users
├─ Input: { name: "John", email: "john@example.com", age: 30 }
│
├─ Header: Content-Type: application/json
│
▼ MongoDB Connector:
  ├─ Backend URL: http://localhost:3001
  ├─ Operation: insert
  └─ Passes input to POST /users

▼ BACKEND RECEIVES
POST http://localhost:3001/users
├─ Body: { name: "John", email: "john@example.com", age: 30 }
│
▼ DATABASE SAVES
users.insertOne({
  name: "John",
  email: "john@example.com",
  age: 30,
  createdAt: 2024-01-15T10:30:00Z,
  _id: ObjectId("507f1f77bcf86cd799439011")
})

▼ RESPONSE RETURNED
Status: 200 OK
Body: {
  "success": true,
  "message": "User inserted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John",
    "email": "john@example.com",
    "age": 30
  }
}

▼ WORKFLOW DISPLAYS RESULT
✓ Insert successful
  • User ID: 507f1f77bcf86cd799439011
  • Name: John
  • Email: john@example.com
```

### Request 2: Get All Users

```
▼ WORKFLOW EXECUTES
GET /users
├─ Input: (empty)
│
▼ MongoDB Connector:
  ├─ Backend URL: http://localhost:3001
  ├─ Operation: findAll
  └─ Calls GET /users

▼ BACKEND RETRIEVES
GET http://localhost:3001/users

▼ DATABASE QUERY
users.find({})
→ Returns all documents

▼ RESPONSE
Status: 200 OK
Body: {
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John",
      "email": "john@example.com",
      "age": 30
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Alice",
      "email": "alice@example.com",
      "age": 28
    },
    ...
  ]
}

▼ WORKFLOW DISPLAYS RESULT
✓ Retrieved 3 users
  [John, john@example.com, 30]
  [Alice, alice@example.com, 28]
  ...
```

---

## Component Interaction Timeline

```
User Opens App
     │
     ▼
Load OpenAPI Spec (/users endpoints)
     │
     ▼
Load Connectors (MongoDB, Kafka, Timer, ...)
     │
     ▼
User Drags Nodes to Canvas
     ├─ POST /users (blue API node)
     ├─ GET /users (blue API node)
     └─ MongoDB (purple connector node)
     │
     ▼
User Connects Nodes (POST → MongoDB)
     │
     ▼
User Double-Clicks MongoDB Node
     │
     ▼
ConnectorNode Modal Opens
     ├─ Backend URL field: http://localhost:3001
     ├─ Operation dropdown: insert
     └─ Config JSON area
     │
     ▼
User Clicks "Save"
     │
     ▼
Config Saved to Store
     └─ { backendUrl, operation, collection, ... }
     │
     ▼
User Clicks "Execute"
     │
     ▼
WorkflowExecutor Runs
     ├─ Executes POST /users
     └─ Input flows to MongoDB node
     │
     ▼
MongoDB Connector Executes
     └─ Makes HTTP call to backend
        POST http://localhost:3001/users
     │
     ▼
Backend Inserts to MongoDB
     └─ users.insertOne(inputData)
     │
     ▼
Response Returns to Workflow
     └─ { success: true, data: {...} }
     │
     ▼
UI Shows Result
     └─ "User inserted: John Smith (ID: 507f...)"
```

---

## Setup Verification Checklist

```
┌─ MongoDB Running ──────────────┐
│ mongod (or Docker)             │
│ Listening: localhost:27017     │
│ Database: testdb               │
│ Collection: users              │
└────────────────────────────────┘

┌─ Backend Running ──────────────┐
│ node server.js                 │
│ Listening: localhost:3001       │
│ Endpoints: GET/POST /users     │
│ Connected to MongoDB           │
└────────────────────────────────┘

┌─ Frontend Running ─────────────┐
│ npm run dev                     │
│ Listening: localhost:5173       │
│ Can load specs                 │
│ Can create workflows           │
└────────────────────────────────┘

✓ All systems online!
  Ready for MongoDB workflows.
```

---

## Navigation Guide

- **Quick Start**: [MONGODB_QUICK_START.md](MONGODB_QUICK_START.md)
- **Full Setup**: [MONGODB_SETUP.md](MONGODB_SETUP.md)
- **Integration Details**: [MONGODB_INTEGRATION.md](MONGODB_INTEGRATION.md)
- **Workflow Guide**: [QUICK_START.md](QUICK_START.md)
