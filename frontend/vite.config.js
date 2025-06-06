import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    // Aponta para o seu arquivo de setup
    setupFiles: './__tests__/setupTests.js',
  },
});
