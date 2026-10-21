import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base relativa: o build funciona em qualquer host estático (Vercel, Netlify, GitHub Pages, subpasta)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
