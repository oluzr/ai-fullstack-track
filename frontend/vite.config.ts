import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// docker compose(dev)에서는 BACKEND_URL=http://backend:8000 으로 주입,
// 로컬에서 직접 실행할 때는 localhost로 폴백
const backendTarget = process.env.BACKEND_URL || 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/chat': {
        target: backendTarget,
        changeOrigin: true,
      },
      '/health': {
        target: backendTarget,
        changeOrigin: true,
      },
      '/concepts': {
        target: backendTarget,
        changeOrigin: true,
      },
    },
  },
})
