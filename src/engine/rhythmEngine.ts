import type { Chart, LaneId } from './chart';
import {
  LANE_META,
  MISS_GRACE_MS,
  calculateAccuracy,
  calculateRank,
  calculateStars,
  createCounts,
  createRuntimeNotes,
  judgeLaneHit,
  type HitResult,
  type Judgement,
  type JudgementCounts,
  type Rank,
  type RuntimeNote
} from './judge';

export type GameModeState = 'idle' | 'countIn' | 'playing' | 'paused' | 'finished';

export interface RuntimeVisibleNote extends RuntimeNote {
  x: number;
  y: number;
  progress: number;
}

export interface FloatingJudgement {
  id: string;
  lane: LaneId;
  judgement: Judgement;
  deltaMs: number;
  createdAtMs: number;
}

export interface GameSnapshot {
  mode: GameModeState;
  nowMs: number;
  score: number;
  combo: number;
  maxCombo: number;
  accuracy: number;
  rank: Rank;
  stars: 0 | 1 | 2 | 3;
  counts: JudgementCounts;
  visibleNotes: RuntimeVisibleNote[];
  lastJudgements: FloatingJudgement[];
  chart: Chart | null;
}

export interface RhythmEngineOptions {
  calibrationMs?: number;
  noteTravelMs?: number;
}

const DEFAULT_NOTE_TRAVEL_MS = 1400;
const FLOATING_JUDGEMENT_TTL_MS = 850;

export class RhythmEngine {
  private chart: Chart | null = null;
  private notes: RuntimeNote[] = [];
  private mode: GameModeState = 'idle';
  private startedAtMs = 0;
  private pausedAtMs: number | null = null;
  private pausedTotalMs = 0;
  private score = 0;
  private combo = 0;
  private maxCombo = 0;
  private counts = createCounts();
  private lastJudgements: FloatingJudgement[] = [];
  private readonly calibrationMs: number;
  private readonly noteTravelMs: number;

  constructor(options: RhythmEngineOptions = {}) {
    this.calibrationMs = options.calibrationMs ?? 0;
    this.noteTravelMs = options.noteTravelMs ?? DEFAULT_NOTE_TRAVEL_MS;
  }

  loadChart(chart: Chart): void {
    this.chart = {
      ...chart,
      notes: [...chart.notes].sort((a, b) => a.timeMs - b.timeMs)
    };
    this.notes = createRuntimeNotes(this.chart.notes);
    this.mode = 'idle';
    this.resetScore();
  }

  getRuntimeNotes(): RuntimeNote[] {
    return this.notes.map((note) => ({ ...note }));
  }

  start(nowMs = performance.now()): void {
    if (!this.chart) {
      throw new Error('Cannot start RhythmEngine before loading a chart.');
    }

    this.notes = createRuntimeNotes(this.chart.notes);
    this.resetScore();
    this.startedAtMs = nowMs;
    this.pausedAtMs = null;
    this.pausedTotalMs = 0;
    this.mode = 'playing';
  }

  pause(nowMs = performance.now()): void {
    if (this.mode !== 'playing') return;
    this.pausedAtMs = nowMs;
    this.mode = 'paused';
  }

  resume(nowMs = performance.now()): void {
    if (this.mode !== 'paused' || this.pausedAtMs === null) return;
    this.pausedTotalMs += nowMs - this.pausedAtMs;
    this.pausedAtMs = null;
    this.mode = 'playing';
  }

  stop(): void {
    this.mode = 'idle';
    this.startedAtMs = 0;
    this.pausedAtMs = null;
    this.pausedTotalMs = 0;
  }

  hit(lane: LaneId, rawInputTimeMs = performance.now()): HitResult | null {
    if (this.mode !== 'playing') return null;

    const inputTimeMs = this.toElapsedMs(rawInputTimeMs) + this.calibrationMs;
    const result = judgeLaneHit(this.notes, lane, inputTimeMs, this.combo);

    if (!result) return null;

    this.score += result.scoreDelta;
    this.combo = result.comboAfter;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    this.counts[result.judgement] += 1;
    this.lastJudgements.push({
      id: `${result.noteId}-${rawInputTimeMs}`,
      lane,
      judgement: result.judgement,
      deltaMs: result.deltaMs,
      createdAtMs: inputTimeMs
    });

    return result;
  }

  tick(rawNowMs = performance.now()): GameSnapshot {
    const nowMs = this.toElapsedMs(rawNowMs);

    if (this.mode === 'playing') {
      this.collectMisses(nowMs);

      if (this.chart && nowMs >= this.chart.durationMs + MISS_GRACE_MS) {
        this.collectMisses(Number.POSITIVE_INFINITY);
        this.mode = 'finished';
        this.combo = 0;
      }
    }

    this.lastJudgements = this.lastJudgements.filter(
      (item) => nowMs - item.createdAtMs <= FLOATING_JUDGEMENT_TTL_MS
    );

    return this.createSnapshot(nowMs);
  }

  private resetScore(): void {
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.counts = createCounts();
    this.lastJudgements = [];
  }

  private toElapsedMs(rawNowMs: number): number {
    if (this.mode === 'idle') return 0;
    const effectiveNow = this.pausedAtMs ?? rawNowMs;
    return Math.max(0, effectiveNow - this.startedAtMs - this.pausedTotalMs);
  }

  private collectMisses(nowMs: number): void {
    for (const note of this.notes) {
      if (note.judged) continue;
      if (nowMs <= note.timeMs + MISS_GRACE_MS) continue;

      note.judged = true;
      note.judgement = 'MISS';
      note.deltaMs = MISS_GRACE_MS;
      note.scoreDelta = 0;
      this.combo = 0;
      this.counts.MISS += 1;
      this.lastJudgements.push({
        id: `${note.id}-miss`,
        lane: note.lane,
        judgement: 'MISS',
        deltaMs: MISS_GRACE_MS,
        createdAtMs: note.timeMs + MISS_GRACE_MS
      });
    }
  }

  private createSnapshot(nowMs: number): GameSnapshot {
    const accuracy = calculateAccuracy(this.counts, this.chart?.notes.length ?? 0);

    return {
      mode: this.mode,
      nowMs,
      score: this.score,
      combo: this.combo,
      maxCombo: this.maxCombo,
      accuracy,
      rank: calculateRank(accuracy),
      stars: calculateStars(accuracy),
      counts: { ...this.counts },
      visibleNotes: this.getVisibleNotes(nowMs),
      lastJudgements: [...this.lastJudgements],
      chart: this.chart
    };
  }

  private getVisibleNotes(nowMs: number): RuntimeVisibleNote[] {
    return this.notes
      .filter((note) => {
        if (note.judged) return false;
        return note.timeMs - nowMs <= this.noteTravelMs && nowMs - note.timeMs <= 220;
      })
      .map((note) => {
        const laneMeta = LANE_META[note.lane];
        const progress = clamp(1 - (note.timeMs - nowMs) / this.noteTravelMs, 0, 1);
        const eased = easeOutLinear(progress);
        return {
          ...note,
          x: laneMeta.x,
          y: lerp(-12, laneMeta.y, eased),
          progress
        };
      });
  }
}

function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function easeOutLinear(progress: number): number {
  return progress;
}
