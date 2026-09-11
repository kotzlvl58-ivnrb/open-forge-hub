import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { MONETIZATION } from '@/data/monetization'

interface SupportContextValue {
  /** Demo flag: user clicked "become a backer" — shows supporter badge + disables ads. */
  isSupporter: boolean
  becomeSupporter: (tierId: string) => void
  removeSupport: () => void
  tierId: string | null
}

const SupportContext = createContext<SupportContextValue | null>(null)

const STORAGE_KEY = 'openforge.supporter'

export function SupportProvider({ children }: { children: ReactNode }) {
  const [tierId, setTierId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setTierId(JSON.parse(raw))
    } catch {
      /* ignore corrupt storage */
    }
  }, [])

  const becomeSupporter = useCallback((tier: string) => {
    setTierId(tier)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tier))
    } catch {
      /* private mode */
    }
  }, [])

  const removeSupport = useCallback(() => {
    setTierId(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    // Supporters see no ads. This is the promise of the model: attention is the currency.
    MONETIZATION.ads.enabled = !tierId
  }, [tierId])

  const value = useMemo(
    () => ({ isSupporter: tierId !== null, tierId, becomeSupporter, removeSupport }),
    [tierId, becomeSupporter, removeSupport],
  )

  return <SupportContext.Provider value={value}>{children}</SupportContext.Provider>
}

export function useSupport(): SupportContextValue {
  const ctx = useContext(SupportContext)
  if (!ctx) throw new Error('useSupport must be used inside <SupportProvider>')
  return ctx
}
