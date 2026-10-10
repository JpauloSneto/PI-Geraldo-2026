import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      // Gera favicon, apple-touch-icon e ícones do manifest a partir do logo
      pwaAssets: {
        image: 'public/logo.svg',
        preset: 'minimal-2023',
        includeHtmlHeadLinks: true,
        overrideManifestIcons: true,
      },
      manifest: {
        name: 'Startup Connect',
        short_name: 'StartupConnect',
        description: 'Conectando startups, investidores e mentores.',
        lang: 'pt-BR',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/index.html',
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
})
