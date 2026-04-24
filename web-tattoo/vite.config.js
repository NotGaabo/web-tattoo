import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.VITE_API_URL || env.VITE_ODOO_URL || 'http://127.0.0.1:8069';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      strictPort: false,
      open: true,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
        '/web': {
          target: backendTarget,
          changeOrigin: true,
        },
        '/website': {
          target: backendTarget,
          changeOrigin: true,
        },
        '/portal': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  };
});
