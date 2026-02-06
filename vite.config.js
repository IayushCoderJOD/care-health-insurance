import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.jsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.1.1',  // Match the version
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.1.1',  // Match the version
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: false,
        },
        // Add zustand if remote uses it
        zustand: {
          singleton: true,
          requiredVersion: false,
        },
      },
    }),
  ],

  build: {
    target: 'esnext',
    cssCodeSplit: false,
    minify: false,
  },

  preview: {
    port: 5001,
    strictPort: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})