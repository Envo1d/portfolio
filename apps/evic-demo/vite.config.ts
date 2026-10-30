import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
      'next/navigation': fileURLToPath(new URL('./demo/navigation.ts', import.meta.url)),
      'next/link': fileURLToPath(new URL('./demo/link.tsx', import.meta.url)),
      'next/image': fileURLToPath(new URL('./demo/image.tsx', import.meta.url)),
    },
  },
})
