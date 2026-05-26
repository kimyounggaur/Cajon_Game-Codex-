import type { Difficulty } from './chart';
import type { Rank } from './judge';

export interface RhythmBestRecord {
  rhythmId: string;
  bestScore: number;
  bestAccuracy: number;
  bestCombo: number;
  bestRank: Rank;
  stars: 0 | 1 | 2 | 3;
  playCount: number;
  clearedAt?: string;
  updatedAt: string;
}

export interface RhythmProgressState {
  version: 1;
  records: Record<string, RhythmBestRecord>;
  lastSelectedDifficulty?: Difficulty;
  lastSelectedRhythmId?: string;
}

export interface RhythmResultInput {
  rhythmId: string;
  score: number;
  accuracy: number;
  maxCombo: number;
  rank: Rank;
  stars: 0 | 1 | 2 | 3;
}

export const RHYTHM_PROGRESS_KEY = 'cajon-rhythm:rhythmProgress:v1';

export const EMPTY_RHYTHM_PROGRESS: RhythmProgressState = {
  version: 1,
  records: {}
};

export function loadRhythmProgress(): RhythmProgressState {
  const raw = readStorage(RHYTHM_PROGRESS_KEY);
  if (!raw) return { ...EMPTY_RHYTHM_PROGRESS };

  try {
    const parsed = JSON.parse(raw) as RhythmProgressState;
    if (parsed.version !== 1 || !parsed.records) return { ...EMPTY_RHYTHM_PROGRESS };
    return parsed;
  } catch {
    return { ...EMPTY_RHYTHM_PROGRESS };
  }
}

export function saveRhythmProgress(progress: RhythmProgressState): RhythmProgressState {
  writeStorage(RHYTHM_PROGRESS_KEY, JSON.stringify(progress));
  return progress;
}

export function saveLastRhythmSelection(
  progress: RhythmProgressState,
  difficulty?: Difficulty,
  rhythmId?: string
): RhythmProgressState {
  return saveRhythmProgress({
    ...progress,
    lastSelectedDifficulty: difficulty ?? progress.lastSelectedDifficulty,
    lastSelectedRhythmId: rhythmId ?? progress.lastSelectedRhythmId
  });
}

export function mergeBestRecord(
  previous: RhythmBestRecord | undefined,
  result: RhythmResultInput,
  now = new Date().toISOString()
): RhythmBestRecord {
  const playCount = (previous?.playCount ?? 0) + 1;
  const shouldReplace =
    !previous ||
    result.score > previous.bestScore ||
    result.accuracy > previous.bestAccuracy ||
    result.maxCombo > previous.bestCombo ||
    result.stars > previous.stars;

  if (!shouldReplace && previous) {
    return {
      ...previous,
      playCount,
      updatedAt: now,
      clearedAt: previous.clearedAt ?? (result.stars > 0 ? now : undefined)
    };
  }

  return {
    rhythmId: result.rhythmId,
    bestScore: result.score,
    bestAccuracy: result.accuracy,
    bestCombo: result.maxCombo,
    bestRank: result.rank,
    stars: result.stars,
    playCount,
    clearedAt: result.stars > 0 ? previous?.clearedAt ?? now : previous?.clearedAt,
    updatedAt: now
  };
}

export function saveRhythmResult(
  progress: RhythmProgressState,
  result: RhythmResultInput
): RhythmProgressState {
  const records = {
    ...progress.records,
    [result.rhythmId]: mergeBestRecord(progress.records[result.rhythmId], result)
  };
  return saveRhythmProgress({
    ...progress,
    records,
    lastSelectedRhythmId: result.rhythmId
  });
}

function readStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can fail in private browsing. Gameplay remains available.
  }
}
