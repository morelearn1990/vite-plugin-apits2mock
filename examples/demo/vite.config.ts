import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import TS2Mock from 'vite-plugin-apits2mock'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss(),
    TS2Mock({
      dir: 'src/request/interfaces',
      prefix: '/api',
      wrapper: {
        error_code: '@integer(10,200)',
        reason: '@string',
        result: '@Interface',
      },
    }),
  ],
  resolve: {
    alias: { '@/': '/src/' },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://apis.juhe.cn/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
