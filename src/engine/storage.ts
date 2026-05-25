import type { Rank } from './judge';

export type VisualEffectsLevel = 'low' | 'medium' | 'high';

export interface GameSettings {
  masterVolume: number;
  sfxVolume: number;
  hitVariation: boolean;
  haptics: boolean;
  visualEffects: VisualEffectsLevel;
  calibrationMs: number;
  debugHitboxes: boolean;
}

export interface BestScore {
  chartId: string;
  score: number;
  accuracy: number;
  rank: Rank;
  stars: number;
  maxCombo: number;
  playedAt: string;
}

export const SETTINGS_KEY = 'cajon-rhythm:settings:v1';
export const BEST_SCORES_KEY = 'cajon-rhythm:bestScores:v1';
export const TUTORIAL_SEEN_KEY = 'cajon-rhythm:tutorialSeen:v1';

export const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.85,
  sfxVolume: 0.9,
  hitVariation: true,
  haptics: true,
  visualEffects: 'medium',
  calibrationMs: 0,
  debugHitboxes: false
};

export function loadSettings(): GameSettings {
  const raw = readStorage(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;

  try {
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return {
      masterVolume: clampNumber(parsed.masterVolume, 0, 1, DEFAULT_SETTINGS.masterVolume),
      sfxVolume: clampNumber(parsed.sfxVolume, 0, 1, DEFAULT_SETTINGS.sfxVolume),
      hitVariation: parsed.hitVariation ?? DEFAULT_SETTINGS.hitVariation,
      haptics: parsed.haptics ?? DEFAULT_SETTINGS.haptics,
      visualEffects: isVisualEffectsLevel(parsed.visualEffects)
        ? parsed.visualEffects
        : DEFAULT_SETTINGS.visualEffects,
      calibrationMs: clampNumber(parsed.calibrationMs, -150, 150, DEFAULT_SETTINGS.calibrationMs),
      debugHitboxes: parsed.debugHitboxes ?? DEFAULT_SETTINGS.debugHitboxes
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  writeStorage(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadBestScores(): Record<string, BestScore> {
  const raw = readStorage(BEST_SCORES_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Record<string, BestScore>;
  } catch {
    return {};
  }
}

export function saveBestScore(score: BestScore): Record<string, BestScore> {
  const scores = loadBestScores();
  const existing = scores[score.chartId];
  if (!existing || score.score > existing.score || score.accuracy > existing.accuracy) {
    scores[score.chartId] = score;
    writeStorage(BEST_SCORES_KEY, JSON.stringify(scores));
  }
  return scores;
}

export function hasSeenTutorial(): boolean {
  return readStorage(TUTORIAL_SEEN_KEY) === 'true';
}

export function markTutorialSeen(): void {
  writeStorage(TUTORIAL_SEEN_KEY, 'true');
}

export function createTapCalibrationSamples(taps: number[]): number {
  if (taps.length < 2) return 0;
  const intervals = taps.slice(1).map((tap, index) => tap - taps[index]);
  const average = intervals.reduce((sum, item) => sum + item, 0) / intervals.length;
  return Math.round(average);
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
    // Storage can be unavailable in private browsing. The app remains playable.
  }
}

function clampNumber(
  value: number | undefined,
  min: number,
  max: number,
  fallback: number
): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.max(min, Math.min(max, value));
}

function isVisualEffectsLevel(value: unknown): value is VisualEffectsLevel {
  return value === 'low' || value === 'medium' || value === 'high';
}
