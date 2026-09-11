import { Link } from 'react-router-dom'
import { useDownloads } from '@/state/downloads'
import { getArtifact } from '@/data/models'
import { formatBytes, formatEta, formatSpeed } from '@/lib/format'
import { DownloadIcon, BoltIcon } from '@/components/icons'

export function DownloadsPage() {
  const { downloads, stop } = useDownloads()
  const entries = Object.values(downloads)
  const active = entries.filter((d) => d.status !== 'done' && d.status !== 'error')
  const finished = entries.filter((d) => d.status === 'done')

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-50">Your downloads</h1>
        <p className="mt-2 text-ink-300">
          Live in-browser transfers. Large releases are better fetched with a native client —
          open the magnet from the artifact page and your own BitTorrent app takes over.
        </p>
      </header>

      {entries.length === 0 ? (
        <div className="card mt-10 grid place-items-center p-14 text-center">
          <BoltIcon className="h-8 w-8 text-brand-400" />
          <p className="mt-3 font-medium text-ink-100">No active transfers</p>
          <p className="mt-1 max-w-sm text-sm text-ink-400">
            Start a small download from any artifact page to see live swarm stats here.
          </p>
          <Link to="/models" className="btn-primary mt-6">
            <DownloadIcon className="h-4 w-4" /> Browse models
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {[...active, ...finished].map((d) => {
            const artifact = getArtifact(d.artifactId)
            if (!artifact) return null
            return (
              <div key={d.artifactId} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Link
                      to={`/artifact/${artifact.id}`}
                      className="font-mono text-sm font-semibold text-ink-50 hover:text-brand-400"
                    >
                      {artifact.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-400">
                      {d.status === 'connecting' && 'Looking for peers…'}
                      {d.status === 'downloading' && `↓ ${formatSpeed(d.downloadSpeed)} · ↑ ${formatSpeed(d.uploadSpeed)} · ${d.numPeers} peers`}
                      {d.status === 'done' && 'Complete — seeding until you close the tab'}
                      {d.status === 'error' && `Error: ${d.error ?? 'unknown'}`}
                      {d.status === 'downloading' && Number.isFinite(d.timeRemaining) && ` · ETA ${formatEta(d.timeRemaining / 1000)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-ink-300">
                      {formatBytes(d.downloaded)}{d.length ? ` / ${formatBytes(d.length)}` : ''}
                    </span>
                    <button
                      type="button"
                      className="text-xs text-ink-300 hover:text-ink-100 hover:underline"
                      onClick={() => void stop(d.artifactId)}
                    >
                      {d.status === 'done' ? 'Release' : 'Cancel'}
                    </button>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-700">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${d.status === 'error' ? 'bg-red-500' : 'bg-brand-500'}`}
                    style={{ width: `${Math.max(2, d.progress * 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="card mt-10 p-6">
        <h2 className="section-title">Cheat sheet: opening magnets with native clients</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-300">
          <li>
            <span className="kbd">qBittorrent</span> — File → Add torrent link → paste magnet.
            Enable “Sequential download” for streaming previews.
          </li>
          <li>
            <span className="kbd">Transmission</span> — File → Open URL. Set a bandwidth cap in
            Preferences to be kind to your ISP.
          </li>
          <li>
            <span className="kbd">aria2c</span> — <code className="font-mono text-xs">aria2c --select-file=1-3 "magnet:?xt=…"</code> to
            fetch only some files from a big shard set.
          </li>
        </ul>
      </div>
    </div>
  )
}
