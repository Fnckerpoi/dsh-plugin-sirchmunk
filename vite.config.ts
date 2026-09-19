import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'lib/.client-build',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: 'src/client.tsx',
      formats: ['cjs'],
      fileName: () => 'client.cjs'
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        exports: 'named'
      }
    }
  }
});
