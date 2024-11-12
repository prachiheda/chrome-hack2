import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    viteStaticCopy({
      targets: [
        { src: 'public/sidepanel.html', dest: '' }, // Copy sidepanel.html directly to dist/
      ],
    }),
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
        sidepanel: resolve(__dirname, 'src/sidepanel.tsx'), // New entry point
        popup: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name].[ext]',
        dir: 'dist',
      },
    },
  },
})
