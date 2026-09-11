import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { fileURLToPath } from 'node:url'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

/**
 * bittorrent-protocol marks `./mse.js` (MSE stream encryption, Node-crypto
 * based) as browser:false. esbuild honors that during dev, but Rollup fails
 * on the named imports at build time. This plugin supplies the same mapping:
 * `nativeRC4 = false` and an encryptor class that throws if ever constructed
 * (browser peers simply do not offer MSE).
 */
const VIRTUAL_MSE_STUB = '\0virtual:bittorrent-protocol-mse'
const stubBittorrentMse = {
  name: 'stub-bittorrent-protocol-mse',
  enforce: 'pre' as const,
  resolveId(source: string, importer?: string) {
    if (source.endsWith('./mse.js') && importer?.includes('bittorrent-protocol')) {
      return VIRTUAL_MSE_STUB
    }
    return null
  },
  load(id: string) {
    if (id === VIRTUAL_MSE_STUB) {
      return 'export const nativeRC4 = false\nexport class MessageStreamEncryptor { constructor() { throw new Error("MSE peer encryption is not supported in the browser") } }'
    }
    return null
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    stubBittorrentMse,
    react(),
    tailwindcss(),
    // WebTorrent depends on Node core modules/globals (Buffer, process,
    // events, path, crypto, …). Vite does not polyfill Node modules, so the
    // plugin maps them to browser polyfills (loaded only in the torrent chunk).
    nodePolyfills({
      globals: { Buffer: true, process: true, global: true },
    }),
  ],
  resolve: {
    alias: {
      '@': r('./src'),
      // torrent-discovery imports { Client } from bittorrent-dht; the browser
      // build expects an empty module (see src/lib/stubs/bittorrent-dht.ts).
      'bittorrent-dht': r('./src/lib/stubs/bittorrent-dht.ts'),
    },
  },
  define: {
    global: 'globalThis',
  },
  worker: {
    format: 'es',
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1800,
    rollupOptions: {
      output: {
        // Keep the torrent client in its own chunk so the marketing pages stay light.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('webtorrent') || id.includes('simple-peer') || id.includes('bittorrent')) {
              return 'torrent-client'
            }
          }
        },
      },
    },
  },
})
