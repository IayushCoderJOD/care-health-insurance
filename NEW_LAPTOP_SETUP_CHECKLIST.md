# ✅ NEW LAPTOP SETUP CHECKLIST

**Date**: February 2026  
**Project**: OpenAPI Workflow Builder (Scalable Enterprise Edition)  
**Target**: Fresh Windows/Mac/Linux machine setup

---

## 📋 PHASE 1: SYSTEM SETUP (1-2 hours)

### ✅ Step 1: Download & Install Global Software

```
☐ Visual Studio Code
  └─ Download from: https://code.visualstudio.com/
  └─ Verify: Open VS Code, it should work

☐ Node.js (v18 or Latest LTS)
  └─ Download from: https://nodejs.org/
  └─ Verify in Terminal/PowerShell:
     node --version  (should be v18+)
     npm --version   (should be latest)

☐ Git
  └─ Download from: https://git-scm.com/
  └─ Configure:
     git config --global user.name "Your Name"
     git config --global user.email "your@email.com"
  └─ Verify:
     git --version

☐ nvm for Windows (Optional but Recommended)
  └─ Download from: https://github.com/coreybutler/nvm-windows
  └─ This lets you manage multiple Node versions

☐ Figma
  └─ Download from: https://figma.com/
  └─ Create account

☐ Postman (Optional - for API testing)
  └─ Download from: https://postman.com/downloads
```

### ✅ Step 2: Install VS Code Extensions

**Option A: Manual Installation**
1. Open VS Code
2. Click Extensions icon (left sidebar)
3. Search for each extension below
4. Click Install

**Option B: Copy-Paste Command (Faster)**
```bash
# Open Terminal in VS Code (Ctrl+` on Windows/Linux, Cmd+` on Mac)
# Copy and paste this entire block:

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

**Verify Installation:**
- Open Extensions panel
- Search for "eslint" - should show as installed
- Search for "prettier" - should show as installed

---

## 📁 PHASE 2: PROJECT SETUP (30 minutes)

### ✅ Step 3: Create Fresh Vite Project

```bash
# 1. Navigate to your workspace folder
cd ~/projects
# OR: cd C:\Users\YourName\projects

# 2. Create new Vite project
npm create vite@latest workflow-builder -- --template react

# 3. Navigate into project
cd workflow-builder

# 4. Verify structure
# You should see:
#   ├── src/
#   ├── public/
#   ├── vite.config.js
#   ├── package.json
#   └── ...
```

### ✅ Step 4: Install ALL Dependencies

```bash
# Install base dependencies
npm install

# Verify installation
npm list
# (Should show all packages installed)
```

### ✅ Step 5: Add Missing Libraries

**Critical (Add Now)**:
```bash
npm install --save-dev \
  @babel/core \
  @babel/preset-env \
  @babel/preset-react \
  @babel/preset-typescript \
  @testing-library/dom \
  @testing-library/jest-dom \
  @testing-library/react \
  @testing-library/user-event \
  @types/jest \
  babel-jest \
  jest \
  jest-environment-jsdom \
  prettier \
  rollup-plugin-visualizer \
  typescript \
  typescript-eslint \
  vite-plugin-checker \
  vite-plugin-svgr \
  vite-tsconfig-paths
```

**Recommended (Add Soon)**:
```bash
npm install react-query dayjs formik yup immer lodash-es uuid
npm install --save-dev vitest msw
```

**Optional (Add Later)**:
```bash
npm install lottie-react @react-pdf/renderer pdf-lib
npm install --save-dev rollup-plugin-compression
```

### ✅ Step 6: Create Project Structure

```bash
# Create component folders
mkdir -p src/components/{common,workflow,api,execution,export}
mkdir -p src/components/nodes

# Create other folders
mkdir -p src/{pages,services,store,hooks,utils,types,constants,styles}

# Create test folders
mkdir -p tests/{components,services,utils,integration}

# Create config folder
mkdir -p config docs

# Verify structure
# Windows:
tree /F src

# Mac/Linux:
tree src -L 3
```

### ✅ Step 7: Create Configuration Files

**Create `.prettierrc` in root:**
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

**Create `eslint.config.js` in root:**
```javascript
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['dist']
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error'
    }
  }
];
```

---

## 🚀 PHASE 3: VERIFY SETUP (30 minutes)

### ✅ Step 8: Test Development Server

```bash
# Start dev server
npm run dev

# You should see:
# VITE v7.x.x  ready in xxx ms
# ➜ Local:   http://localhost:5173/
# ➜ Press q to quit

# Open http://localhost:5173/ in browser
# You should see Vite + React app running
```

### ✅ Step 9: Verify ESLint & Prettier

```bash
# Check linting
npm run lint

# Should show no errors or warnings

# Format code
npm run format

# Should format all files without errors
```

### ✅ Step 10: Test Build

```bash
# Create production build
npm run build

# You should see:
# dist/index.html
# dist/assets/*
# Built successfully!
```

### ✅ Step 11: Verify All Extensions in VS Code

In VS Code, press `Ctrl+Shift+P` (Cmd+Shift+P on Mac) and search:

```
☐ Extensions: Show Built-in Extensions
☐ ESLint is listed
☐ Prettier is listed
☐ Material Icon Theme is listed
```

---

## 📚 PHASE 4: PROJECT CONFIGURATION (1 hour)

### ✅ Step 12: Create Configuration Files

Copy these to your project root:

**`vite.config.js`**:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
```

**`tailwind.config.js`**:
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6'
      }
    }
  },
  plugins: []
}
```

**`postcss.config.js`**:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

**`jest.config.js`**:
```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  }
}
```

**`babel.config.js`**:
```javascript
export default {
  presets: [
    ['@babel/preset-env', { targets: { browsers: ['> 0.5%', 'last 2 versions'] } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript'
  ]
}
```

### ✅ Step 13: Create Sample Files

**Create `src/setupTests.js`:**
```javascript
import '@testing-library/jest-dom';
```

**Create `src/App.jsx`:**
```jsx
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <h1 className="text-white text-4xl font-bold text-center pt-20">
        🚀 OpenAPI Workflow Builder
      </h1>
      <p className="text-white text-center mt-4">Ready to build!</p>
    </div>
  );
}

export default App;
```

**Create `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## 📝 PHASE 5: GIT SETUP (15 minutes)

### ✅ Step 14: Initialize Git Repository

```bash
# Initialize git
git init

# Create .gitignore file
# Windows:
echo node_modules/ > .gitignore
echo dist/ >> .gitignore
echo .env.local >> .gitignore

# Mac/Linux:
cat > .gitignore << EOF
node_modules/
dist/
.env.local
.DS_Store
*.log
EOF

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Vite + React project setup"

# Verify
git log --oneline
# (Should show your initial commit)
```

### ✅ Step 15: Connect to GitHub (Optional)

```bash
# Create repo on GitHub.com first

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/workflow-builder.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🎯 PHASE 6: FINAL VERIFICATION (15 minutes)

### ✅ CHECKLIST - Verify Everything Works

```
☐ VS Code opens without errors
☐ All 18 extensions installed and enabled
☐ Node v18+ installed (node --version)
☐ npm latest version (npm --version)
☐ Git configured (git config --list)
☐ Project folder created
☐ npm install completed successfully
☐ All dependencies installed
☐ npm run dev starts server at http://localhost:5173/
☐ Browser shows React app running
☐ npm run build creates dist/ folder
☐ npm run lint runs without critical errors
☐ npm run format works
☐ ESLint integration in VS Code works (shows errors inline)
☐ Prettier integration in VS Code works (Right-click → Format)
☐ Git initialized (git log shows commits)
☐ File structure created correctly
☐ Configuration files present (vite.config.js, tailwind.config.js, etc.)
```

---

## 🎓 PHASE 7: READY TO CODE

### ✅ You're Ready If:

✅ All checkboxes above are checked
✅ Terminal shows no errors
✅ Browser displays the React app
✅ VS Code shows no critical issues
✅ Can run: npm run dev, npm run build, npm run lint

### ✅ Next Steps:

1. **Start Building Components**
   ```bash
   # Create your first component
   touch src/components/common/Button.jsx
   ```

2. **Add More Features**
   ```bash
   npm install [additional-libraries]
   ```

3. **Keep Your Project Updated**
   ```bash
   npm update  # Update dependencies
   npm outdated  # Check for updates
   ```

4. **Build & Deploy**
   ```bash
   npm run build
   # dist/ folder ready to deploy!
   ```

---

## 🆘 TROUBLESHOOTING

### Issue: `npm install` fails

**Solution 1**:
```bash
# Clear npm cache
npm cache clean --force

# Try install again
npm install
```

**Solution 2**:
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules
rm package-lock.json

# Install fresh
npm install
```

### Issue: VS Code extensions not showing

**Solution**:
```bash
# Restart VS Code
# (Close it completely and reopen)

# Or reload VS Code window:
Cmd+Shift+P → Reload Window
```

### Issue: Port 5173 already in use

**Solution**:
```bash
# Use different port
npm run dev -- --port 3000

# Or kill process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5173
kill -9 <PID>
```

### Issue: ESLint errors after setup

**Solution**:
```bash
# Fix linting issues automatically
npm run lint -- --fix

# Or format with Prettier
npm run format
```

---

## 📞 QUICK COMMAND REFERENCE

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview build

# Code Quality
npm run lint             # Check linting
npm run format           # Format code
npm run lint -- --fix    # Auto-fix linting issues

# Testing
npm test                 # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Package Management
npm list                 # List all packages
npm outdated             # Check outdated packages
npm update               # Update packages
npm install package-name # Install new package
```

---

## ✨ COMPLETION

**You've successfully set up a professional React development environment!**

- ✅ Global tools installed
- ✅ VS Code extensions configured
- ✅ Vite + React project created
- ✅ All dependencies installed
- ✅ ESLint & Prettier configured
- ✅ Project structure created
- ✅ Git initialized
- ✅ Ready for development

**Total Time**: ~3-4 hours for complete setup

**Now start building your OpenAPI Workflow Builder!**

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Made for**: Fresh Laptop Setup
