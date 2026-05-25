import { describe, expect, it } from 'vitest';
import {
  judgeDelta,
  judgeLaneHit,
  createRuntimeNotes,
  calculateRank,
  calculateStars,
  type RuntimeNote
} from '../engine/judge';
import type { ChartNote } from '../engine/chart';

const note = (id: string, timeMs: number, lane: RuntimeNote['lane']): ChartNote => ({
  id,
  timeMs,
  lane
});

describe('judgeDelta', () => {
  it('returns PERFECT at 0ms and 44ms', () => {
    expect(judgeDelta(0)).toBe('PERFECT');
    expect(judgeDelta(44)).toBe('PERFECT');
  });

  it('returns GREAT at 46ms', () => {
    expect(judgeDelta(46)).toBe('GREAT');
  });

  it('returns GOOD at 81ms', () => {
    expect(judgeDelta(81)).toBe('GOOD');
  });

  it('returns BAD at 121ms', () => {
    expect(judgeDelta(121)).toBe('BAD');
  });

  it('returns null at 161ms', () => {
    expect(judgeDelta(161)).toBeNull();
  });
});

describe('judgeLaneHit', () => {
  it('does not judge the same note twice', () => {
    const notes = createRuntimeNotes([note('a', 1000, 'SLAP_L')]);
    const first = judgeLaneHit(notes, 'SLAP_L', 1000, 0);
    const second = judgeLaneHit(notes, 'SLAP_L', 1000, first?.comboAfter ?? 0);

    expect(first?.judgement).toBe('PERFECT');
    expect(second).toBeNull();
  });

  it('selects the nearest unjudged note on the same lane', () => {
    const notes = createRuntimeNotes([
      note('early', 800, 'BASS_L'),
      note('near', 1040, 'BASS_L'),
      note('far', 1300, 'BASS_L')
    ]);

    const result = judgeLaneHit(notes, 'BASS_L', 1000, 0);

    expect(result?.noteId).toBe('near');
    expect(result?.judgement).toBe('PERFECT');
  });

  it('does not select notes from other lanes', () => {
    const notes = createRuntimeNotes([
      note('wrong', 1000, 'SLAP_R'),
      note('right-too-far', 1300, 'SLAP_L')
    ]);

    expect(judgeLaneHit(notes, 'SLAP_L', 1000, 0)).toBeNull();
  });
});

describe('rank and stars', () => {
  it('maps accuracy to rank and stars', () => {
    expect(calculateRank(0.98)).toBe('S+');
    expect(calculateRank(0.95)).toBe('S');
    expect(calculateRank(0.9)).toBe('A');
    expect(calculateStars(0.95)).toBe(3);
    expect(calculateStars(0.85)).toBe(2);
    expect(calculateStars(0.7)).toBe(1);
  });
});
