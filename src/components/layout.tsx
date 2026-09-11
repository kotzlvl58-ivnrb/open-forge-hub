import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Logo } from './Logo'
import { SearchIcon, HeartIcon } from './icons'

const NAV = [
  { to: '/models', label: 'Models' },
  { to: '/datasets', label: 'Datasets' },
  { to: '/downloads', label: 'Downloads' },
  { to: '/publish', label: 'Publish' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const searchOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const q = e.currentTarget.value.trim()
      if (q) navigate(`/models?q=${encodeURIComponent(q)}`)
      e.currentTarget.blur()
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/70 bg-ink-900/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Logo />

        <nav className="ml-2 hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm text-ink-300 transition-colors hover:text-ink-50 hover:bg-ink-800 ${
                  isActive ? 'bg-ink-800 text-ink-50' : ''
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <label className="nav-field relative hidden lg:block">
            <SearchIcon className="nav-search-icon pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              placeholder="Search models…"
              onKeyDown={searchOnEnter}
              className="nav-search"
              aria-label="Search models"
            />
          </label>

          <Link to="/support" className="btn-primary !px-3 !py-1.5 text-[13px]">
            <HeartIcon className="h-4 w-4" />
            <span className="hidden md:inline">Support</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-8 w-8 place-items-center rounded-md border border-ink-600 text-ink-200 md:hidden"
            aria-expanded={open}
            aria-label="Toggle navigation menu"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? (
                <path d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-700/70 bg-ink-900/95 shadow-xl shadow-ink-950/40 backdrop-blur-md px-4 pb-3 pt-2 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-ink-200 hover:bg-ink-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <label className="nav-field relative mt-2 sm:hidden">
            <SearchIcon className="nav-search-icon pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              placeholder="Search models…"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const q = e.currentTarget.value.trim()
                  if (q) navigate(`/models?q=${encodeURIComponent(q)}`)
                }
              }}
              className="nav-search !w-full"
              aria-label="Search models"
            />
          </label>
        </div>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-700/70 bg-ink-950/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-ink-300">
            The open hub for local AI artifacts. Every release is a torrent — no rate limits, no
            gatekeeping, no megabyte bills. MIT licensed, forever.
          </p>
          <p className="mt-4 font-mono text-xs text-ink-400">
            swarm status: <span className="text-brand-400">seeding</span>
          </p>
        </div>

        <FooterCol
          title="Browse"
          links={[
            { to: '/models', label: 'Models' },
            { to: '/datasets', label: 'Datasets' },
            { to: '/downloads', label: 'Your downloads' },
          ]}
        />
        <FooterCol
          title="Community"
          links={[
            { to: '/publish', label: 'Publish a release' },
            { to: '/about', label: 'About / FAQ' },
            { to: '/support', label: 'Support the hub' },
          ]}
        />
        <FooterCol
          title="Project"
          links={[
            { to: '/legal?section=license', label: 'MIT license' },
            { to: '/legal?section=report', label: 'Report content' },
            { to: '/legal?section=privacy', label: 'Privacy' },
            { to: '/legal?section=contact', label: 'Contact' },
          ]}
        />
      </div>
      <div className="border-t border-ink-800/80">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-2 px-4 py-4 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 OpenForge Hub contributors · MIT</p>
          <p>Downloads never pass through our servers — they flow peer-to-peer.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-ink-200 hover:text-brand-400">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
