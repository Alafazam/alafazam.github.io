import React from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')!
const root = rootElement.hasChildNodes()
  ? hydrateRoot(rootElement, 
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  : createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    ) 