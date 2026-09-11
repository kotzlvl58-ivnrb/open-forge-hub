/**
 * Hand-drawn original icon set (24x24, stroke-based).
 * Drawn for this project — deliberately different from any icon library.
 */
import type { ReactNode, SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function make(name: string, path: ReactNode) {
  const C = (props: P) => (
    <svg {...base} aria-hidden="true" {...props}>
      {path}
    </svg>
  )
  C.displayName = `Icon${name}`
  return C
}

export const MagnetIcon = make(
  'Magnet',
  <>
    <path d="M6 4v7a6 6 0 0 0 12 0V4" />
    <path d="M6 4h4v6" />
    <path d="M14 4h4v6" />
    <path d="M6 11c0 3.3 2.7 6 6 6s6-2.7 6-6" />
  </>,
)

export const DownloadIcon = make(
  'Download',
  <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" />,
)

export const UploadIcon = make(
  'Upload',
  <path d="M12 14V4m0 0 4 4m-4-4-4 4M5 19h14" />,
)

export const SearchIcon = make('Search', 
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </>,
)

export const HeartIcon = make('Heart',
  <path d="M12 19.5s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10.5c0 4.65-7 9-7 9Z" />,
)

export const CubeIcon = make('Cube',
  <>
    <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z" />
    <path d="M4 7.5 12 12l8-4.5" />
    <path d="M12 12v9" />
  </>,
)

export const DatasetIcon = make('Dataset',
  <>
    <ellipse cx="12" cy="6" rx="7" ry="2.8" />
    <path d="M5 6v12c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8V6" />
    <path d="M5 12c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8" />
  </>,
)

export const TerminalIcon = make('Terminal',
  <>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="m7 9 3 3-3 3" />
    <path d="M13 15h4" />
  </>,
)

export const LayersIcon = make('Layers',
  <>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </>,
)

export const ShieldIcon = make('Shield',
  <path d="M12 3 5 6v5c0 4.4 3 8.4 7 10 4-1.6 7-5.6 7-10V6l-7-3Z" />,
)

export const BoltIcon = make('Bolt',
  <path d="M13 3 5 13.5h5L10 21l8-10.5h-5L13 3Z" />,
)

export const CheckIcon = make('Check', <path d="m5 12.5 4.5 4.5L19 7" />)

export const CopyIcon = make('Copy',
  <>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </>,
)

export const UsersIcon = make('Users',
  <>
    <circle cx="9" cy="8.5" r="3.5" />
    <path d="M3.5 19c.7-3 2.9-4.5 5.5-4.5S13.8 16 14.5 19" />
    <path d="M15.5 5.5a3.5 3.5 0 0 1 0 6.4" />
    <path d="M17.5 14.9c1.6.7 2.7 2.1 3 4.1" />
  </>,
)

export const ArrowRightIcon = make('ArrowRight',
  <path d="M5 12h14m0 0-5-5m5 5-5 5" />,
)

export const SparkIcon = make('Spark',
  <>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="m5.6 5.6 2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8m-7.2 7.2-2.8 2.8" />
  </>,
)

export const InfoIcon = make(
  'Info',
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </>,
)

export const ScaleIcon = make(
  'Scale',
  <>
    <path d="M12 4v16" />
    <path d="M8 20h8" />
    <path d="M12 4 6 6l-2.5 6a3.5 3.5 0 0 0 7 0L8 6" />
    <path d="m12 4 6 2 2.5 6a3.5 3.5 0 0 1-7 0L16 6" />
  </>,
)
