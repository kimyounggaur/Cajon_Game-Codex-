import { describe, expect, it } from 'vitest';
import type { RhythmProgressState } from '../engine/progressStorage';
import { sortRhythmsRecommended } from '../engine/rhythmRecommendation';
import { getRhythmsByDifficulty } from '../rhythms/rhythmCatalog';

describe('sortRhythmsRecommended', () => {
  it('puts uncleared low-level rhythms first', () => {
    const rhythms = getRhythmsByDifficulty('beginner');
    const progress: RhythmProgressState = {
      version: 1,
      records: {
        'beginner-basic-4beat': {
          rhythmId: 'beginner-basic-4beat',
          bestScore: 1000,
          bestAccuracy: 0.95,
          bestCombo: 12,
          bestRank: 'S',
          stars: 3,
          playCount: 1,
          updatedAt: '2026-01-01T00:00:00.000Z'
        }
      }
    };

    const sorted = sortRhythmsRecommended(rhythms, progress);

    expect(sorted[0].meta.id).not.toBe('beginner-basic-4beat');
  });
});
