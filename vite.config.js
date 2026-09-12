import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()])
  ],
  preview: {
    host: true,
    port: 3000,
    allowedHosts: true // Libera o DuckDNS e qualquer Host header sem restrição
  }
})