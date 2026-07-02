import React from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import 'highlight.js/styles/atom-one-dark.css'

const rootElement = document.getElementById('root')!
if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement, 
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) 
} 