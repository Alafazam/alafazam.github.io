import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is overridable so we can publish a staging copy under a subfolder,
// e.g. DEPLOY_BASE=/preview/ serves the site at https://alafazam.com/preview/.
// Defaults to the production root.
const base = (globalThis as { process?: { env?: Record<string, string | undefined> } })
  .process?.env?.DEPLOY_BASE || '/'
const isPreview = base !== '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      // Staging builds must never be indexed — they would compete with the
      // production site in search/answer engines.
      name: 'preview-noindex',
      transformIndexHtml(html) {
        if (!isPreview) return html
        return html.replace(
          '<meta name="robots" content="index, follow" />',
          '<meta name="robots" content="noindex, nofollow" />'
        )
      },
    },
  ],
  base,  // Base path for GitHub Pages deployment (root domain by default)
  server: {
    port: 4000,
    strictPort: true, // Throw error if port is already in use instead of incrementing
    host: true, // Make the server accessible from other devices on your network
  },
})
