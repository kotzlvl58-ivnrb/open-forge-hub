import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchArtifacts, allTags } from '@/data/models'
import type { ArtifactKind } from '@/data/models'
import { ModelCard } from '@/components/ModelCard'
import { AdSlot } from '@/components/AdSlot'
import { SearchIcon } from '@/components/icons'

type SortKey = 'downloads' | 'updated' | 'seeders' | 'size'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'downloads', label: 'Most downloaded' },
  { key: 'updated', label: 'Recently updated' },
  { key: 'seeders', label: 'Best seeded' },
  { key: 'size', label: 'Smallest first' },
]

export function ExplorePage({ kind }: { kind: ArtifactKind | 'all' }) {
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [tag, setTag] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('downloads')

  const results = useMemo(() => {
    const list = searchArtifacts({ q, kind, tag: tag ?? undefined })
    const sorted = [...list]
    switch (sort) {
      case 'updated':
        sorted.sort((a, b) => b.updated.localeCompare(a.updated))
        break
      case 'seeders':
        sorted.sort((a, b) => b.seeders - a.seeders)
        break
      case 'size':
        sorted.sort((a, b) => a.torrent.sizeBytes - b.torrent.sizeBytes)
        break
      default:
        sorted.sort((a, b) => b.downloads - a.downloads)
    }
    return sorted
  }, [q, kind, tag, sort])

  const heading = kind === 'model' ? 'Models' : kind === 'dataset' ? 'Datasets' : 'Everything'
  const subtitle =
    kind === 'dataset'
      ? 'Corpora, SFT sets and eval suites — every one a torrent'
      : 'Quantized weights for local inference — every one a torrent'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-50">{heading}</h1>
        <p className="mt-2 text-ink-300">{subtitle}</p>
      </header>

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${heading.toLowerCase()}…`}
            className="input pl-10"
            aria-label="Search"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="select !w-auto"
            aria-label="Sort results"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          {allTags()
            .slice(0, 6)
            .map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag((cur) => (cur === t ? null : t))}
                aria-pressed={tag === t}
                className={`chip-btn ${tag === t ? 'chip-btn-active' : ''}`}
              >
                {t}
              </button>
            ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-400">
        {results.length} result{results.length === 1 ? '' : 's'}
        {tag ? ` tagged “${tag}”` : ''}
      </p>

      {/* Grid */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((a) => (
          <ModelCard key={a.id} artifact={a} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="card mt-4 grid place-items-center p-12 text-center">
          <p className="text-ink-100">Nothing found{q ? ` for “${q}”` : ''}.</p>
          <p className="mt-1 text-sm text-ink-400">
            Try a broader term — or{' '}
            <Link to="/publish" className="text-brand-400 hover:underline">
              publish it yourself
            </Link>
            .
          </p>
        </div>
      )}

      <div className="mt-10">
        <AdSlot slot="inline" />
      </div>
    </div>
  )
}
