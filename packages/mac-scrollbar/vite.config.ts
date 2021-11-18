import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: ['es2019'],
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
});
