export interface GameClock {
  start(nowMs?: number): void;
  pause(nowMs?: number): void;
  resume(nowMs?: number): void;
  reset(): void;
  nowMs(nowMs?: number): number;
}

export class PerformanceGameClock implements GameClock {
  private startedAtMs = 0;
  private pauseStartedAtMs: number | null = null;
  private pausedTotalMs = 0;
  private running = false;

  start(nowMs = performance.now()): void {
    this.startedAtMs = nowMs;
    this.pauseStartedAtMs = null;
    this.pausedTotalMs = 0;
    this.running = true;
  }

  pause(nowMs = performance.now()): void {
    if (!this.running || this.pauseStartedAtMs !== null) return;
    this.pauseStartedAtMs = nowMs;
  }

  resume(nowMs = performance.now()): void {
    if (this.pauseStartedAtMs === null) return;
    this.pausedTotalMs += nowMs - this.pauseStartedAtMs;
    this.pauseStartedAtMs = null;
  }

  reset(): void {
    this.startedAtMs = 0;
    this.pauseStartedAtMs = null;
    this.pausedTotalMs = 0;
    this.running = false;
  }

  nowMs(nowMs = performance.now()): number {
    if (!this.running) return 0;
    const effectiveNow = this.pauseStartedAtMs ?? nowMs;
    return Math.max(0, effectiveNow - this.startedAtMs - this.pausedTotalMs);
  }
}
