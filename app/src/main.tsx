import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.tsx'

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // SW registration failed — app still works without it
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />)
