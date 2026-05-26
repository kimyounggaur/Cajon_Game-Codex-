import type { Difficulty, RhythmDefinition } from './rhythmTypes';
import type { RhythmProgressState } from './progressStorage';

export function isRhythmUnlocked(
  rhythm: RhythmDefinition,
  progress: RhythmProgressState,
  catalog: RhythmDefinition[]
): boolean {
  const rule = rhythm.meta.unlock;
  if (rule?.type === 'always') return true;
  if (rule?.type === 'clearRhythm') {
    return Boolean(rule.rhythmId && progress.records[rule.rhythmId]?.stars);
  }
  if (rule?.type === 'minStars') {
    return Boolean(rule.rhythmId && (progress.records[rule.rhythmId]?.stars ?? 0) >= (rule.stars ?? 1));
  }
  if (rule?.type === 'minAccuracy') {
    return Boolean(rule.rhythmId && (progress.records[rule.rhythmId]?.bestAccuracy ?? 0) >= (rule.accuracy ?? 0.9));
  }

  if (rhythm.meta.difficulty === 'tutorial' || rhythm.meta.difficulty === 'beginner' || rhythm.meta.difficulty === 'easy') {
    return true;
  }

  if (rhythm.meta.difficulty === 'normal') return countCleared(catalog, progress, 'beginner', 1) >= 2;
  if (rhythm.meta.difficulty === 'hard') return countCleared(catalog, progress, 'normal', 2) >= 2;
  if (rhythm.meta.difficulty === 'expert') return countCleared(catalog, progress, 'hard', 2) >= 2;
  return true;
}

export function getUnlockMessage(
  rhythm: RhythmDefinition,
  progress: RhythmProgressState,
  catalog: RhythmDefinition[]
): string | null {
  if (isRhythmUnlocked(rhythm, progress, catalog)) return null;
  if (rhythm.meta.difficulty === 'normal') return '입문 리듬 2개를 1성 이상으로 클리어하면 열려요.';
  if (rhythm.meta.difficulty === 'hard') return '보통 리듬 2개를 2성 이상으로 클리어하면 열려요.';
  if (rhythm.meta.difficulty === 'expert') return '어려움 리듬 2개를 2성 이상으로 클리어하면 열려요.';
  return '이전 리듬을 클리어하면 열려요.';
}

function countCleared(
  catalog: RhythmDefinition[],
  progress: RhythmProgressState,
  difficulty: Difficulty,
  stars: number
): number {
  return catalog.filter((rhythm) => {
    if (rhythm.meta.difficulty !== difficulty) return false;
    return (progress.records[rhythm.meta.id]?.stars ?? 0) >= stars;
  }).length;
}
