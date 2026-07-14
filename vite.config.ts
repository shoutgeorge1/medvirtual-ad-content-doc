import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Large import dumps can lock files and crash Vite's watcher on Windows
      ignored: [
        '**/.tmp-*/**',
        '**/.local-masters/**',
        '**/_private/**',
      ],
    },
    proxy: {
      '/api/asset-foundry': {
        target: 'http://localhost:3456',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        motionLab: resolve(__dirname, 'motion-concept-lab.html'),
        videoLab: resolve(__dirname, 'video-production.html'),
        foundry: resolve(__dirname, 'ai-asset-foundry.html'),
      },
    },
  },
})
