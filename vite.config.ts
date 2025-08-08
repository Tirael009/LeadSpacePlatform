import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  appType: 'spa',
  
  // Конфигурация прокси ТОЛЬКО для разработки
  server: mode === 'development' ? {
    proxy: {
      '/directus': {
        target: 'https://directus.botika.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/directus/, ''),
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Форсированно устанавливаем CORS-заголовки
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
          });
        }
      }
    }
  } : undefined
}));