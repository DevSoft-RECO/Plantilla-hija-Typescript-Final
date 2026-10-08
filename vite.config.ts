// https://vite.dev/config/
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@app': path.resolve(import.meta.dirname, 'src/app'),
      '@modules': path.resolve(import.meta.dirname, 'src/modules'),
      '@services': path.resolve(import.meta.dirname, 'src/services')
    }
  }
})
