import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    // Serve static project HTML files before React SPA fallback
    {
      name: 'static-projects-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/projects/')) {
            const filePath = path.join(__dirname, 'public', req.url.split('?')[0])
            // Try exact path, then /index.html
            const candidates = [filePath, path.join(filePath, 'index.html')]
            for (const candidate of candidates) {
              if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
                res.setHeader('Content-Type', 'text/html; charset=utf-8')
                res.end(fs.readFileSync(candidate))
                return
              }
            }
          }
          next()
        })
      },
    },
  ],
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
