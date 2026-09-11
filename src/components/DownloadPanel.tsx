import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Artifact } from '@/data/models'
import { buildMagnetURI, formatBytes, formatEta, formatSpeed, shortHash } from '@/lib/format'
import { copyText } from '@/lib/clipboard'
import { useDownloads } from '@/state/downloads'
import { CopyIcon, CheckIcon, DownloadIcon, InfoIcon, BoltIcon } from './icons'

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="btn-ghost !px-3"
      onClick={() => {
        void copyText(text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        })
      }}
      aria-label={label}
    >
      {copied ? <CheckIcon className="h-4 w-4 text-brand-400" /> : <CopyIcon className="h-4 w-4" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export function DownloadPanel({ artifact }: { artifact: Artifact }) {
  const { downloads, start, stop } = useDownloads()
  const state = downloads[artifact.id]
  const magnet = useMemo(
    () =>
      buildMagnetURI({
        infoHash: artifact.torrent.infoHash,
        displayName: artifact.name,
        trackers: artifact.torrent.trackers,
        webSeed: artifact.torrent.webSeed,
      }),
    [artifact],
  )

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="section-title">Download</h2>
        <div className="flex items-center gap-3 text-xs text-ink-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-brand-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            {artifact.seeders} seeders · {artifact.leechers} leechers
          </span>
          <span>{formatBytes(artifact.torrent.sizeBytes)}</span>
        </div>
      </div>

      {/* Primary actions */}
      <div className="mt-4 flex flex-wrap gap-2.5">
        <a
          className="btn-primary"
          href={magnet}
        >
          <DownloadIcon className="h-4 w-4" />
          Open magnet in your client
        </a>
        <button type="button" className="btn-ghost-accent" onClick={() => void start(artifact)}>
          <BoltIcon className="h-4 w-4" />
          Download in browser
        </button>
        <a
          className="btn-ghost"
          href={`${artifact.torrent.webSeed}${artifact.name}.torrent`}
          download={`${artifact.name}.torrent`}
        >
          .torrent file
        </a>
        <CopyButton text={magnet} label="Copy magnet link" />
      </div>

      <p className="mt-2.5 text-xs leading-relaxed text-ink-400">
        The magnet carries web seeds, so it works even when the swarm is quiet. Native clients
        (qBittorrent, Transmission, Deluge) are best for large files; small files can be fetched
        right here in the browser.
      </p>

      {/* In-browser download progress */}
      {state && (
        <div className="mt-4 rounded-lg border border-ink-700 bg-ink-900 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-medium text-ink-100">
              {state.status === 'connecting' && 'Looking for peers…'}
              {state.status === 'downloading' && 'Downloading from the swarm'}
              {state.status === 'done' && 'Downloaded — you are now seeding 🎉'}
              {state.status === 'error' && 'Torrent error'}
            </span>
            <span className="font-mono text-xs text-ink-400">
              {Math.round(state.progress * 100)}% · {formatBytes(state.downloaded)}
              {state.length ? ` / ${formatBytes(state.length)}` : ''} · {state.numPeers} peers
              {state.status === 'downloading' && ` · ↓ ${formatSpeed(state.downloadSpeed)} · ↑ ${formatSpeed(state.uploadSpeed)}`}
              {state.status === 'downloading' && Number.isFinite(state.timeRemaining) && ` · ETA ${formatEta(state.timeRemaining / 1000)}`}
            </span>
          </div>

          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-ink-700">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                state.status === 'error' ? 'bg-red-500' : 'bg-brand-500'
              }`}
              style={{ width: `${Math.max(2, state.progress * 100)}%` }}
            />
          </div>

          {state.files.length > 0 && (
            <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto pr-1">
              {state.files.map((f) => (
                <li key={f.path} className="flex items-center justify-between gap-3 text-xs">
                  <span className="truncate font-mono text-ink-300">{f.path || f.name}</span>
                  <span className="shrink-0 font-mono text-ink-400">
                    {formatBytes(f.length)}
                    {state.status === 'done' && (
                      <>
                        {' · '}
                        <button
                          type="button"
                          className="text-brand-400 hover:underline"
                          onClick={() => {
                            void f.getBlob().then((blob) => {
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = f.name
                              a.click()
                              URL.revokeObjectURL(url)
                            })
                          }}
                        >
                          save
                        </button>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {state.status === 'error' && (
            <p className="mt-2 text-xs text-red-400">{state.error}</p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-ink-400">
              Browser downloads stay until you close this tab.
            </span>
            <button
              type="button"
              className="text-xs text-ink-300 hover:text-ink-100 hover:underline"
              onClick={() => void stop(artifact.id)}
            >
              {state.status === 'done' ? 'Release from browser' : 'Cancel download'}
            </button>
          </div>
        </div>
      )}

      {/* Info-hash block */}
      <div className="mt-4 rounded-lg bg-ink-900 p-3.5">
        <p className="font-mono text-xs text-ink-400">
          info-hash <span className="text-ink-200">{shortHash(artifact.torrent.infoHash, 14, 10)}</span>
          {' · '}
          {artifact.torrent.pieces.toLocaleString()} pieces · web seed{' '}
          <span className="text-ink-300">{new URL(artifact.torrent.webSeed).host}</span>
        </p>
      </div>

      <div className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-ink-400">
        <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>
          Verify checksums after download ({artifact.files.some((f) => f.path === 'SHA256SUMS') ? 'SHA256SUMS included' : 'see project README'}).
          Browser mode speaks WebTorrent (WebRTC); the same magnet works in any BitTorrent 2.0 client.
          Trouble? Read the <Link to="/about" className="text-brand-400 hover:underline">FAQ</Link>.
        </p>
      </div>
    </section>
  )
}
