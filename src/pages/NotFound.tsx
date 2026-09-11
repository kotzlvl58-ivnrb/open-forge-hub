import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto grid max-w-2xl place-items-center px-4 py-28 text-center">
      <p className="font-mono text-7xl font-semibold text-ink-700">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-ink-50">This hash is not in the swarm</h1>
      <p className="mt-3 max-w-md text-ink-300">
        The page you asked for doesn't exist — maybe the release was moved, or the magnet
        points somewhere else entirely.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back to the hub
      </Link>
    </div>
  )
}
