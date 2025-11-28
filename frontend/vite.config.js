import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: ["localhost", "mljjcooking.com"],
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Vendor chunk for animations
          "vendor-motion": ["framer-motion"],
          // Vendor chunk for Stripe
          "vendor-stripe": ["@stripe/stripe-js", "@stripe/react-stripe-js"],
          // Icons
          "vendor-icons": ["lucide-react"],
        },
      },
    },
    // Target modern browsers for smaller bundle
    target: "es2020",
    // Generate source maps for production debugging (optional)
    sourcemap: false,
    // Chunk size warning limit
    chunkSizeWarningLimit: 500,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "framer-motion"],
  },
});
