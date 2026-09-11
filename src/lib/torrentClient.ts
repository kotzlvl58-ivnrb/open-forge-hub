/**
 * WebTorrent browser client wrapper.
 *
 * Strategy: WebTorrent (~1 MB gzipped with polyfills) is loaded lazily via
 * dynamic import only when a user actually starts an in-browser download, so
 * the marketing/catalog pages stay fast.
 *
 * In the browser, WebTorrent downloads over WebRTC data channels from other
 * browser peers ("web peers") and from the HTTP web seeds embedded in our
 * magnets (BEP 19). Users with large models should use the magnet with a
 * native client (qBittorrent etc.); the in-browser path is best for small
 * artifacts and for streaming previews.
 */
import type { TorrentMeta } from '@/data/models'
import { buildMagnetURI } from './format'
// Synchronous safety net: uint8-util binds Uint8Array.prototype at import
// time, so the polyfill must already be applied when this module loads.
import './uint8Polyfill'

export interface TorrentProgress {
  progress: number // 0..1
  downloaded: number
  uploaded: number
  length: number
  downloadSpeed: number // bytes/s
  uploadSpeed: number // bytes/s
  numPeers: number
  timeRemaining: number // ms
  done: boolean
}

export interface TorrentFileEntry {
  name: string
  path: string
  length: number
  progress: number // 0..1
  getBlob: () => Promise<Blob>
}

type Unsubscribe = () => void

interface ClientHandle {
  add(
    magnetURI: string,
    onTorrent: (t: any) => void,
    onError: (err: Error) => void,
  ): void
  remove(infoHash: string, cb?: () => void): void
  destroy(): Promise<void>
}

let clientPromise: Promise<ClientHandle> | null = null

async function getClient(): Promise<ClientHandle> {
  if (!clientPromise) {
    clientPromise = (async () => {
      const mod = await import('webtorrent')
      const WebTorrent = mod.default
      const client = new WebTorrent()
      const handle: ClientHandle = {
        add(magnetURI, onTorrent, onError) {
          client.add(magnetURI, (torrent: any) => onTorrent(torrent))
          client.on('error', (err: Error) => onError(err))
        },
        remove(infoHash, cb) {
          const t = client.get(infoHash)
          if (t) client.remove(infoHash, cb)
          else cb?.()
        },
        destroy: () => client.destroy(),
      }
      return handle
    })().catch((err) => {
      clientPromise = null
      throw err
    })
  }
  return clientPromise
}

export const torrentClient = {
  /** Start (or re-attach to) a torrent. Returns a disposer. */
  async start(
    meta: TorrentMeta,
    name: string,
    onUpdate: (p: TorrentProgress) => void,
    onFiles: (files: TorrentFileEntry[]) => void,
    onDone: () => void,
    onError: (message: string) => void,
  ): Promise<Unsubscribe> {
    const client = await getClient()
    const magnetURI = buildMagnetURI({
      infoHash: meta.infoHash,
      displayName: name,
      trackers: meta.trackers,
      webSeed: meta.webSeed,
    })

    let lastUpdate = 0
    let raf: number | null = null

    const push = (t: any) => {
      const now = performance.now()
      if (now - lastUpdate < 200) {
        if (raf !== null) return
        raf = requestAnimationFrame(() => {
          raf = null
          push(t)
        })
        return
      }
      lastUpdate = now
      onUpdate({
        progress: t.progress ?? 0,
        downloaded: t.downloaded ?? 0,
        uploaded: t.uploaded ?? 0,
        length: t.length ?? 0,
        downloadSpeed: t.downloadSpeed ?? 0,
        uploadSpeed: t.uploadSpeed ?? 0,
        numPeers: t.numPeers ?? 0,
        timeRemaining: t.timeRemaining ?? Infinity,
        done: Boolean(t.done),
      })
    }

    client.add(
      magnetURI,
      (torrent) => {
        const interval = setInterval(() => push(torrent), 400)

        const mapFile = (f: any): TorrentFileEntry => ({
          name: f.name,
          path: f.path,
          length: f.length,
          progress: f.progress ?? 0,
          getBlob: () => f.blob(),
        })

        onFiles(torrent.files.map(mapFile))
        push(torrent)

        torrent.on('done', () => {
          push(torrent)
          onDone()
        })

        return () => {
          clearInterval(interval)
        }
      },
      (err) => onError(err.message ?? 'Torrent failed'),
    )

    // Disposer: caller keeps the reference; cleanup happens via stop().
    return () => {}
  },

  async stop(infoHash: string): Promise<void> {
    const client = await getClient()
    await new Promise<void>((resolve) => client.remove(infoHash, () => resolve()))
  },

  async destroy(): Promise<void> {
    if (clientPromise) {
      const client = await clientPromise
      await client.destroy()
      clientPromise = null
    }
  },
}
