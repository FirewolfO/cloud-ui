import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const signinTarget = env.VITE_SIGNIN_PROXY_TARGET || 'http://127.0.0.1:8084'

  return {
    plugins: [vue()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      port: 5176,
      strictPort: true,
      proxy: {
        '/api': { target: signinTarget, changeOrigin: true },
        '/actuator': { target: signinTarget, changeOrigin: true },
      },
    },
    test: {
      environment: 'node',
    },
  }
})
