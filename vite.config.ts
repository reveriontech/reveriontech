import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { xaiRealtimeProxy } from './server/xai-proxy'

// https://vite.dev/config/
// Local dev: .env.development sets VITE_*_URL=/api; proxy strips /api and forwards to DEV_BACKEND_ORIGIN (default :8080).
// Production: `vite build` uses .env / .env.production with absolute VITE_API_URL and VITE_BACKEND_URL (no proxy).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devBackend = env.DEV_BACKEND_ORIGIN ?? 'http://localhost:8080'

  return {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          changeOrder: path.resolve(__dirname, 'changeorder/change-order-form.html'),
        },
      },
    },
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      tailwind(),
      xaiRealtimeProxy(env.XAI_API_KEY),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: devBackend,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, '') || '/',
        },
      },
    },
  }
})
