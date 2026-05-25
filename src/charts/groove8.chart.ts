import type { Chart, LaneId } from '../engine/chart';

const bpm = 108;
const eighthMs = 60_000 / bpm / 2;

function note(step: number, lane: LaneId) {
  return {
    id: `g-${step}-${lane}`,
    timeMs: Math.round(step * eighthMs + 1100),
    lane
  };
}

const pattern: LaneId[] = [
  'BASS_L',
  'SLAP_R',
  'BASS_R',
  'SLAP_L',
  'BASS_L',
  'SLAP_L',
  'BASS_R',
  'SLAP_R'
];

export const groove8Chart: Chart = {
  id: 'groove8',
  title: '8비트 카혼 그루브',
  bpm,
  offsetMs: 0,
  durationMs: 20500,
  difficulty: 'normal',
  notes: Array.from({ length: 32 }, (_, index) => note(index, pattern[index % pattern.length]))
};
