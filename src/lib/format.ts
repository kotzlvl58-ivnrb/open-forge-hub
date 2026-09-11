/** Formatting helpers shared across the UI. */

export function formatBytes(bytes: number, digits = 1): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—'
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1000)), units.length - 1)
  const value = bytes / 1000 ** i
  return `${value.toFixed(i === 0 ? 0 : digits)} ${units[i]}`
}

export function formatSpeed(bytesPerSecond: number): string {
  return `${formatBytes(bytesPerSecond, 1)}/s`
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

export function formatDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00Z' : ''))
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function shortHash(hash: string, head = 10, tail = 6): string {
  if (!hash) return '—'
  if (hash.length <= head + tail + 1) return hash
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`
}

/**
 * Build a magnet URI with trackers and a web seed (BEP 19).
 *
 * NOTE: deliberately built by hand, NOT via URLSearchParams — the latter
 * percent-encodes the colons in `xt=urn:btih:…`, which `magnet-uri` parsers
 * do not decode (they only decode dn/tr/xs/as/ws), making the magnet
 * unreadable. The info-hash itself is hex, so it needs no escaping.
 */
export function buildMagnetURI(opts: {
  infoHash: string
  displayName: string
  trackers: string[]
  webSeed?: string
}): string {
  const parts: string[] = [`xt=urn:btih:${opts.infoHash.toLowerCase()}`]
  if (opts.displayName) parts.push(`dn=${encodeURIComponent(opts.displayName)}`)
  for (const tr of opts.trackers) parts.push(`tr=${encodeURIComponent(tr)}`)
  if (opts.webSeed) parts.push(`ws=${encodeURIComponent(opts.webSeed)}`)
  return `magnet:?${parts.join('&')}`
}

/** Human "time remaining" from bytes left and speed. */
export function formatEta(secondsRemaining: number): string {
  if (!Number.isFinite(secondsRemaining) || secondsRemaining <= 0) return '—'
  const s = Math.ceil(secondsRemaining)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ${s % 60}s`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ${m % 60}m`
  return `${Math.floor(h / 24)}d ${h % 24}h`
}
