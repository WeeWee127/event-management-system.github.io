import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/event-management-system.github.io/',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  // Забезпечення доступності змінних середовища
  define: {
    'process.env': process.env
  }
});
