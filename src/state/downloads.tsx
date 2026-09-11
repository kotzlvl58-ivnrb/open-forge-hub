import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { torrentClient } from '@/lib/torrentClient'
import type { TorrentFileEntry } from '@/lib/torrentClient'
import type { Artifact } from '@/data/models'

export type DownloadStatus = 'connecting' | 'downloading' | 'done' | 'error'

export interface DownloadState {
  artifactId: string
  status: DownloadStatus
  progress: number
  downloaded: number
  length: number
  downloadSpeed: number
  uploadSpeed: number
  numPeers: number
  timeRemaining: number
  files: TorrentFileEntry[]
  error?: string
}

interface DownloadsContextValue {
  downloads: Record<string, DownloadState>
  start: (artifact: Artifact) => Promise<void>
  stop: (artifactId: string) => Promise<void>
}

const DownloadsContext = createContext<DownloadsContextValue | null>(null)

function blankState(artifactId: string): DownloadState {
  return {
    artifactId,
    status: 'connecting',
    progress: 0,
    downloaded: 0,
    length: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    numPeers: 0,
    timeRemaining: Number.POSITIVE_INFINITY,
    files: [],
  }
}

export function DownloadsProvider({ children }: { children: ReactNode }) {
  const [downloads, setDownloads] = useState<Record<string, DownloadState>>({})
  const disposers = useRef(new Map<string, () => void>())

  const start = useCallback(async (artifact: Artifact) => {
    const { id, name, torrent } = artifact
    if (disposers.current.has(id)) return

    setDownloads((prev) => ({ ...prev, [id]: prev[id] ?? blankState(id) }))

    const patch = (partial: Partial<DownloadState>) =>
      setDownloads((prev) =>
        prev[id] ? { ...prev, [id]: { ...prev[id], ...partial } } : prev,
      )

    const stopProgress = await torrentClient.start(
      torrent,
      name,
      (p) => {
        patch({
          status: p.done ? 'done' : 'downloading',
          progress: p.progress,
          downloaded: p.downloaded,
          length: p.length || torrent.sizeBytes,
          downloadSpeed: p.downloadSpeed,
          uploadSpeed: p.uploadSpeed,
          numPeers: p.numPeers,
          timeRemaining: p.timeRemaining,
        })
      },
      (files) => patch({ files }),
      () => patch({ status: 'done' }),
      (message) => patch({ status: 'error', error: message }),
    )

    disposers.current.set(id, () => {
      stopProgress()
      void torrentClient.stop(torrent.infoHash)
    })
  }, [])

  const stop = useCallback(async (artifactId: string) => {
    const dispose = disposers.current.get(artifactId)
    if (dispose) {
      dispose()
      disposers.current.delete(artifactId)
    }
    setDownloads((prev) => {
      const next = { ...prev }
      delete next[artifactId]
      return next
    })
  }, [])

  useEffect(() => {
    return () => {
      for (const dispose of disposers.current.values()) dispose()
      disposers.current.clear()
      void torrentClient.destroy()
    }
  }, [])

  const value = useMemo<DownloadsContextValue>(
    () => ({ downloads, start, stop }),
    [downloads, start, stop],
  )

  return <DownloadsContext.Provider value={value}>{children}</DownloadsContext.Provider>
}

export function useDownloads(): DownloadsContextValue {
  const ctx = useContext(DownloadsContext)
  if (!ctx) throw new Error('useDownloads must be used inside <DownloadsProvider>')
  return ctx
}
