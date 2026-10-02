import React from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import App from './App'
import { routerBasename } from './routerBasename'
import '@fontsource-variable/inter'
import './index.css'
import 'highlight.js/styles/atom-one-dark.css'

const rootElement = document.getElementById('root')!

// The route this HTML was prerendered for (set by scripts/prerender.mjs).
// GitHub Pages serves 404.html, prerendered for /404, at every path it has no
// file for: a mistyped casing like /CampusHiring, an unknown project slug.
// Hydrating that markup against a different route is a guaranteed mismatch,
// so only hydrate when it was rendered for this URL; otherwise render fresh.
const prerenderedPath = rootElement.dataset.prerenderedPath
const basePath = routerBasename === '/' ? '' : routerBasename
const currentPath = window.location.pathname.slice(basePath.length).replace(/\/+$/, '') || '/'

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

if (rootElement.hasChildNodes() && prerenderedPath === currentPath) {
  hydrateRoot(rootElement, app)
} else {
  rootElement.replaceChildren()
  createRoot(rootElement).render(app)
}
