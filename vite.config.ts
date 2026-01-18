import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create plugins array without top-level await
const getPlugins = () => {
  const plugins = [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
  ];
  
  // Only add cartographer in development within Replit
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    // This will be handled dynamically during build
  }
  
  return plugins;
};

export default defineConfig({
  plugins: getPlugins(),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    target: "esnext",
    rollupOptions: {
      output: {
        format: "esm"
      },
      external: ["esbuild", "lightningcss"]
    }
  },
});
