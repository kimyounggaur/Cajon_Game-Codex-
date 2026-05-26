import { describe, expect, it } from 'vitest';
import { createRhythmFromGrid } from '../rhythms/rhythmPatternDsl';
import { createChartFromRhythm } from '../rhythms/rhythmChartFactory';

describe('createRhythmFromGrid', () => {
  it('converts basic 4/4 grid into timed notes', () => {
    const rhythm = createRhythmFromGrid({
      id: 'test-basic',
      title: 'Test Basic',
      bpm: 120,
      difficulty: 'beginner',
      level: 1,
      style: 'basic',
      timeSignature: '4/4',
      subdivision: 16,
      bars: [['B', '-', '-', '-', 'S', '-', '-', '-', 'B', '-', '-', '-', 'S', '-', '-', '-']]
    });

    expect(rhythm.pattern).toHaveLength(4);
    expect(rhythm.pattern[0].lane).toMatch(/^BASS_/);
    expect(rhythm.pattern[1].lane).toMatch(/^SLAP_/);
  });

  it('marks accent and ghost notes', () => {
    const rhythm = createRhythmFromGrid({
      id: 'test-accent',
      title: 'Test Accent',
      bpm: 100,
      difficulty: 'easy',
      level: 4,
      style: 'rock',
      bars: [['X', '-', 'g', '-']]
    });

    expect(rhythm.pattern[0].accent).toBe(true);
    expect(rhythm.pattern[1].ghost).toBe(true);
  });

  it('creates chart notes with increasing time', () => {
    const rhythm = createRhythmFromGrid({
      id: 'test-time',
      title: 'Test Time',
      bpm: 120,
      difficulty: 'easy',
      level: 4,
      style: 'pop',
      bars: [['B', '-', '-', '-', 'S', '-', '-', '-']]
    });
    const chart = createChartFromRhythm(rhythm);

    expect(chart.notes[1].timeMs).toBeGreaterThan(chart.notes[0].timeMs);
  });
});
