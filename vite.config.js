import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Warnung erst ab 600 KB statt 500 KB
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React-Kern in eigenem Chunk → wird gecacht
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animationen separat
          'vendor-motion': ['framer-motion'],
          // Supabase separat
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
})
