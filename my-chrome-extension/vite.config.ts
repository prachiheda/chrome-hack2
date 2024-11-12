import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  define: {
    'process.env': {},
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'),
        contentScript: resolve(__dirname, 'src/contentScript.tsx'),
        popup: resolve(__dirname, 'index.html'), // Assuming your popup is here
      },
      output: {
        entryFileNames: '[name].js',        // Avoid hashes in filenames
        chunkFileNames: '[name]-[hash].js', // Optional: hashes for chunks if needed
        assetFileNames: '[name].[ext]',
        dir: 'dist',
      },
    },
  },
})
