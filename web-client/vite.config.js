import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcss from './postcss.config.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss
  },
  build: {
    rollupOptions: {
      input: {
        background: 'src/background/background.js',
        content: 'src/content/content.js',
        index: 'index.html'
      },
      output: {
        entryFileNames: '[name].js', // Ensures the filenames match the entry names
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    },
  },
  publicDir: 'public',
})
