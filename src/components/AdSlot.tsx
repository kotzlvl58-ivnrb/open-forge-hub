import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MONETIZATION } from '@/data/monetization'
import { useSupport } from '@/state/support'
import { BoltIcon } from './icons'

/**
 * Monetization surface. Design rules:
 *  - Never blocks content or reads (no interstitials, no sticky overlays).
 *  - Clearly labeled "Partner" so it never masquerades as catalog content.
 *  - Disappears entirely for supporters (see state/support.tsx).
 *
 * House mode: shows a self-promo strip (zero external requests).
 * Network mode: when MONETIZATION.ads.networkTagId is set, injects the ad
 * network's <script> tag inside this container (Adsterra/a-ads/EthicalAds
 * style integration), still labeled and still hidden for supporters.
 */
export function AdSlot({
  slot,
  className = '',
}: {
  slot: 'leaderboard' | 'sidebar' | 'inline'
  className?: string
}) {
  const { isSupporter } = useSupport()
  const { enabled, networkTagId } = MONETIZATION.ads
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || isSupporter || !networkTagId || !containerRef.current) return
    const el = containerRef.current
    // Generic ad-network bootstrap. Adjust to your network's snippet.
    const script = document.createElement('script')
    script.src = `https://pl.example-ad-network.example/tag.js#${networkTagId}`
    script.async = true
    el.appendChild(script)
    return () => {
      el.removeChild(script)
    }
  }, [enabled, isSupporter, networkTagId])

  if (!enabled || isSupporter) return null

  const sizeClass =
    slot === 'leaderboard'
      ? 'h-[90px] w-full'
      : slot === 'sidebar'
        ? 'h-[250px] w-full'
        : 'h-[70px] w-full'

  return (
    <aside
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl border border-dashed border-ink-600/70 bg-ink-850/40 ${sizeClass} ${className}`}
      aria-label="Partner promotion"
    >
      <span className="absolute left-3 top-2 font-mono text-[10px] uppercase tracking-widest text-ink-400">
        Partner
      </span>
      {networkTagId ? (
        // Network fills this container when its script loads.
        <div className="grid h-full place-items-center text-xs text-ink-400">loading…</div>
      ) : (
        <Link
          to="/support"
          className="group grid h-full place-items-center px-4 pt-4 text-center"
        >
          <p className="text-sm text-ink-300">
            <span className="mr-1.5 inline-flex h-4 w-4 translate-y-0.5 items-center justify-center text-brand-400">
              <BoltIcon className="h-4 w-4" />
            </span>
            This hub is funded by its swarm — <span className="text-brand-400 group-hover:underline">back it from $3/mo</span> and never see this slot again.
          </p>
        </Link>
      )}
    </aside>
  )
}
