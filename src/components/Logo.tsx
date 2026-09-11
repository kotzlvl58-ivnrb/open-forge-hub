import { Link } from 'react-router-dom'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="OpenForge Hub — home">
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg bg-ink-800 ring-1 ring-ink-600">
        {/* Anvil silhouette */}
        <svg viewBox="0 0 36 36" className="h-9 w-9" aria-hidden="true">
          <path
            d="M8 11h20v3.2c0 1.5-1.2 2.6-2.7 2.6H22c-1.4 0-2.5 1.1-2.5 2.5v2.4h-3v-2.4c0-1.4-1.1-2.5-2.5-2.5h-3.3C9.2 16.8 8 15.7 8 14.2V11Z"
            fill="currentColor"
            className="text-ink-100"
          />
          <path d="M13 24.5h10l1.5 3h-13l1.5-3Z" fill="currentColor" className="text-ink-300" />
          {/* Magnet arc */}
          <path
            d="M18 5.5a7.5 7.5 0 1 1-7.4 8.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="text-brand-400"
          />
        </svg>
      </span>
      {!compact && (
        <span className="text-[17px] font-semibold tracking-tight text-ink-50">
          OpenForge
          <span className="ml-1 font-mono text-[11px] font-medium uppercase tracking-widest text-brand-400">
            hub
          </span>
        </span>
      )}
    </Link>
  )
}
