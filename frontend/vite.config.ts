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
      // prod의 nginx /api/* 리버스 프록시와 동일한 프리픽스 규칙.
      // 클라이언트 라우팅(react-router)이 /concepts 같은 경로를 직접 쓰기 때문에
      // API도 /api 프리픽스로 구분해야 dev 서버가 페이지 새로고침과 API 요청을 헷갈리지 않는다.
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
