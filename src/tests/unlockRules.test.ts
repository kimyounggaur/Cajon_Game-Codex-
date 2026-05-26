import { describe, expect, it } from 'vitest';
import type { RhythmProgressState } from '../engine/progressStorage';
import { isRhythmUnlocked } from '../engine/unlockRules';
import { RHYTHM_CATALOG, getRhythmById } from '../rhythms/rhythmCatalog';

const emptyProgress: RhythmProgressState = { version: 1, records: {} };

describe('unlock rules', () => {
  it('unlocks beginner rhythms by default', () => {
    const rhythm = getRhythmById('beginner-basic-4beat');
    expect(rhythm && isRhythmUnlocked(rhythm, emptyProgress, RHYTHM_CATALOG)).toBe(true);
  });

  it('locks hard rhythms without normal clears', () => {
    const rhythm = getRhythmById('hard-rock-drive');
    expect(rhythm && isRhythmUnlocked(rhythm, emptyProgress, RHYTHM_CATALOG)).toBe(false);
  });
});
