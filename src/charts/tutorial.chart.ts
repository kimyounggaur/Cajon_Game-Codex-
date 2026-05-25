import type { Chart } from '../engine/chart';

export const tutorialChart: Chart = {
  id: 'tutorial',
  title: '첫 박자: 둥-짝',
  bpm: 80,
  offsetMs: 0,
  durationMs: 16000,
  difficulty: 'tutorial',
  notes: [
    { id: 't-1', timeMs: 1000, lane: 'BASS_L' },
    { id: 't-2', timeMs: 1750, lane: 'SLAP_R' },
    { id: 't-3', timeMs: 2500, lane: 'BASS_R' },
    { id: 't-4', timeMs: 3250, lane: 'SLAP_L' },
    { id: 't-5', timeMs: 4750, lane: 'BASS_L' },
    { id: 't-6', timeMs: 5500, lane: 'SLAP_L' },
    { id: 't-7', timeMs: 6250, lane: 'BASS_R' },
    { id: 't-8', timeMs: 7000, lane: 'SLAP_R' },
    { id: 't-9', timeMs: 8500, lane: 'BASS_L' },
    { id: 't-10', timeMs: 9250, lane: 'SLAP_R' },
    { id: 't-11', timeMs: 10000, lane: 'BASS_R' },
    { id: 't-12', timeMs: 10750, lane: 'SLAP_L' }
  ]
};
