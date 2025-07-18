import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  plugins: [react()],
  server: {
    port: 5174, // Changed to avoid port conflict
    host: true
  },
  preview: {
    port: 5174,
    host: true
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});