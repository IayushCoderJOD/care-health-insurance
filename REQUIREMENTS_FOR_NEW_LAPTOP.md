# 📋 Requirements Document: OpenAPI Workflow Builder - Scalable Edition

**Project**: Enterprise OpenAPI Workflow Builder (Bigger, Scalable Version)  
**Date**: February 2026  
**Based On**: Current API Workflow Builder MVP

---

## 🎯 Project Overview

This document outlines all requirements for setting up a **new laptop** to develop a **scalable, enterprise-grade** OpenAPI workflow builder (similar to Cordys). The system will:

1. **Parse OpenAPI Specs** (JSON/YAML)
2. **Build Visual Workflows** (Drag & Drop Canvas)
3. **Configure API Endpoints** (Headers, Params, Body)
4. **Execute Workflows** (Sequence, Loops, Conditions)
5. **Export & Deploy** (YAML/JSON format)
6. **Monitor & Debug** (Execution logs, error handling)

---

## 📦 PART 1: MANDATORY SYSTEM SOFTWARE

### Global Installation Required (All)

```
✅ Visual Studio Code (Latest)
   → Extensions: See Section 4

✅ Node.js (Latest LTS or v22+)
   → Installation: https://nodejs.org/
   → Verify: node --version

✅ npm (Latest, comes with Node.js)
   → Verify: npm --version
   → Optional: Use nvm for Windows to manage versions

✅ nvm for Windows (Recommended)
   → Download: https://github.com/coreybutler/nvm-windows
   → Manage multiple Node versions easily

✅ Git (Latest)
   → Installation: https://git-scm.com/
   → Verify: git --version

✅ Figma (Latest)
   → Design tool for UI/UX mockups
   → Download: https://figma.com/downloads

✅ Postman (Optional but Recommended)
   → API testing & debugging
   → Download: https://www.postman.com/downloads/

✅ Docker (Optional for Later)
   → Container management
   → For deployment & testing environments
   → Download: https://www.docker.com/products/docker-desktop
```

---

## 🛠️ PART 2: PROJECT SETUP FROM SCRATCH

### Step 1: Create Vite Project

```bash
# Navigate to your workspace
cd ~/projects

# Create new Vite project
npm create vite@latest openapi-workflow-builder -- --template react

# Navigate into project
cd openapi-workflow-builder

# Install dependencies (we'll replace with our list next)
npm install
```

### Step 2: Update package.json with Dependencies

Replace the auto-generated `package.json` with this structure:

```json
{
  "name": "openapi-workflow-builder",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:analyze": "vite build && npm run visualize",
    "visualize": "vite-bundle-visualizer stats.html",
    "lint": "eslint .",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css}\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "preview": "vite preview"
  },
  "dependencies": {
    "@apidevtools/swagger-parser": "latest",
    "@emotion/css": "latest",
    "@emotion/react": "latest",
    "@emotion/styled": "latest",
    "@mui/icons-material": "latest",
    "@mui/lab": "latest",
    "@mui/material": "latest",
    "@mui/x-data-grid": "latest",
    "@react-pdf/renderer": "latest",
    "@reduxjs/toolkit": "latest",
    "axios": "latest",
    "dayjs": "latest",
    "formik": "latest",
    "js-yaml": "latest",
    "lottie-react": "latest",
    "pdf-lib": "latest",
    "react": "latest",
    "react-dom": "latest",
    "react-redux": "latest",
    "react-router-dom": "latest",
    "reactflow": "latest",
    "zustand": "latest"
  },
  "devDependencies": {
    "@babel/core": "latest",
    "@babel/preset-env": "latest",
    "@babel/preset-react": "latest",
    "@babel/preset-typescript": "latest",
    "@eslint/js": "latest",
    "@tailwindcss/postcss": "latest",
    "@testing-library/dom": "latest",
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "@types/jest": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@vitejs/plugin-react": "latest",
    "autoprefixer": "latest",
    "babel-jest": "latest",
    "eslint": "latest",
    "eslint-plugin-prettier": "latest",
    "eslint-plugin-react": "latest",
    "eslint-plugin-react-hooks": "latest",
    "eslint-plugin-react-refresh": "latest",
    "globals": "latest",
    "jest": "latest",
    "jest-environment-jsdom": "latest",
    "postcss": "latest",
    "prettier": "latest",
    "rollup-plugin-visualizer": "latest",
    "tailwindcss": "latest",
    "typescript": "latest",
    "typescript-eslint": "latest",
    "vite": "latest",
    "vite-bundle-visualizer": "latest",
    "vite-plugin-checker": "latest",
    "vite-plugin-svgr": "latest",
    "vite-tsconfig-paths": "latest"
  }
}
```

### Step 3: Install All Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm list
```

---

## 📚 PART 3: LIBRARY ANALYSIS & ADDITIONAL REQUIREMENTS

### ✅ Current Dependencies (From Your List)

| Library | Purpose | Notes |
|---------|---------|-------|
| **@apidevtools/swagger-parser** | Parse OpenAPI specs | ✅ Already in project |
| **reactflow** | Visual workflow canvas | ✅ Already in project |
| **zustand** | State management | ✅ Already in project |
| **axios** | HTTP requests | ✅ Already in project |
| **js-yaml** | YAML parsing & export | ✅ Already in project |
| **@mui/material** | UI components | ✅ Already in project |
| **tailwindcss** | Styling framework | ✅ Already in project |
| **react-router-dom** | Routing | ✅ Already in project |
| **@emotion/** | CSS-in-JS | ✅ Already in project |

### 📋 ADDITIONAL LIBRARIES RECOMMENDED FOR SCALABLE PROJECT

**For Advanced Features:**

```json
{
  "Additional Dependencies": {
    "react-query": "latest",
    "Comment": "Data fetching & caching (instead of plain axios)"
  },
  {
    "immer": "latest",
    "Comment": "Immutable state management helper"
  },
  {
    "yup": "latest",
    "Comment": "Schema validation (alternative to formik)"
  },
  {
    "lodash-es": "latest",
    "Comment": "Utility functions (tree operations, debounce, etc.)"
  },
  {
    "uuid": "latest",
    "Comment": "Generate unique IDs for nodes/workflows"
  },
  {
    "recharts": "latest",
    "Comment": "Charts for workflow execution metrics"
  },
  {
    "react-hot-toast": "latest",
    "Comment": "Toast notifications (better UX)"
  },
  {
    "framer-motion": "latest",
    "Comment": "Animations for workflow transitions"
  },
  {
    "zod": "latest",
    "Comment": "Type-safe schema validation"
  }
}
```

### 🔍 CURRENT PROJECT MISSING (But Good to Add)

```json
{
  "For Testing": [
    "vitest - Modern test runner faster than Jest",
    "@vitest/ui - Visual test runner",
    "msw - Mock service worker for API mocking"
  ],
  "For Performance": [
    "vite-plugin-compression - Gzip compression",
    "vite-plugin-inspect - Debug Vite modules"
  ],
  "For Logging": [
    "pino - Fast logger (replace console.log)",
    "winston - Structured logging"
  ],
  "For API Mocking": [
    "json-server - Mock REST API",
    "faker - Generate fake data"
  ]
}
```

---

## 💾 PART 4: VS CODE EXTENSIONS

### Mandatory Extensions

```
✅ ESLint
   → ID: dbaeumer.vscode-eslint
   → Code quality & linting

✅ Prettier - Code formatter
   → ID: esbenp.prettier-vscode
   → Code formatting

✅ ES7+ React/Redux/React-Native snippets
   → ID: dsznajder.es7-react-js-snippets
   → Quick code generation

✅ TypeScript Hero
   → ID: rbbit.typescript-hero
   → Organize imports automatically

✅ Path Intellisense
   → ID: christian-kohler.path-intellisense
   → Autocomplete file paths

✅ Thunder Client OR REST Client
   → ID: rangav.vscode-thunder-client (OR)
   → ID: humao.rest-client
   → API testing without Postman

✅ Material Icon Theme
   → ID: PKief.material-icon-theme
   → Better file icons
```

### Highly Recommended Extensions

```
✅ Auto Import
   → ID: steoates.autoimport
   → Auto-import unused modules

✅ GitLens
   → ID: eamodio.gitlens
   → Advanced Git features

✅ Git History
   → ID: donjayamanne.githistory
   → View git history

✅ Live Server
   → ID: ritwickdey.LiveServer
   → Quick preview of static files

✅ YAML
   → ID: redhat.vscode-yaml
   → YAML syntax highlighting

✅ XML
   → ID: redhat.vscode-xml
   → XML editing support

✅ Markdown Preview Enhanced
   → ID: shd101wyy.markdown-preview-enhanced
   → Better markdown preview

✅ Thunder Client (REST API Testing)
   → ID: rangav.vscode-thunder-client
   → Built-in API testing

✅ Jest Runner
   → ID: firsttris.vscode-jest-runner
   → Run tests inline
```

### Optional but Useful

```
✅ Tabnine AI (Copilot Alternative)
   → ID: TabNine.tabnine-vscode
   → AI code completion

✅ Error Lens
   → ID: usernamehw.errorlens
   → Show errors inline

✅ Rainbow Brackets
   → ID: 2gua.rainbow-brackets
   → Color-code brackets

✅ Code Spell Checker
   → ID: streetsidesoftware.code-spell-checker
   → Spell checking in code

✅ Peacock
   → ID: johnpapa.peacock
   → Color-code workspaces

✅ Turbo Console Log
   → ID: ChakrounAchraf.turbo-console-log
   → Quick console.log insertion
```

### Installation Command

```bash
# Copy this to VS Code terminal to install all extensions:

code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension rbbit.typescript-hero
code --install-extension christian-kohler.path-intellisense
code --install-extension rangav.vscode-thunder-client
code --install-extension PKief.material-icon-theme
code --install-extension steoates.autoimport
code --install-extension eamodio.gitlens
code --install-extension donjayamanne.githistory
code --install-extension ritwickdey.LiveServer
code --install-extension redhat.vscode-yaml
code --install-extension redhat.vscode-xml
code --install-extension shd101wyy.markdown-preview-enhanced
code --install-extension firsttris.vscode-jest-runner
code --install-extension usernamehw.errorlens
code --install-extension 2gua.rainbow-brackets
code --install-extension streetsidesoftware.code-spell-checker
```

---

## 📁 PART 5: PROJECT STRUCTURE (SCALABLE)

```
openapi-workflow-builder/
├── src/
│   ├── components/
│   │   ├── common/                    # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── workflow/                  # Workflow builder
│   │   │   ├── WorkflowCanvas.jsx
│   │   │   ├── WorkflowNode.jsx
│   │   │   ├── WorkflowPanel.jsx
│   │   │   └── WorkflowToolbar.jsx
│   │   ├── api/                       # API management
│   │   │   ├── OpenApiUploader.jsx
│   │   │   ├── ApiListPanel.jsx
│   │   │   ├── ApiConfigPanel.jsx
│   │   │   └── ApiTester.jsx
│   │   ├── execution/                 # Workflow execution
│   │   │   ├── ExecutionDashboard.jsx
│   │   │   ├── ExecutionLogs.jsx
│   │   │   └── ExecutionDebugger.jsx
│   │   └── export/                    # Export features
│   │       ├── ExportModal.jsx
│   │       └── ExportPreview.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── WorkflowBuilder.jsx
│   │   ├── WorkflowExecutor.jsx
│   │   ├── ExecutionHistory.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   ├── openApiService.js          # OpenAPI parsing
│   │   ├── workflowService.js         # Workflow logic
│   │   ├── executionService.js        # Execution engine
│   │   ├── apiService.js              # API calls
│   │   └── storageService.js          # LocalStorage/IndexedDB
│   ├── store/
│   │   ├── workflowStore.js           # Zustand store (workflows)
│   │   ├── executionStore.js          # Execution state
│   │   ├── apiStore.js                # API specs state
│   │   └── uiStore.js                 # UI state
│   ├── hooks/
│   │   ├── useWorkflow.js
│   │   ├── useExecution.js
│   │   ├── useLocalStorage.js
│   │   └── useDebounce.js
│   ├── utils/
│   │   ├── openApiParser.js
│   │   ├── yamlExporter.js
│   │   ├── jsonExporter.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── helpers.js
│   ├── types/                         # TypeScript types (if using TS)
│   │   ├── workflow.types.ts
│   │   ├── api.types.ts
│   │   └── execution.types.ts
│   ├── constants/
│   │   ├── httpMethods.js
│   │   ├── nodeTypes.js
│   │   └── appConfig.js
│   ├── styles/
│   │   ├── tailwind.css
│   │   ├── globals.css
│   │   └── themes.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── public/
│   ├── sample-api.json
│   ├── sample-workflows/
│   │   ├── user-auth-flow.yaml
│   │   ├── data-pipeline.yaml
│   │   └── notification-workflow.yaml
│   └── assets/
├── tests/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── integration/
├── config/
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── jest.config.js
│   └── babel.config.js
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_DESIGN.md
│   ├── DEPLOYMENT.md
│   └── TROUBLESHOOTING.md
├── .env.example
├── .gitignore
├── .prettierrc
├── package.json
├── package-lock.json
├── README.md
└── REQUIREMENTS_FOR_NEW_LAPTOP.md
```

---

## ⚙️ PART 6: CONFIGURATION FILES

### 6.1 ESLint Configuration (.eslintrc.js)

```javascript
export default [
  {
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'warn',
    },
  },
];
```

### 6.2 Prettier Configuration (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "jsxBracketSameLine": false,
  "bracketSpacing": true
}
```

### 6.3 Tailwind Configuration (tailwind.config.js)

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
};
```

### 6.4 Jest Configuration (jest.config.js)

```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
```

---

## 🏗️ PART 7: CURRENT PROJECT ANALYSIS

### What's Already Built

✅ **OpenAPI Parser**
- Parse JSON/YAML specs
- Extract endpoints with metadata
- Support file upload, paste, URL loading

✅ **Visual Workflow Canvas**
- React Flow-based designer
- Drag & drop endpoints
- Connect endpoints to create workflows
- Pan, zoom, minimap controls

✅ **API Configuration Panel**
- Edit headers per endpoint
- Configure query parameters
- Edit request body (JSON)
- View endpoint metadata

✅ **Workflow Export**
- Export as YAML
- Export as JSON
- View inline YAML preview

✅ **State Management**
- Zustand for global state
- Persistent node/edge data
- Workflow serialization

### Current Architecture

```
OpenAPI Spec (JSON/YAML)
        ↓
OpenApiParser (JS)
        ↓
API Nodes in Left Panel
        ↓
Drag & Drop to Canvas
        ↓
WorkflowCanvas (React Flow)
        ↓
ConfigPanel (Headers, Params, Body)
        ↓
Workflow JSON/YAML
        ↓
yamlExporter.js (Export)
        ↓
YAML/JSON File Download
```

### Components Overview

| Component | Purpose | Status |
|-----------|---------|--------|
| OpenApiUploader | Upload/parse specs | ✅ Complete |
| ApiListPanel | Draggable endpoints | ✅ Complete |
| WorkflowCanvas | Visual designer | ✅ Complete |
| ApiNode | Custom node | ✅ Complete |
| ConfigPanel | Configure endpoints | ✅ Complete |
| ExportButton | Export workflow | ✅ Complete |
| WorkflowExecutor | Execute workflows | ⚠️ Partial |
| WorkflowCard | Display workflows | ✅ Complete |

---

## 🎯 PART 8: SCALABILITY ENHANCEMENTS FOR NEW PROJECT

### Phase 1: Core (Months 1-2)

- [ ] Advanced execution engine (sequences, loops, conditions)
- [ ] Workflow versioning & history
- [ ] User authentication & authorization
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] REST API backend (Node.js/Express)

### Phase 2: Advanced (Months 3-4)

- [ ] Execution monitoring & logs
- [ ] Performance metrics & analytics
- [ ] Workflow scheduling & cron jobs
- [ ] Error handling & retry logic
- [ ] Webhook integrations

### Phase 3: Enterprise (Months 5-6)

- [ ] Multi-user collaboration
- [ ] Role-based access control (RBAC)
- [ ] Audit logs & compliance
- [ ] Advanced security (encryption, OAuth)
- [ ] Deployment to production (Docker, Kubernetes)
- [ ] CI/CD pipeline (GitHub Actions)

---

## 🔧 PART 9: INITIAL SETUP CHECKLIST

```bash
# 1. Install Node.js & npm
# → Verify: node --version && npm --version

# 2. Create project
npm create vite@latest openapi-workflow-builder -- --template react

# 3. Navigate & install deps
cd openapi-workflow-builder
npm install

# 4. Install additional recommended libraries (if needed)
npm install react-query immer yup lodash-es uuid recharts react-hot-toast

# 5. Create folder structure
mkdir -p src/{components,pages,services,store,hooks,utils,types,constants,styles}
mkdir -p tests/{components,services,utils,integration}
mkdir -p config docs

# 6. Copy VS Code extensions
# → Run extension install command from Part 4

# 7. Initialize Git
git init
git add .
git commit -m "Initial commit"

# 8. Run development server
npm run dev

# 9. Open http://localhost:5173/
```

---

## ✅ PART 10: VERIFICATION CHECKLIST

- [ ] Node.js v18+ installed
- [ ] npm installed and updated
- [ ] VS Code installed with all extensions
- [ ] Git configured globally
- [ ] Vite project created
- [ ] All dependencies installed (`npm install`)
- [ ] Development server runs (`npm run dev`)
- [ ] Project folder structure created
- [ ] ESLint, Prettier configured
- [ ] Sample workflows created
- [ ] README.md updated
- [ ] Ready for development!

---

## 📞 SUPPORT & RESOURCES

### Documentation Links
- Vite: https://vitejs.dev/
- React: https://react.dev/
- React Flow: https://reactflow.dev/
- Zustand: https://github.com/pmndrs/zustand
- Tailwind: https://tailwindcss.com/
- Material-UI: https://mui.com/

### Helpful Commands

```bash
# Install a package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Update all packages
npm update

# Check outdated packages
npm outdated

# Clean install
rm -rf node_modules package-lock.json
npm install

# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📝 FINAL NOTES

✅ **You have everything needed!**

Your current dependencies are comprehensive for building a scalable OpenAPI workflow builder. The additional libraries recommended in Part 3 are optional enhancements for:
- Better state management (React Query)
- Advanced validation (Yup, Zod)
- Utility functions (Lodash)
- Analytics (Recharts)
- Better UX (Toast notifications, animations)

**Next Step**: Start with the Phase 1 enhancements and build out the backend API integration. The frontend foundation is solid!

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Maintainer**: Your Development Team
