/**
 * Bootcamp progress and the Toolbelt.
 *
 * Completion lives on the device, not the server, because there are no
 * accounts. The server decides whether an answer was right; whether this phone
 * has finished the bootcamp is a fact about this phone.
 *
 * Tools are the point of the whole level. Passing a module does not award a
 * grade, it hands over something that changes how the other modes play — the
 * Magnifying Glass genuinely works inside The Investigation. Learning that
 * pays off where the player feels it is learning that sticks.
 */

import { create } from 'zustand'
import {
  BOOTCAMP_MODULE_IDS,
  TOOL_OF_MODULE,
  type BootcampModuleId,
  type ToolId,
} from '../../shared/types'

const PROGRESS_KEY = 'prayat.bootcamp'
const SKIPPED_KEY = 'prayat.bootcampSkipped'

function read(): BootcampModuleId[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is BootcampModuleId =>
      (BOOTCAMP_MODULE_IDS as readonly string[]).includes(id),
    )
  } catch {
    return []
  }
}

function write(passed: BootcampModuleId[]): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(passed))
  } catch {
    /* the session still works for this tab */
  }
}

function readSkipped(): boolean {
  try {
    return localStorage.getItem(SKIPPED_KEY) === 'true'
  } catch {
    return false
  }
}

function writeSkipped(val: boolean): void {
  try {
    if (val) localStorage.setItem(SKIPPED_KEY, 'true')
    else localStorage.removeItem(SKIPPED_KEY)
  } catch {
    /* the session still works for this tab */
  }
}

interface BootcampState {
  passed: BootcampModuleId[]
  skipped: boolean
  markPassed: (id: BootcampModuleId) => void
  skip: () => void
  reset: () => void
}

export const useBootcampStore = create<BootcampState>((set, get) => ({
  passed: read(),
  skipped: readSkipped(),

  markPassed: (id) => {
    if (get().passed.includes(id)) return
    const next = [...get().passed, id]
    write(next)
    set({ passed: next })
  },

  skip: () => {
    writeSkipped(true)
    set({ skipped: true })
  },

  reset: () => {
    write([])
    writeSkipped(false)
    set({ passed: [], skipped: false })
  },
}))

/** Every module passed — the gate is open. */
export function useBootcampComplete(): boolean {
  return useBootcampStore((s) => BOOTCAMP_MODULE_IDS.every((id) => s.passed.includes(id)))
}

export function useBootcampSkipped(): boolean {
  return useBootcampStore((s) => s.skipped)
}

export function useBootcampAccessible(): boolean {
  return useBootcampStore((s) => s.skipped || BOOTCAMP_MODULE_IDS.every((id) => s.passed.includes(id)))
}

export function useHasTool(tool: ToolId): boolean {
  return useBootcampStore((s) =>
    s.passed.some((id) => TOOL_OF_MODULE[id] === tool),
  )
}

/**
 * Every tool earned so far, for the Toolbelt display.
 *
 * Selects the stored array and maps outside the selector: a selector that
 * returns a fresh array each call reads as a change on every render, and
 * zustand v5 re-renders until React gives up — a blank screen.
 */
export function useTools(): ToolId[] {
  const passed = useBootcampStore((s) => s.passed)
  return passed.map((id) => TOOL_OF_MODULE[id])
}
