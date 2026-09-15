import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
// Catches the browser's install prompt before any screen could miss it.
import './lib/installPrompt'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
