export type LaneId = 'SLAP_L' | 'SLAP_R' | 'BASS_L' | 'BASS_R';

export type HitType = 'slap' | 'bass';

export type Difficulty = 'tutorial' | 'beginner' | 'easy' | 'normal' | 'hard' | 'expert';

export interface ChartNote {
  id: string;
  timeMs: number;
  lane: LaneId;
  type?: 'tap';
  accent?: boolean;
  ghost?: boolean;
}

export interface Chart {
  id: string;
  rhythmId?: string;
  title: string;
  artist?: string;
  bpm: number;
  offsetMs: number;
  durationMs: number;
  difficulty: Difficulty;
  timeSignature?: '4/4' | '3/4' | '6/8' | '12/8';
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
