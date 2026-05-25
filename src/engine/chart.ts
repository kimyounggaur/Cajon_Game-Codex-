export type LaneId = 'SLAP_L' | 'SLAP_R' | 'BASS_L' | 'BASS_R';

export type HitType = 'slap' | 'bass';

export type Difficulty = 'tutorial' | 'easy' | 'normal' | 'hard';

export interface ChartNote {
  id: string;
  timeMs: number;
  lane: LaneId;
  type?: 'tap';
}

export interface Chart {
  id: string;
  title: string;
  artist?: string;
  bpm: number;
  offsetMs: number;
  durationMs: number;
  difficulty: Difficulty;
  notes: ChartNote[];
}

export function sortChartNotes(notes: ChartNote[]): ChartNote[] {
  return [...notes].sort((a, b) => a.timeMs - b.timeMs);
}

export function makeNoteFactory(bpm: number) {
  return (bar: number, beat: number, lane: LaneId): ChartNote => {
    const timeMs = Math.round(((bar * 4 + beat) * 60_000) / bpm);
    return { id: `${bar}-${beat}-${lane}`, timeMs, lane };
  };
}
