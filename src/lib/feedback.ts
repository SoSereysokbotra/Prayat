/**
 * Sensory feedback for game actions: Web Audio API sound effects,
 * haptic vibration, and visual emotional response.
 *
 * Fully synthesized using the Web Audio API:
 *   - Zero external audio assets or network downloads required.
 *   - Zero latency on tap/click.
 *   - Works across desktop and mobile browsers.
 */

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!audioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        audioCtx = new AudioCtx()
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
    return audioCtx
  } catch {
    return null
  }
}

/**
 * Play an emotional, gritty "wrong choice" buzzer sound.
 * Dual-oscillator dissonance with downward pitch sweep and lowpass filter.
 */
export function playWrongSound(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    // Dual detuned frequencies for an emotional "wrong / fail" dissonance
    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(150, now)
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.26)

    osc2.type = 'square'
    osc2.frequency.setValueAtTime(133, now)
    osc2.frequency.exponentialRampToValueAtTime(70, now + 0.26)

    // Warm filter to avoid harshness
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, now)

    // Punchy volume envelope with quick release
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.3)
    osc2.stop(now + 0.3)
  } catch {
    // Autoplay restrictions or audio device unavailable
  }
}

/**
 * Play a cheerful, rewarding "correct choice" chime.
 * Two-note ascending bright chime.
 */
export function playCorrectSound(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, now) // D5
    osc.frequency.setValueAtTime(880, now + 0.08) // A5

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.26)
  } catch {
    // Autoplay restrictions or audio device unavailable
  }
}

/**
 * Safely trigger device haptic vibration with fallback for Android browsers.
 */
export function buzz(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      const ok = navigator.vibrate(pattern)
      // Some mobile browsers fail with array patterns, fallback to single duration
      if (!ok && Array.isArray(pattern)) {
        navigator.vibrate(200)
      }
    }
  } catch {
    // Ignore devices without haptics
  }
}

/**
 * Trigger full wrong feedback:
 *   1. Dissonant error buzzer sound
 *   2. Double-buzz haptic vibration
 */
export function triggerWrongFeedback(vibratePattern: number | number[] = [120, 60, 180]): void {
  playWrongSound()
  buzz(vibratePattern)
}

/**
 * Trigger full correct feedback:
 *   1. Pleasant ascending success chime
 *   2. Crisp single-tap haptic vibration
 */
export function triggerCorrectFeedback(vibratePattern: number | number[] = 40): void {
  playCorrectSound()
  buzz(vibratePattern)
}
