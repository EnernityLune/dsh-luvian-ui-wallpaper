import type { Dispose } from '../dom'

/** Reserves the message customization hook without changing message styles yet. */
export function applyMessage(): Dispose {
  return () => {}
}
