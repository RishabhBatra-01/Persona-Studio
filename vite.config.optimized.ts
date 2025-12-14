import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    
    plugins: [
      react({
        // Enable Fast Refresh
        fastRefresh: true,
        // Optimize JSX runtime
        jsxRuntime: 'automatic',
      })
    ],
    
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    
    // OPTIMIZED BUILD CONFIGURATION
    build: {
      // Target modern browsers for smaller bundle
      target: 'es2020',
      
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
      
      // Enable minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
        },
        format: {
          comments: false,
        },
      },
      
      // Rollup optimizations
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom'],
            'gemini-sdk': ['@google/genai'],
          },
          
          // Optimize chunk file names
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      
      // Source maps for production debugging (optional)
      sourcemap: mode === 'production' ? false : true,
      
      // CSS code splitting
      cssCodeSplit: true,
    },
    
    // OPTIMIZED DEV CONFIGURATION
    optimizeDeps: {
      // Pre-bundle dependencies
      include: ['react', 'react-dom', '@google/genai'],
      
      // Exclude large dependencies from pre-bundling
      exclude: [],
    },
    
    // Performance hints
    esbuild: {
      // Drop console in production
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      
      // Optimize JSX
      jsxInject: `import React from 'react'`,
    },
  };
});
