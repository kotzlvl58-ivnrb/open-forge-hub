import { Link } from 'react-router-dom'
import { MONETIZATION } from '@/data/monetization'
import { HeartIcon, CheckIcon } from './icons'

/** Slim band under the hero: shows who funds the swarm + CTA. */
export function SponsorStrip() {
  if (!MONETIZATION.tiers.enabled) return null
  const top = MONETIZATION.tiers.items.find((t) => t.highlight) ?? MONETIZATION.tiers.items[0]
  const backers = MONETIZATION.backers.items.slice(0, 6)

  return (
    <section className="border-y border-ink-700/60 bg-ink-850/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400">
            funded by
          </span>
          {backers.map((b) => (
            <span key={b.name} className="chip">
              {b.name}
            </span>
          ))}
          <span className="text-xs text-ink-400">+ {MONETIZATION.backers.items.length * 37} others</span>
        </div>
        <Link
          to="/support"
          className="inline-flex items-center gap-2 rounded-lg border border-brand-600/50 bg-brand-600/10 px-4 py-2 text-sm font-medium text-brand-400 transition-colors hover:bg-brand-600/20"
        >
          <HeartIcon className="h-4 w-4" />
          Keep the swarm seeding — from ${top.monthlyUsd}/mo
        </Link>
      </div>
    </section>
  )
}

/** Compact tier cards reused on Support page. */
export function TierCards({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-4 ${compact ? 'sm:grid-cols-3' : 'md:grid-cols-3'}`}>
      {MONETIZATION.tiers.items.map((tier) => (
        <div
          key={tier.id}
          className={`card relative flex flex-col p-6 ${
            tier.highlight ? 'border-brand-600/60 ring-1 ring-brand-600/30' : ''
          }`}
        >
          {tier.highlight && (
            <span className="absolute -top-2.5 left-5 rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-ink-950">
              most helpful
            </span>
          )}
          <h3 className="text-base font-semibold text-ink-50">{tier.name}</h3>
          <p className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-semibold tracking-tight text-ink-50">${tier.monthlyUsd}</span>
            <span className="text-sm text-ink-400">/ month</span>
          </p>
          <p className="mt-2 text-sm text-ink-300">{tier.blurb}</p>
          <ul className="mt-4 space-y-2">
            {tier.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm text-ink-200">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                {perk}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[11px] text-ink-400">{tier.swarmMetric}</p>
          <Link
            to={`/support?tier=${tier.id}`}
            className={tier.highlight ? 'btn-primary mt-5' : 'btn-ghost-accent mt-5'}
          >
            Back the hub
          </Link>
        </div>
      ))}
    </div>
  )
}
