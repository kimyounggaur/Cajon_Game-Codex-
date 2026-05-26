import { describe, expect, it } from 'vitest';
import { mergeBestRecord } from '../engine/progressStorage';

describe('mergeBestRecord', () => {
  it('keeps better score and updates play count', () => {
    const prev = {
      rhythmId: 'r1',
      bestScore: 1000,
      bestAccuracy: 0.8,
      bestCombo: 10,
      bestRank: 'B' as const,
      stars: 1 as const,
      playCount: 1,
      updatedAt: '2026-01-01T00:00:00.000Z'
    };

    const next = mergeBestRecord(prev, {
      rhythmId: 'r1',
      score: 1500,
      accuracy: 0.9,
      maxCombo: 20,
      rank: 'A',
      stars: 2
    });

    expect(next.bestScore).toBe(1500);
    expect(next.bestAccuracy).toBe(0.9);
    expect(next.playCount).toBe(2);
  });

  it('does not overwrite best score with a lower result', () => {
    const prev = {
      rhythmId: 'r1',
      bestScore: 2000,
      bestAccuracy: 0.95,
      bestCombo: 30,
      bestRank: 'S' as const,
      stars: 3 as const,
      playCount: 1,
      updatedAt: '2026-01-01T00:00:00.000Z'
    };

    const next = mergeBestRecord(prev, {
      rhythmId: 'r1',
      score: 500,
      accuracy: 0.5,
      maxCombo: 4,
      rank: 'D',
      stars: 0
    });

    expect(next.bestScore).toBe(2000);
    expect(next.bestAccuracy).toBe(0.95);
    expect(next.playCount).toBe(2);
  });
});
