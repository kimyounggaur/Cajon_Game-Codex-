import type { Chart, LaneId } from '../engine/chart';

const bpm = 118;
const beatMs = 60_000 / bpm;

function note(step: number, lane: LaneId, division = 1) {
  return {
    id: `f-${step}-${division}-${lane}`,
    timeMs: Math.round(step * (beatMs / division) + 1200),
    lane
  };
}

export const fillChallengeChart: Chart = {
  id: 'fillChallenge',
  title: '필인 챌린지',
  bpm,
  offsetMs: 0,
  durationMs: 19000,
  difficulty: 'hard',
  notes: [
    note(0, 'BASS_L'),
    note(1, 'SLAP_R'),
    note(2, 'BASS_R'),
    note(3, 'SLAP_L'),
    note(4, 'BASS_L'),
    note(5, 'SLAP_L'),
    note(6, 'BASS_R'),
    note(7, 'SLAP_R'),
    note(8, 'BASS_L'),
    note(9, 'SLAP_R'),
    note(10, 'BASS_R'),
    note(11, 'SLAP_L'),
    note(24, 'BASS_L', 2),
    note(25, 'SLAP_L', 2),
    note(26, 'SLAP_R', 2),
    note(27, 'BASS_R', 2),
    note(28, 'SLAP_L', 2),
    note(29, 'SLAP_R', 2),
    note(30, 'BASS_L', 2),
    note(31, 'BASS_R', 2)
  ]
};
