import type { Difficulty, RhythmDefinition } from '../../engine/rhythmTypes';
import { beginnerRhythms } from './beginner';
import { easyRhythms } from './easy';
import { expertRhythms } from './expert';
import { hardRhythms } from './hard';
import { normalRhythms } from './normal';
import { tutorialRhythms } from './tutorial';

export const RHYTHM_CATALOG: RhythmDefinition[] = [
  ...tutorialRhythms,
  ...beginnerRhythms,
  ...easyRhythms,
  ...normalRhythms,
  ...hardRhythms,
  ...expertRhythms
];

export function getRhythmById(id: string): RhythmDefinition | undefined {
  return RHYTHM_CATALOG.find((rhythm) => rhythm.meta.id === id);
}

export function getRhythmsByDifficulty(difficulty: Difficulty): RhythmDefinition[] {
  return RHYTHM_CATALOG.filter((rhythm) => rhythm.meta.difficulty === difficulty);
}
