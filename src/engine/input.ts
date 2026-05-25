import type { LaneId } from './chart';

export const KEY_TO_LANE: Record<string, LaneId> = {
  a: 'SLAP_L',
  s: 'BASS_L',
  k: 'BASS_R',
  l: 'SLAP_R'
};

export function getLaneFromKeyboardEvent(event: KeyboardEvent): LaneId | null {
  if (event.repeat) return null;
  return KEY_TO_LANE[event.key.toLowerCase()] ?? null;
}

export function shouldIgnoreKeyTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName);
}
