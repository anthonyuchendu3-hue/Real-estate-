import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ===== IMPORTANT: Set base to '/' for Render =====
  base: '/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ Proxy error:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('➡️  Proxying:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('⬅️  Proxy response:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  // ===== Build configuration =====
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})