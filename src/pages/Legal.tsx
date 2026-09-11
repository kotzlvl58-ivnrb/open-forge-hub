import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CopyIcon, CheckIcon, ShieldIcon, TerminalIcon, UsersIcon, ScaleIcon } from '@/components/icons'
import { copyText } from '@/lib/clipboard'

const REPORT_EMAIL = 'abuse@openforge.example'
const CONTACT_EMAIL = 'hello@openforge.example'
const SECURITY_EMAIL = 'security@openforge.example'

function CopyEmail({ email, label }: { email: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        className="btn-ghost !px-3 font-mono text-xs"
        aria-label={`Copy ${label ?? email}`}
        onClick={() => {
          void copyText(email).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1600)
          })
        }}
      >
        {copied ? <CheckIcon className="h-4 w-4 text-brand-400" /> : <CopyIcon className="h-4 w-4" />}
        {copied ? 'Copied' : email}
      </button>
      {label && <span className="text-xs text-ink-400">{label}</span>}
    </span>
  )
}

const SECTIONS = [
  { id: 'license', title: 'MIT license' },
  { id: 'report', title: 'Report content' },
  { id: 'privacy', title: 'Privacy' },
  { id: 'contact', title: 'Contact' },
] as const

export function LegalPage() {
  const [params] = useSearchParams()
  const section = params.get('section')

  useEffect(() => {
    if (!section) return
    // Delay so we win over the route-level scroll-to-top on navigation.
    // Try a smooth scroll, then fall back to an instant jump — some
    // environments silently ignore smooth scrolling.
    const t = setTimeout(() => {
      const el = document.getElementById(`legal-${section}`)
      if (!el) return
      const atTarget = () => Math.abs(el.getBoundingClientRect().top - 96) < 24
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => {
        if (!atTarget()) el.scrollIntoView({ behavior: 'instant', block: 'start' })
      }, 400)
    }, 80)
    return () => clearTimeout(t)
  }, [section])

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-50">The project</h1>
        <p className="mt-2 text-ink-300">
          Licensing, takedowns, privacy and how to reach us. The short version: the software
          is MIT, the artifacts carry their own licenses, and nobody pays for downloads.
        </p>
      </header>

      {/* Section nav */}
      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Sections">
        {SECTIONS.map((s) => (
          <Link
            key={s.id}
            to={`/legal?section=${s.id}`}
            className={`chip-btn ${section === s.id ? 'chip-btn-active' : ''}`}
          >
            {s.title}
          </Link>
        ))}
      </nav>

      {/* License */}
      <section id="legal-license" className="card mt-8 scroll-mt-24 p-6">
        <div className="flex items-center gap-3">
          <ScaleIcon className="h-5 w-5 text-brand-400" />
          <h2 className="section-title">MIT license</h2>
        </div>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-300">
          <p>
            <strong className="text-ink-100">The OpenForge Hub software</strong> — this website
            and its source code — is released under the{' '}
            <strong className="text-ink-100">MIT License</strong>. You may use, copy, modify,
            merge, publish, distribute, sublicense and sell it, provided the copyright notice
            travels with it. The full text ships in the <code className="font-mono text-xs text-ink-200">LICENSE</code> file
            of the repository.
          </p>
          <p>
            <strong className="text-ink-100">The artifacts listed in the catalog</strong> are
            <em> not</em> covered by the hub's license. Every listing declares its own license
            (MIT, Apache-2.0, OpenRAIL-M, CC-BY-4.0…), shown as a badge on the artifact page.
            Terms of use, attribution and commercial conditions are those of each artifact's
            license — check before redistributing weights or datasets.
          </p>
          <p>
            BitTorrent magnet links and info-hashes are factual metadata; the hub claims no
            ownership over indexed content and hosts no model bytes.
          </p>
        </div>
      </section>

      {/* Report */}
      <section id="legal-report" className="card mt-6 scroll-mt-24 p-6">
        <div className="flex items-center gap-3">
          <ShieldIcon className="h-5 w-5 text-brand-400" />
          <h2 className="section-title">Report content</h2>
        </div>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-300">
          <p>
            If a listed torrent infringes your rights (copyright, trademark, privacy) or
            contains material that should never have been indexed, tell us and it comes down.
            Target SLA: <strong className="text-ink-100">removal within 24 hours</strong> of a
            complete notice.
          </p>
          <p className="text-ink-200">A complete notice includes:</p>
          <ul className="ml-4 list-disc space-y-1.5">
            <li>The artifact's <span className="font-mono text-xs">info-hash</span> or listing URL</li>
            <li>The specific file(s) and right(s) allegedly infringed</li>
            <li>Proof you own or are authorized to act for the rights holder</li>
            <li>Your contact information</li>
          </ul>
          <p>
            Send to <CopyEmail email={REPORT_EMAIL} /> — a good-faith counter-notice process
            exists for erroneous reports. We publish removal statistics quarterly.
          </p>
        </div>
      </section>

      {/* Privacy */}
      <section id="legal-privacy" className="card mt-6 scroll-mt-24 p-6">
        <div className="flex items-center gap-3">
          <UsersIcon className="h-5 w-5 text-brand-400" />
          <h2 className="section-title">Privacy</h2>
        </div>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-300">
          <p>
            <strong className="text-ink-100">No accounts, no cookies, no third-party
            trackers.</strong> The site works without JavaScript storage except one
            <code className="ml-1 font-mono text-xs text-ink-200">localStorage</code> key
            (<span className="font-mono text-xs">openforge.supporter</span>) that remembers
            your demo backer status — clear it any time from your browser settings.
          </p>
          <p>
            <strong className="text-ink-100">Peer-to-peer is public by nature.</strong> When
            you use an in-browser (WebTorrent) download, your IP address is visible to other
            peers in the swarm — this is inherent to BitTorrent, not something we add. If
            that concerns you, download via a native client over a network you trust, or rely
            on the HTTPS web seed with a regular download manager.
          </p>
          <p>
            Browsing the catalog (search, listings, artifact pages) transfers no
            identifying data to the swarm — only an explicit download does. Server-side, the
            deployment keeps standard short-lived access logs for abuse prevention; there is
            no advertising profile attached to them.
          </p>
          <p>
            Privacy requests (GDPR/CCPA-style): write to the contact address below; we
            respond within 30 days.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="legal-contact" className="card mt-6 scroll-mt-24 p-6">
        <div className="flex items-center gap-3">
          <TerminalIcon className="h-5 w-5 text-brand-400" />
          <h2 className="section-title">Contact</h2>
        </div>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-300">
          <ul className="space-y-2.5">
            <li className="flex flex-wrap items-center gap-2">
              <span className="w-24 text-xs uppercase tracking-wider text-ink-400">General</span>
              <CopyEmail email={CONTACT_EMAIL} label="replies within ~72h on business days" />
            </li>
            <li className="flex flex-wrap items-center gap-2">
              <span className="w-24 text-xs uppercase tracking-wider text-ink-400">Security</span>
              <CopyEmail email={SECURITY_EMAIL} label="coordinated disclosure, 90-day window" />
            </li>
            <li className="flex flex-wrap items-center gap-2">
              <span className="w-24 text-xs uppercase tracking-wider text-ink-400">Takedowns</span>
              <CopyEmail email={REPORT_EMAIL} label="24h removal SLA" />
            </li>
          </ul>
          <p className="rounded-lg border border-ink-700 bg-ink-900 p-3 text-xs text-ink-400">
            These addresses are placeholders — replace them in{' '}
            <code className="font-mono">src/pages/Legal.tsx</code> with real inboxes before
            going to production.
          </p>
          <p>
            Sponsorship and partnerships: see the{' '}
            <Link to="/support" className="text-brand-400 hover:underline">Support page</Link>{' '}
            for tiers, or email us for a corporate package.
          </p>
        </div>
      </section>
    </div>
  )
}
