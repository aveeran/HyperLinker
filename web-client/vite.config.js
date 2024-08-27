import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import postcss from './postcss.config.js';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss
  },
  build: {
    rollupOptions: {
      input: {
        background: path.resolve(__dirname, 'src/background/background.js'),
        content: path.resolve(__dirname, 'src/content/content.js'),
        index: path.resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    }
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils/')
    }
  }
});
