# 🔗 API Workflow Builder

A visual, drag-and-drop interface to design, configure, and export OpenAPI workflows as YAML or JSON.

## ✅ Status: Production Ready

**Everything is implemented!** Start using it now or read the docs below.

---

## 🚀 Quick Start (5 minutes)

```bash
# Install & run
npm install
npm run dev

# Open http://localhost:5173/
# Load sample API spec
# Drag endpoints → Configure → Export
```

**→ Read full guide: [QUICK_START.md](QUICK_START.md)**

---

## 📚 Documentation

Choose your path:

### 🎯 I Want to Use It
**→ [QUICK_START.md](QUICK_START.md)** - 5-minute guide with examples

### 📖 I Want to Learn Everything  
**→ [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Complete feature documentation

### 🔧 I Want to Customize & Extend
**→ [ADVANCED.md](ADVANCED.md)** - Customization, performance, and future features

### 👨‍💻 I'm a Developer
**→ [DEVELOPER.md](DEVELOPER.md)** - Architecture, components, state management

### ✅ I'm Verifying Completion
**→ [CHECKLIST.md](CHECKLIST.md)** - What's implemented, status, next steps

### 📋 I Want an Overview
**→ [SUMMARY.md](SUMMARY.md)** - Project summary, features, tech stack

### 📍 I'm Lost
**→ [INDEX.md](INDEX.md)** - Documentation index and navigation guide

---

## ✨ Features

✅ **Load OpenAPI Specs** - Upload JSON/YAML, paste, or use URLs  
✅ **Visual Canvas** - Drag & drop endpoints with React Flow  
✅ **Configure Endpoints** - Edit headers, query params, request bodies  
✅ **Create Workflows** - Connect endpoints visually  
✅ **Export** - Download as YAML or JSON  

---

## 🏗️ What's Included

- **6 React Components** - Modular, reusable UI
- **2 Utility Modules** - OpenAPI parsing, YAML export
- **1 Zustand Store** - Global state management
- **Sample OpenAPI Spec** - For testing
- **7 Documentation Files** - Comprehensive guides
- **Production Build** - Optimized and ready to deploy

---

## 🛠️ Tech Stack

- React 18
- React Flow
- Zustand
- Tailwind CSS
- Vite
- Swagger Parser

---

## 📦 Project Structure

```
src/
├── components/          # 6 React components
├── utils/              # OpenAPI parser & YAML export
├── store/              # Zustand state management
├── App.jsx             # Main layout
└── index.css           # Tailwind styles

public/
└── sample-api.json     # Sample OpenAPI spec

Documentation/
├── INDEX.md            # Start here!
├── QUICK_START.md      # 5-minute guide
├── IMPLEMENTATION_GUIDE.md  # Complete features
├── ADVANCED.md         # Customization
├── DEVELOPER.md        # Development guide
└── CHECKLIST.md        # Status & completion
```

---

## 🎯 Example Workflow

```
Load Spec → Drag Endpoints → Configure → Connect → Export YAML
```

**Detailed example in [QUICK_START.md](QUICK_START.md)**

---

## 🚀 Deploy to Production

```bash
npm run build        # Creates dist/ folder
vercel              # Deploy with Vercel
# or
npm run build && npx gh-pages -d dist  # GitHub Pages
```

---

## 📚 Next Steps

1. **Read**: [QUICK_START.md](QUICK_START.md)
2. **Run**: `npm run dev`
3. **Try**: Load sample API spec
4. **Build**: Create your first workflow
5. **Export**: Download as YAML

---

## 💡 Key Concepts

- **OpenAPI Spec** - Standard format describing REST APIs
- **Nodes** - Visual endpoints on canvas
- **Edges** - Connections defining workflow order
- **Workflow** - Complete graph of nodes & edges
- **Export** - Save as YAML/JSON

---

## 🆘 Need Help?

- **Quick questions?** → [QUICK_START.md](QUICK_START.md)
- **Feature details?** → [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
- **Development?** → [DEVELOPER.md](DEVELOPER.md)
- **Lost?** → [INDEX.md](INDEX.md)

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
