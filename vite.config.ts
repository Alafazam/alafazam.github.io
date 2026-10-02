import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'
import { isPublished, renderContent } from './src/content/render'

// Base path is overridable so we can publish a staging copy under a subfolder,
// e.g. DEPLOY_BASE=/preview/ serves the site at https://alafazam.com/preview/.
// Defaults to the production root.
const base = (globalThis as { process?: { env?: Record<string, string | undefined> } })
  .process?.env?.DEPLOY_BASE || '/'
const isPreview = base !== '/'

// Renders Markdown at build time: an import of `post.md?content` (see the
// globs in src/utils/content.ts) becomes { frontmatter, html, excerpt }, so the
// browser never downloads markdown-it or highlight.js. Drafts become null
// unless VITE_SHOW_DRAFTS=1 (deploy:preview), so their text never ships.
function markdownContent(): Plugin {
  const showDrafts = process.env.VITE_SHOW_DRAFTS === '1'
  return {
    name: 'markdown-content',
    enforce: 'pre',
    load(id) {
      // The dev server may add its own params (e.g. `?import&content`).
      const [file, query = ''] = id.split('?')
      if (!file.endsWith('.md') || !new URLSearchParams(query).has('content')) return null
      const item = renderContent(readFileSync(file, 'utf8'))
      return `export default ${JSON.stringify(isPublished(item.frontmatter, showDrafts) ? item : null)}`
    },
  }
}

// Preloads Inter's Latin face so it is usually ready before first paint,
// instead of being discovered only after the CSS is parsed (a late swap shifts
// the layout). The file name is content-hashed, so it is read from the bundle.
const INTER_LATIN_FONT = /^assets\/inter-latin-wght-normal-[\w-]+\.woff2$/

function preloadInterFont(): Plugin {
  return {
    name: 'preload-inter-font',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html
      const font = Object.keys(ctx.bundle).find((name) => INTER_LATIN_FONT.test(name))
      if (!font) throw new Error('preload-inter-font: Inter Latin woff2 not found in the bundle')
      return [
        {
          tag: 'link',
          attrs: { rel: 'preload', href: `${base}${font}`, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    markdownContent(),
    preloadInterFont(),
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
