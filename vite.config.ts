import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"
import path from "path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
<<<<<<< HEAD
    host: '0.0.0.0',
    port: 5173,
    strictPort: true, // Garante que não troque a porta automaticamente
    watch: {
      usePolling: true // Necessário em alguns ambientes Docker
    }
=======
    host: true // permite acesso externo (ex: pelo celular na mesma rede)
>>>>>>> main
  }
})
