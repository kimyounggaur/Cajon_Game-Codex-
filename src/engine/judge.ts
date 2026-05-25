import type { ChartNote, HitType, LaneId } from './chart';

export type Judgement = 'PERFECT' | 'GREAT' | 'GOOD' | 'BAD' | 'MISS';

export type Rank = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

export interface LaneMeta {
  label: string;
  sound: HitType;
  x: number;
  y: number;
  pan: number;
}

export const LANE_META: Record<LaneId, LaneMeta> = {
  SLAP_L: { label: 'Slap L', sound: 'slap', x: 18, y: 13, pan: -0.35 },
  SLAP_R: { label: 'Slap R', sound: 'slap', x: 82, y: 13, pan: 0.35 },
  BASS_L: { label: 'Bass L', sound: 'bass', x: 43, y: 53, pan: -0.15 },
  BASS_R: { label: 'Bass R', sound: 'bass', x: 57, y: 53, pan: 0.15 }
};

export const LANE_IDS = Object.keys(LANE_META) as LaneId[];

export const JUDGE_WINDOWS = {
  PERFECT: 45,
  GREAT: 80,
  GOOD: 120,
  BAD: 160
} as const;

export const MISS_GRACE_MS = 170;

export const SCORE_VALUES: Record<Judgement, number> = {
  PERFECT: 1000,
  GREAT: 700,
  GOOD: 350,
  BAD: 100,
  MISS: 0
};

export const ACCURACY_WEIGHTS: Record<Judgement, number> = {
  PERFECT: 1,
  GREAT: 0.8,
  GOOD: 0.5,
  BAD: 0.2,
  MISS: 0
};

export interface RuntimeNote extends ChartNote {
  judged: boolean;
  judgement?: Judgement;
  deltaMs?: number;
  scoreDelta?: number;
}

export interface HitResult {
  noteId: string;
  judgement: Judgement;
  deltaMs: number;
  scoreDelta: number;
  comboAfter: number;
}

export type JudgementCounts = Record<Judgement, number>;

export const EMPTY_COUNTS: JudgementCounts = {
  PERFECT: 0,
  GREAT: 0,
  GOOD: 0,
  BAD: 0,
  MISS: 0
};

export function createRuntimeNotes(notes: ChartNote[]): RuntimeNote[] {
  return [...notes]
    .sort((a, b) => a.timeMs - b.timeMs)
    .map((note) => ({ ...note, judged: false }));
}

export function judgeDelta(deltaMs: number): Judgement | null {
  const absDelta = Math.abs(deltaMs);
  if (absDelta <= JUDGE_WINDOWS.PERFECT) return 'PERFECT';
  if (absDelta <= JUDGE_WINDOWS.GREAT) return 'GREAT';
  if (absDelta <= JUDGE_WINDOWS.GOOD) return 'GOOD';
  if (absDelta <= JUDGE_WINDOWS.BAD) return 'BAD';
  return null;
}

export function scoreForJudgement(judgement: Judgement, comboAfter: number): number {
  const baseScore = SCORE_VALUES[judgement];
  const comboMultiplier = 1 + Math.min(comboAfter, 100) * 0.002;
  return Math.round(baseScore * comboMultiplier);
}

export function judgeLaneHit(
  notes: RuntimeNote[],
  lane: LaneId,
  inputTimeMs: number,
  currentCombo: number
): HitResult | null {
  const nearest = notes
    .filter((note) => !note.judged && note.lane === lane)
    .map((note) => ({ note, deltaMs: inputTimeMs - note.timeMs }))
    .sort((a, b) => Math.abs(a.deltaMs) - Math.abs(b.deltaMs))[0];

  if (!nearest) return null;

  const judgement = judgeDelta(nearest.deltaMs);
  if (!judgement) return null;

  const comboAfter = currentCombo + 1;
  const scoreDelta = scoreForJudgement(judgement, comboAfter);

  nearest.note.judged = true;
  nearest.note.judgement = judgement;
  nearest.note.deltaMs = nearest.deltaMs;
  nearest.note.scoreDelta = scoreDelta;

  return {
    noteId: nearest.note.id,
    judgement,
    deltaMs: nearest.deltaMs,
    scoreDelta,
    comboAfter
  };
}

export function createCounts(): JudgementCounts {
  return { ...EMPTY_COUNTS };
}

export function calculateAccuracy(countsOrAccuracy: JudgementCounts | number, totalNotes?: number): number {
  if (typeof countsOrAccuracy === 'number') {
    return clamp01(countsOrAccuracy);
  }

  const counts = countsOrAccuracy;
  const total =
    totalNotes ??
    counts.PERFECT + counts.GREAT + counts.GOOD + counts.BAD + counts.MISS;

  if (total <= 0) return 0;

  const weighted =
    counts.PERFECT * ACCURACY_WEIGHTS.PERFECT +
    counts.GREAT * ACCURACY_WEIGHTS.GREAT +
    counts.GOOD * ACCURACY_WEIGHTS.GOOD +
    counts.BAD * ACCURACY_WEIGHTS.BAD;

  return clamp01(weighted / total);
}

export function calculateRank(accuracy: number): Rank {
  if (accuracy >= 0.98) return 'S+';
  if (accuracy >= 0.95) return 'S';
  if (accuracy >= 0.9) return 'A';
  if (accuracy >= 0.8) return 'B';
  if (accuracy >= 0.7) return 'C';
  return 'D';
}

export function calculateStars(accuracy: number): 0 | 1 | 2 | 3 {
  if (accuracy >= 0.95) return 3;
  if (accuracy >= 0.85) return 2;
  if (accuracy >= 0.7) return 1;
  return 0;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
