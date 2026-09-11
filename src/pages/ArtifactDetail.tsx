import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getArtifact, ARTIFACTS } from '@/data/models'
import { ModelCard } from '@/components/ModelCard'
import { DownloadPanel } from '@/components/DownloadPanel'
import { AdSlot } from '@/components/AdSlot'
import { formatBytes, formatCount, formatDate } from '@/lib/format'
import { copyText } from '@/lib/clipboard'
import { CopyIcon, CubeIcon, DatasetIcon, UploadIcon, CheckIcon } from '@/components/icons'
import { NotFoundPage } from './NotFound'

function UsageSnippet({ artifact }: { artifact: NonNullable<ReturnType<typeof getArtifact>> }) {
  const [copied, setCopied] = useState(false)
  const isGguf = artifact.files.some((f) => f.path.endsWith('.gguf'))

  const snippet = isGguf
    ? `# llama.cpp / Ollama (after the torrent finishes)\nollama run ${artifact.name}`
    : `# python (after the torrent finishes)\nimport onnxruntime as ort\nsess = ort.InferenceSession("${artifact.files[0]?.path ?? 'model.onnx'}")`

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Use it locally</h2>
        <button
          type="button"
          className="btn-ghost !px-3"
          onClick={() => {
            void copyText(snippet).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1600)
            })
          }}
        >
          {copied ? <CheckIcon className="h-4 w-4 text-brand-400" /> : <CopyIcon className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="mt-3 overflow-x-auto rounded-lg bg-ink-900 p-4 font-mono text-xs leading-relaxed text-ink-200 ring-1 ring-ink-700/70">
        <code>{snippet}</code>
      </pre>
    </section>
  )
}

export function ArtifactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const artifact = id ? getArtifact(id) : undefined

  if (!artifact) return <NotFoundPage />

  const related = ARTIFACTS.filter(
    (a) => a.id !== artifact.id && (a.kind === artifact.kind || a.author === artifact.author),
  ).slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-ink-400" aria-label="Breadcrumb">
        <Link to={artifact.kind === 'model' ? '/models' : '/datasets'} className="hover:text-ink-100">
          {artifact.kind === 'model' ? 'Models' : 'Datasets'}
        </Link>
        <span>/</span>
        <span className="font-mono text-ink-200">{artifact.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          <header>
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-800 text-ink-200 ring-1 ring-ink-700">
                {artifact.kind === 'model' ? <CubeIcon className="h-6 w-6" /> : <DatasetIcon className="h-6 w-6" />}
              </span>
              <div>
                <h1 className="font-mono text-2xl font-semibold tracking-tight text-ink-50">
                  {artifact.name}
                </h1>
                <p className="text-sm text-ink-400">
                  by {artifact.author} · updated {formatDate(artifact.updated)}
                </p>
              </div>
              <span className="chip ml-auto">{artifact.license}</span>
            </div>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-200">{artifact.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {artifact.tags.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </header>

          <DownloadPanel artifact={artifact} />

          <section className="card p-5">
            <h2 className="section-title">About this {artifact.kind}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-300">
              {artifact.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section className="card p-5">
            <h2 className="section-title">Files in this torrent</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-700 text-xs uppercase tracking-wider text-ink-400">
                    <th className="py-2 pr-4 font-medium">File</th>
                    <th className="py-2 pr-4 text-right font-medium">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {artifact.files.map((f) => (
                    <tr key={f.path} className="border-b border-ink-800/70 last:border-0">
                      <td className="py-2.5 pr-4 font-mono text-xs text-ink-200">{f.path}</td>
                      <td className="py-2.5 pr-4 text-right font-mono text-xs text-ink-400">
                        {formatBytes(f.sizeBytes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-ink-400">
              BitTorrent lets you fetch a subset of files — pick just the shard or quantization you need.
            </p>
          </section>

          <UsageSnippet artifact={artifact} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">Torrent health</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              {[
                ['Seeders', artifact.seeders],
                ['Leechers', artifact.leechers],
                ['Downloads', formatCount(artifact.downloads)],
                ['Size', formatBytes(artifact.torrent.sizeBytes)],
                ['Pieces', artifact.torrent.pieces.toLocaleString()],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <dt className="text-ink-400">{k}</dt>
                  <dd className="font-mono text-ink-100">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-brand-600/10 p-3 text-xs text-brand-300 ring-1 ring-brand-600/30">
              <UploadIcon className="h-4 w-4 shrink-0" />
              Finished with the file? Keep the client open and give back to the swarm.
            </div>
          </div>

          <AdSlot slot="sidebar" />

          <div className="card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">Spec</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {artifact.spec.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="section-title text-xl">Related</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ModelCard key={a.id} artifact={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
