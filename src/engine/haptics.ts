export function triggerHaptic(enabled: boolean, durationMs = 8): void {
  if (!enabled) return;
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;

  try {
    navigator.vibrate(durationMs);
  } catch {
    // Ignore unsupported platform quirks.
  }
}
