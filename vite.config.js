import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
      jsxRuntime: 'automatic', 
    })],
  server: {
  port:5174,
  proxy: {
    '/doctors': 'http://localhost:5000',
    '/admins': 'http://localhost:5000',
    '/appointments': 'http://localhost:5000'
  }
}

})
