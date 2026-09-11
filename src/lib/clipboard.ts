/**
 * Copy text to the clipboard with a fallback chain:
 *   1. Async Clipboard API (requires secure context + permission)
 *   2. Hidden-textarea + execCommand('copy') (legacy, works in most
 *      restricted/embedded contexts)
 *
 * Resolves after the copy attempt; callers show user feedback regardless,
 * since there is no reliable way to detect a silent failure.
 */
export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      /* fall through to legacy path */
    }
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.top = '-9999px'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
  } catch {
    /* nothing else we can do */
  }
  ta.remove()
}
