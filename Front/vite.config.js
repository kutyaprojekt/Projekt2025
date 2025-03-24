import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/Projekt2025", // github
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
