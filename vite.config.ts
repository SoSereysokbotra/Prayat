import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@shared': path.resolve(__dirname, 'shared') },
  },
  server: {
    host: true, // bind 0.0.0.0 so a phone on the same network can open it
    proxy: { '/api': 'http://localhost:3001' },
  },
})
