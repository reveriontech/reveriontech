import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { xaiRealtimeProxy } from './server/xai-proxy'

// https://vite.dev/config/
// .env switches engines by commenting: the DEV block sets VITE_*_URL=/api, which this
// proxy strips and forwards to DEV_BACKEND_ORIGIN (default :8080); the PROD block sets
// absolute https://engine.reveriontech.com URLs for `vite build` (no proxy).
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devBackend = env.DEV_BACKEND_ORIGIN ?? 'http://localhost:8080'

  // /api only exists on the dev server's proxy. A build with it (or with no URL,
  // which falls back to localhost) would ship a site that can't reach the engine.
  if (command === 'build') {
    for (const key of ['VITE_API_URL', 'VITE_BACKEND_URL']) {
      if (!/^https?:\/\//.test(env[key] ?? '')) {
        throw new Error(
          `${key} is "${env[key] ?? ''}", which only works with \`npm run dev\`. ` +
            'Comment out the DEV block in .env and uncomment the PROD block before building.',
        )
      }
    }
  }

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
