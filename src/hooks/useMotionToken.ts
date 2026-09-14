/**
 * Read a motion token from CSS. Never duplicate these numbers in JS —
 * global.css is the single source of truth for the feel of the chat.
 *
 *   await sleep(motionToken('--timing-typing-min'))
 */
export function motionToken(name: string): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()

  if (!raw) {
    console.warn(`[motionToken] "${name}" is not defined in global.css`)
    return 0
  }

  const value = parseFloat(raw)
  return raw.endsWith('ms') ? value : value * 1000
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
