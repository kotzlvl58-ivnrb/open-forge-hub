import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ARTIFACTS } from '@/data/models'
import { ModelCard } from '@/components/ModelCard'
import { AdSlot } from '@/components/AdSlot'
import { SponsorStrip } from '@/components/SponsorStrip'
import { formatBytes, formatCount } from '@/lib/format'
import { MagnetIcon, BoltIcon, ShieldIcon, ArrowRightIcon, SearchIcon } from '@/components/icons'

export function HomePage() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const featured = ARTIFACTS.filter((a) => a.kind === 'model').slice(0, 6)
  const totalBytes = ARTIFACTS.reduce((acc, a) => acc + a.torrent.sizeBytes, 0)
  const totalDownloads = ARTIFACTS.reduce((acc, a) => acc + a.downloads, 0)
  const totalSeeders = ARTIFACTS.reduce((acc, a) => acc + a.seeders, 0)

  function submit(e: FormEvent) {
    e.preventDefault()
    navigate(`/models${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-ink-600/70 bg-ink-850 px-3.5 py-1.5 text-xs text-ink-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse-soft" />
              {totalSeeders} seeders online right now
            </p>
            <h1 className="animate-fade-up mt-6 text-4xl font-semibold tracking-tight text-ink-50 sm:text-6xl [text-wrap:balance]">
              Share local AI. <span className="text-brand-400">Torrent-fast.</span>
            </h1>
            <p className="animate-fade-up mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-300">
              OpenForge Hub is an open catalog of models and datasets distributed over
              BitTorrent. No rate limits, no accounts, no megabyte bills — the swarm
              carries the weight.
            </p>

            <form onSubmit={submit} className="animate-fade-up mx-auto mt-8 flex max-w-xl gap-2">
              <label className="relative flex-1">
                <MagnetIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search GGUF, safetensors, datasets…"
                  className="input !py-3 pl-10"
                  aria-label="Search the catalog"
                />
              </label>
              <button type="submit" className="btn-primary !px-5">
                <SearchIcon className="h-4.5 w-4.5 sm:mr-1" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>

            <div className="animate-fade-up mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-ink-400">
              <span>MIT licensed</span>
              <span aria-hidden>·</span>
              <span>Web seeds = mirrors built into every magnet</span>
              <span aria-hidden>·</span>
              <Link to="/publish" className="text-brand-400 hover:underline">
                Publish your model →
              </Link>
            </div>
          </div>

          {/* Stats band */}
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-xl2 border border-ink-700/70 bg-ink-700/50 sm:grid-cols-4">
            {[
              { label: 'Artifacts indexed', value: String(ARTIFACTS.length) },
              { label: 'Catalog size', value: formatBytes(totalBytes, 0) },
              { label: 'Total downloads', value: formatCount(totalDownloads) },
              { label: 'Seeding bandwidth', value: '2.4 TB/s peak' },
            ].map((s) => (
              <div key={s.label} className="bg-ink-850 px-5 py-4 text-center">
                <p className="text-xl font-semibold text-ink-50 sm:text-2xl">{s.value}</p>
                <p className="mt-0.5 text-xs text-ink-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SponsorStrip />

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="section-title text-center text-2xl">Why torrents for AI weights?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-ink-300">
          Model files are huge and frequently re-downloaded by the whole community.
          BitTorrent turns that cost into a network effect.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: BoltIcon,
              title: 'Faster with every user',
              body: 'Popular models gain seeders as people download. A 70B release saturates your line on day one instead of crawling through one origin server.',
            },
            {
              icon: ShieldIcon,
              title: 'Verifiable by design',
              body: 'Every artifact is a content-addressed info-hash with published SHA256SUMS. What you verify is what thousands of others already verified.',
            },
            {
              icon: MagnetIcon,
              title: 'Immune to link rot',
              body: 'Web seeds (BEP 19) point at ordinary HTTP mirrors, and the swarm itself is a backup. Files outlive any single host.',
            },
          ].map((f) => (
            <div key={f.title} className="card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600/10 text-brand-400 ring-1 ring-brand-600/30">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-ink-50">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured models */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-title text-2xl">Featured models</h2>
            <p className="mt-1 text-sm text-ink-400">Hand-picked releases from the community</p>
          </div>
          <Link to="/models" className="group inline-flex items-center gap-1.5 text-sm text-brand-400 hover:underline">
            Browse all <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((a) => (
            <ModelCard key={a.id} artifact={a} />
          ))}
        </div>
      </section>

      {/* Monetization: clearly-labeled slots, supporter-free */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <AdSlot slot="leaderboard" />
      </section>

      {/* Datasets teaser */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="card card-hover flex flex-col items-start justify-between gap-4 p-7 md:flex-row md:items-center">
          <div>
            <h2 className="section-title text-xl">Need training data?</h2>
            <p className="mt-1 max-w-xl text-sm text-ink-300">
              Curated corpora, SFT sets and eval suites — sharded so you can pull only the
              pieces you need, straight from the swarm.
            </p>
          </div>
          <Link to="/datasets" className="btn-ghost-accent shrink-0">
            Explore datasets <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
