import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable minification and source maps optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Chunk splitting strategy for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor dependencies into separate chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'workflow-vendor': ['reactflow', 'zustand', 'js-yaml'],
          'tools-vendor': ['axios', '@apidevtools/swagger-parser'],
        },
      },
    },
    // Optimize module preload
    modulePreload: {
      polyfill: true,
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Sourcemap optimization for production
    sourcemap: false,
  },
  // Development optimizations
  server: {
    middlewareMode: false,
  },
})
