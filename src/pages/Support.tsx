import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { MONETIZATION } from '@/data/monetization'
import { TierCards } from '@/components/SponsorStrip'
import { useSupport } from '@/state/support'
import { HeartIcon, CheckIcon, BoltIcon } from '@/components/icons'

export function SupportPage() {
  const [params] = useSearchParams()
  const preselected = params.get('tier')
  const { isSupporter, tierId, becomeSupporter, removeSupport } = useSupport()
  const [chosen, setChosen] = useState<string>(preselected ?? 'seeder')

  // Keep the demo selection in sync when the user clicks a tier card while
  // already on this page (the ?tier= param changes without a remount).
  useEffect(() => {
    if (preselected) setChosen(preselected)
  }, [preselected])

  const oneOff = MONETIZATION.oneOff

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-600/40 bg-brand-600/10 px-3.5 py-1.5 text-xs font-medium text-brand-300">
          <HeartIcon className="h-3.5 w-3.5" /> Downloads stay free. Forever.
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
          Fund the swarm, not a CDN bill
        </h1>
        <p className="mt-4 text-ink-300">
          OpenForge has no paid downloads, ever. Backing pays for seedboxes, mirrors and
          review time — and buys you visibility inside a community you're already part of.
        </p>
      </header>

      {/* Tiers */}
      <section className="mt-12">
        <h2 className="section-title text-center text-xl">Recurring tiers</h2>
        <div className="mt-6">
          <TierCards />
        </div>
      </section>

      {/* One-off */}
      {oneOff.enabled && (
        <section className="card mt-10 p-6">
          <h2 className="section-title">One-off contribution</h2>
          <p className="mt-2 text-sm text-ink-300">
            Prefer a single coffee-sized thank-you? Every bit funds mirror bandwidth.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {oneOff.suggestedAmountsUsd.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => becomeSupporter(chosen)}
                className="btn-ghost"
              >
                ${amount}
              </button>
            ))}
            {oneOff.url ? (
              <a href={oneOff.url} target="_blank" rel="noreferrer" className="btn-ghost-accent">
                Open contribution page ↗
              </a>
            ) : (
              <span className="text-xs text-ink-400">
                (Connect Ko-fi/GitHub Sponsors in <code className="font-mono">src/data/monetization.ts</code>)
              </span>
            )}
          </div>
        </section>
      )}

      {/* Selected-tier confirmation (demo) */}
      <section className="card mt-6 p-6">
        <h2 className="section-title">Choose a tier (demo)</h2>
        <p className="mt-2 text-sm text-ink-300">
          This demo stores your choice locally and hides all partner slots — exactly what a
          real integration would do after a webhook from Stripe/GitHub Sponsors.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {MONETIZATION.tiers.items.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setChosen(t.id)}
              className={`chip-btn ${chosen === t.id ? 'chip-btn-active' : ''}`}
            >
              {t.name} · ${t.monthlyUsd}/mo
            </button>
          ))}
          <button
            type="button"
            className="btn-primary ml-1"
            onClick={() => becomeSupporter(chosen)}
          >
            <CheckIcon className="h-4 w-4" />
            {isSupporter ? `Switch to ${chosen}` : 'Become a backer (demo)'}
          </button>
          {isSupporter && (
            <button type="button" className="btn-ghost" onClick={removeSupport}>
              Cancel backing
            </button>
          )}
        </div>
        {isSupporter && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-600/10 px-3 py-2 text-xs text-brand-300 ring-1 ring-brand-600/30">
            <BoltIcon className="h-3.5 w-3.5" />
            Backer mode active{tierId ? ` · ${tierId}` : ''} — partner slots hidden everywhere.
          </p>
        )}
      </section>

      {/* Backer wall */}
      {MONETIZATION.backers.enabled && (
        <section className="mt-12">
          <h2 className="section-title text-xl">Backer wall</h2>
          <p className="mt-1 text-sm text-ink-400">
            The people keeping the mirrors warm. (Demo names — wire to your payments backend.)
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MONETIZATION.backers.items.map((b) => (
              <div key={b.name} className="card card-hover flex items-center gap-3 p-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-800 font-mono text-xs text-brand-400 ring-1 ring-ink-700">
                  {b.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink-100">{b.name}</p>
                  <p className="text-xs text-ink-400">
                    {b.tier} · {b.months} mo
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="mt-10 text-center text-sm text-ink-400">
        Corporate sponsorships with logo placement:{' '}
        <Link to="/legal?section=contact" className="text-brand-400 hover:underline">
          get in touch
        </Link>
        .
      </p>
    </div>
  )
}
