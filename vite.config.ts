import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// VITE_BASE_PATH is set by the GitHub Pages workflow. Local development and
// future Vercel previews keep serving from site root.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
