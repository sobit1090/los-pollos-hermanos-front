import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,                         // allow network / preview use
    port: process.env.PORT || 5173      // local fallback port
  },

  preview: {
    host: true,                         // required for Render
    port: process.env.PORT || 4173,     // Render auto sets PORT
    allowedHosts: ['los-pollos-hermanos-front.onrender.com'] // your frontend Render domain
  }
});
