import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV),
    'import.meta.env.DEV': process.env.NODE_ENV !== 'production',
    'import.meta.env.PROD': process.env.NODE_ENV === 'production',
  }
});