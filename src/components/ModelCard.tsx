import { Link } from 'react-router-dom'
import type { Artifact } from '@/data/models'
import { formatBytes, formatCount, formatDate } from '@/lib/format'
import { DownloadIcon, UploadIcon, CubeIcon, DatasetIcon } from './icons'

export function ModelCard({ artifact }: { artifact: Artifact }) {
  return (
    <Link
      to={`/artifact/${artifact.id}`}
      className="card card-hover group flex flex-col gap-3 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-800 text-ink-300 ring-1 ring-ink-700">
            {artifact.kind === 'model' ? (
              <CubeIcon className="h-4.5 w-4.5" />
            ) : (
              <DatasetIcon className="h-4.5 w-4.5" />
            )}
          </span>
          <div>
            <p className="font-mono text-sm font-semibold text-ink-50 group-hover:text-brand-400 transition-colors">
              {artifact.name}
            </p>
            <p className="text-xs text-ink-400">{artifact.author}</p>
          </div>
        </div>
        <span className="chip">{artifact.license}</span>
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-ink-300">{artifact.summary}</p>

      <div className="flex flex-wrap gap-1.5">
        {artifact.tags.slice(0, 4).map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-4 border-t border-ink-700/60 pt-3 text-xs text-ink-400">
        <span className="inline-flex items-center gap-1" title="Seeders">
          <UploadIcon className="h-3.5 w-3.5 text-brand-400" />
          {artifact.seeders}
        </span>
        <span className="inline-flex items-center gap-1" title="Leechers">
          <DownloadIcon className="h-3.5 w-3.5 text-ink-400" />
          {artifact.leechers}
        </span>
        <span>{formatBytes(artifact.torrent.sizeBytes)}</span>
        <span className="ml-auto">{formatCount(artifact.downloads)} dl</span>
        <span>{formatDate(artifact.updated)}</span>
      </div>
    </Link>
  )
}
