import { Link } from 'react-router-dom'
import { MagnetIcon, ShieldIcon, BoltIcon, HeartIcon } from '@/components/icons'

const FAQ = [
  {
    q: 'Is this a Hugging Face clone?',
    a: 'No. Hugging Face is a hosting platform: uploads land on their CDN and downloads are served centrally. OpenForge is a catalog: we index torrent metadata and never touch model bytes. We were inspired by what HF got right (great metadata UX) and built a different distribution backbone.',
  },
  {
    q: 'What if there are no seeders?',
    a: 'Every magnet embeds web seeds (BEP 19) — ordinary HTTPS mirrors that any BitTorrent client can fall back to. The swarm accelerates downloads; it never holds them hostage. For browser-based WebTorrent transfers, web seeds and web peers together keep things moving.',
  },
  {
    q: 'Why is in-browser download limited?',
    a: 'Browsers speak WebTorrent over WebRTC data channels, which works best for small artifacts and previews. Multi-GB weights belong in a native client (qBittorrent, Transmission, aria2) — the same magnet works everywhere.',
  },
  {
    q: 'How do you verify files?',
    a: 'Torrents are content-addressed: the info-hash is a cryptographic commitment to the exact byte layout. We additionally publish SHA256SUMS per release, and the review pipeline re-checks hashes against the source repo.',
  },
  {
    q: 'Is this legal?',
    a: 'BitTorrent is a protocol — like HTTP, it is neutral. We only index artifacts whose licenses permit redistribution, run a takedown process, and never index pirated content. Copyright holders can reach us and listed torrents are removed within 24h.',
  },
  {
    q: 'How is this funded?',
    a: 'By the community: optional sponsorships from $3/mo and clearly-labeled partner slots. Downloads are never paywalled — the swarm is the opposite of a metered CDN. See the Support page.',
  },
]

export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-50">About OpenForge</h1>
        <p className="mt-2 text-ink-300">
          The hub is a piece of public infrastructure: an open catalog of AI artifacts whose
          bytes travel peer-to-peer.
        </p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          { icon: MagnetIcon, title: 'Catalog, not CDN', body: 'We index and verify; the swarm delivers. No egress bill caps ambition.' },
          { icon: ShieldIcon, title: 'License-first', body: 'Every artifact states its license. Redistribution must be allowed before listing.' },
          { icon: BoltIcon, title: 'Survive link rot', body: 'Web seeds plus community seeding keep releases alive decades out.' },
        ].map((f) => (
          <div key={f.title} className="card p-6">
            <f.icon className="h-5 w-5 text-brand-400" />
            <h2 className="mt-3 font-semibold text-ink-50">{f.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{f.body}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title mt-14 text-2xl">Frequently asked questions</h2>
      <div className="mt-6 space-y-3">
        {FAQ.map((item) => (
          <details key={item.q} className="card card-hover group p-5">
            <summary className="cursor-pointer list-none font-medium text-ink-50 marker:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.q}
                <span className="text-ink-400 transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">{item.a}</p>
          </details>
        ))}
      </div>

      <div className="card mt-10 flex flex-col items-start justify-between gap-4 border-brand-600/40 bg-brand-600/5 p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-semibold text-ink-50">Like what we're building?</h3>
          <p className="mt-1 text-sm text-ink-300">
            The hub runs on community backing — code, seedboxes and $3 pledges alike.
          </p>
        </div>
        <Link to="/support" className="btn-primary shrink-0">
          <HeartIcon className="h-4 w-4" /> Support the hub
        </Link>
      </div>
    </div>
  )
}
