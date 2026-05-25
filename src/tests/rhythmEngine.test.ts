import { describe, expect, it } from 'vitest';
import { RhythmEngine } from '../engine/rhythmEngine';
import type { Chart } from '../engine/chart';

const chart: Chart = {
  id: 'test',
  title: 'Test Groove',
  bpm: 100,
  offsetMs: 0,
  durationMs: 2500,
  difficulty: 'easy',
  notes: [
    { id: 'late', timeMs: 1000, lane: 'SLAP_L' },
    { id: 'early', timeMs: 500, lane: 'BASS_L' }
  ]
};

describe('RhythmEngine', () => {
  it('sorts notes when a chart is loaded', () => {
    const engine = new RhythmEngine();
    engine.loadChart(chart);

    expect(engine.getRuntimeNotes().map((item) => item.id)).toEqual(['early', 'late']);
  });

  it('starts and reports elapsed time', () => {
    const engine = new RhythmEngine();
    engine.loadChart(chart);
    engine.start(1000);

    const snapshot = engine.tick(1600);

    expect(snapshot.mode).toBe('playing');
    expect(snapshot.nowMs).toBe(600);
  });

  it('increases score and combo on successful hit', () => {
    const engine = new RhythmEngine();
    engine.loadChart(chart);
    engine.start(1000);

    const result = engine.hit('BASS_L', 1500);
    const snapshot = engine.tick(1500);

    expect(result?.judgement).toBe('PERFECT');
    expect(snapshot.score).toBeGreaterThan(0);
    expect(snapshot.combo).toBe(1);
  });

  it('resets combo when a note is missed', () => {
    const engine = new RhythmEngine();
    engine.loadChart(chart);
    engine.start(0);
    engine.hit('BASS_L', 500);

    const snapshot = engine.tick(1180);

    expect(snapshot.combo).toBe(0);
    expect(snapshot.counts.MISS).toBe(1);
  });

  it('enters finished mode after chart duration and miss window', () => {
    const engine = new RhythmEngine();
    engine.loadChart(chart);
    engine.start(0);

    const snapshot = engine.tick(2700);

    expect(snapshot.mode).toBe('finished');
    expect(snapshot.rank).toBe('D');
  });
});
