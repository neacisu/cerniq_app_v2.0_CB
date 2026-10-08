import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const apiTarget = process.env.FIRME_API_TARGET ?? 'http://127.0.0.1:4186';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') },
    },
  },
  preview: {
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') },
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined;
          if (/react-router|react-dom|[\/]react[\/]|scheduler/.test(id)) return 'react';
          if (id.includes('@tanstack')) return 'query';
          return undefined;
        },
      },
    },
  },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
