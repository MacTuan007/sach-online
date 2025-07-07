import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/send-email': 'http://localhost:5000',
    },
    host : true,
    port : 5000,
    allowedHosts: ['maximum-guinea-eternal.ngrok-free.app'],
    cors: true,
  },
  build: {
    outDir: 'dist', // Đảm bảo giống đường dẫn trong server.js
  }
})
