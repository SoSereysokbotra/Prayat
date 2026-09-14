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

interface BootcampState {
  passed: BootcampModuleId[]
  markPassed: (id: BootcampModuleId) => void
  reset: () => void
}

export const useBootcampStore = create<BootcampState>((set, get) => ({
  passed: read(),

  markPassed: (id) => {
    if (get().passed.includes(id)) return
    const next = [...get().passed, id]
    write(next)
    set({ passed: next })
  },

  reset: () => {
    write([])
    set({ passed: [] })
  },
}))

/** Every module passed — the gate is open. */
export function useBootcampComplete(): boolean {
  return useBootcampStore((s) => BOOTCAMP_MODULE_IDS.every((id) => s.passed.includes(id)))
}

export function useHasTool(tool: ToolId): boolean {
  return useBootcampStore((s) =>
    s.passed.some((id) => TOOL_OF_MODULE[id] === tool),
  )
}

/** Every tool earned so far, for the Toolbelt display. */
export function useTools(): ToolId[] {
  return useBootcampStore((s) => s.passed.map((id) => TOOL_OF_MODULE[id]))
}
