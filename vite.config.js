import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/server-options#server-allowedhosts
export default defineConfig({
  plugins: [
react(),
babel({ presets: [reactCompilerPreset()] })
],
  base: '/web/',
  preview: {
    host: true,
    port: 3000,
    allowedHosts: [
'techchallenger.duckdns.org',
'localhost',
'127.0.0.1'
]
},
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