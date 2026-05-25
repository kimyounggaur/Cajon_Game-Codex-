import type { Chart, LaneId } from '../engine/chart';

const bpm = 92;
const beatMs = 60_000 / bpm;

function note(bar: number, beat: number, lane: LaneId) {
  return {
    id: `b-${bar}-${beat}-${lane}`,
    timeMs: Math.round((bar * 4 + beat) * beatMs + 1200),
    lane
  };
}

export const beginnerChart: Chart = {
  id: 'beginner',
  title: '기본 4비트',
  bpm,
  offsetMs: 0,
  durationMs: 18500,
  difficulty: 'easy',
  notes: [
    note(0, 0, 'BASS_L'),
    note(0, 1, 'SLAP_R'),
    note(0, 2, 'BASS_R'),
    note(0, 3, 'SLAP_L'),
    note(1, 0, 'BASS_L'),
    note(1, 1, 'SLAP_R'),
    note(1, 2, 'BASS_R'),
    note(1, 3, 'SLAP_L'),
    note(2, 0, 'BASS_L'),
    note(2, 1, 'SLAP_L'),
    note(2, 2, 'BASS_R'),
    note(2, 3, 'SLAP_R'),
    note(3, 0, 'BASS_L'),
    note(3, 1, 'SLAP_R'),
    note(3, 2, 'BASS_R'),
    note(3, 3, 'SLAP_L')
  ]
};
