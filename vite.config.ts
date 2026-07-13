import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
  },
})
