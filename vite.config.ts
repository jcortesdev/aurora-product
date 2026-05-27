import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths(), imagetools()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    exclude: ['node_modules', 'dist', 'tests/e2e/**'],
  },
});
