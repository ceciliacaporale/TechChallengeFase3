import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  // Configuração para o modo preview (vite preview / npm start)
  preview: {
    host: true,
    port: 3000,
    allowedHosts: [
      'techchallenger.duckdns.org',
      'localhost',
      '127.0.0.1'
    ]
  },
  // Configuração para o modo dev (vite dev)
  server: {
    host: true,
    port: 3000,
    allowedHosts: [
      'techchallenger.duckdns.org',
      'localhost',
      '127.0.0.1'
    ]
  }
})