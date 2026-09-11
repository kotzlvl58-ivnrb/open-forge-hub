import { Link } from 'react-router-dom'
import { TerminalIcon, ShieldIcon, CheckIcon } from '@/components/icons'

const CHECKLIST = [
  'You own or have the right to share every file in the torrent.',
  'The model license permits redistribution (MIT, Apache-2.0, OpenRAIL…).',
  'You include SHA256SUMS covering every shard and weight file.',
  'You can provide at least one HTTP(S) web seed (BEP 19) that will stay up.',
  'Total size is under 2 TB and files are sharded ≤ 8 GB each.',
  'README describes the model family, context length and quantizations.',
]

export function PublishPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-50">Publish a release</h1>
        <p className="mt-2 text-ink-300">
          OpenForge never hosts your weights — you host a web seed, the community does the rest.
          Publishing is a review, not an upload.
        </p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <section className="card p-6">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600/10 text-brand-400 ring-1 ring-brand-600/30">
            <TerminalIcon className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-semibold text-ink-50">1. Create the torrent</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-300">
            Use any client to build a <span className="font-mono text-xs">.torrent</span> with
            these settings: piece size 4–16 MB, <strong className="text-ink-100">web seed URL</strong>{' '}
            pointing to your HTTP mirror, and our announce URLs. Or use{' '}
            <code className="font-mono text-xs text-ink-200">mktorrent -l 22 -a &lt;announce&gt; -w &lt;url&gt; dir/</code>.
          </p>
          <p className="mt-3 text-sm text-ink-300">
            The same files also work as an in-browser WebTorrent — no extra step, the info-hash
            is the identifier everywhere.
          </p>
        </section>

        <section className="card p-6">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600/10 text-brand-400 ring-1 ring-brand-600/30">
            <ShieldIcon className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-semibold text-ink-50">2. Submit for review</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-300">
            Open a pull request against the catalog with your metadata JSON: name, license,
            description, spec, web seed and the info-hash. Automated checks validate the hash
            format and probe your web seed; a human confirms the license story.
          </p>
          <p className="mt-3 text-sm text-ink-300">
            Review SLA: 72 hours. Rejected submissions get a written reason.
          </p>
        </section>
      </div>

      <section className="card mt-6 p-6">
        <h2 className="section-title">Checklist</h2>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {CHECKLIST.map((c) => (
            <li key={c} className="flex items-start gap-2.5 text-sm text-ink-200">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="card mt-6 border-brand-600/40 bg-brand-600/5 p-6">
        <h2 className="section-title">No mirror? Borrow ours.</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">
          Backers at the Seeder tier can request burst web-seed hosting on the hub's mirrors
          (up to 250 GB per release). It keeps uploads decentralized and makes sure new
          releases never start with an empty swarm.
        </p>
        <Link to="/support" className="btn-primary mt-4">
          Learn about tiers
        </Link>
      </section>
    </div>
  )
}
