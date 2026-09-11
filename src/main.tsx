import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
// Must run before the lazy-loaded torrent client boots (see file header).
import '@/lib/uint8Polyfill'
import './index.css'
import App from './App'
import { DownloadsProvider } from '@/state/downloads'
import { SupportProvider } from '@/state/support'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <SupportProvider>
        <DownloadsProvider>
          <App />
        </DownloadsProvider>
      </SupportProvider>
    </HashRouter>
  </StrictMode>,
)
