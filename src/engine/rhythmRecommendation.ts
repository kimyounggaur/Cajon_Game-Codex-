import type { RhythmDefinition } from './rhythmTypes';
import type { RhythmProgressState } from './progressStorage';

export function sortRhythmsRecommended(
  rhythms: RhythmDefinition[],
  progress: RhythmProgressState
): RhythmDefinition[] {
  return [...rhythms].sort((a, b) => getRecommendationScore(a, progress) - getRecommendationScore(b, progress));
}

export function getRecommendationReason(
  rhythm: RhythmDefinition,
  progress: RhythmProgressState
): string {
  const record = progress.records[rhythm.meta.id];
  if (!record) return `아직 클리어하지 않은 ${rhythm.meta.level}레벨 리듬이에요.`;
  if (record.stars <= 1) return '별점을 올리기 좋은 리듬이에요.';
  if (record.bestAccuracy < 0.85) return '정확도를 85% 이상으로 올려보세요.';
  return '현재 실력을 유지하며 다시 연습하기 좋아요.';
}

function getRecommendationScore(rhythm: RhythmDefinition, progress: RhythmProgressState): number {
  const record = progress.records[rhythm.meta.id];
  if (!record) return rhythm.meta.level;
  if (record.stars <= 1) return 20 + rhythm.meta.level;
  if (record.bestAccuracy < 0.85) return 40 + rhythm.meta.level;
  return 80 + rhythm.meta.level;
}
