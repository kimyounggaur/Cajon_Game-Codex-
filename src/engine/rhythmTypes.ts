import type { Chart, ChartNote, Difficulty, LaneId } from './chart';

export type { Chart, ChartNote, Difficulty, LaneId };

export type RhythmStyle =
  | 'basic'
  | 'pop'
  | 'rock'
  | 'ballad'
  | 'shuffle'
  | 'funk'
  | 'latin'
  | 'flamenco'
  | 'kpop'
  | 'practice'
  | 'fill';

export interface RhythmUnlockRule {
  type: 'always' | 'clearRhythm' | 'minStars' | 'minAccuracy';
  rhythmId?: string;
  stars?: number;
  accuracy?: number;
}

export interface RhythmMeta {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: Difficulty;
  level: number;
  style: RhythmStyle;
  bpm: number;
  timeSignature: '4/4' | '3/4' | '6/8' | '12/8';
  bars: number;
  tags: string[];
  learningGoal: string;
  recommendedFor: string;
  thumbnailType: 'slap' | 'bass' | 'mixed' | 'fill' | 'latin';
  unlock?: RhythmUnlockRule;
}

export interface RhythmPatternStep {
  beat: number;
  subdivision: number;
  lane: LaneId;
  accent?: boolean;
  ghost?: boolean;
  label?: string;
}

export interface PracticeLoop {
  id: string;
  title: string;
  description: string;
  startBar: number;
  endBar: number;
  recommendedBpm?: number;
}

export interface RhythmDefinition {
  meta: RhythmMeta;
  pattern: RhythmPatternStep[];
  practiceLoops: PracticeLoop[];
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  tutorial: '튜토리얼',
  beginner: '입문',
  easy: '쉬움',
  normal: '보통',
  hard: '어려움',
  expert: '전문가'
};

export const RHYTHM_STYLE_LABELS: Record<RhythmStyle, string> = {
  basic: '기본기',
  pop: '팝',
  rock: '록',
  ballad: '발라드',
  shuffle: '셔플',
  funk: '펑크',
  latin: '라틴',
  flamenco: '플라멩코',
  kpop: 'K-POP',
  practice: '연습',
  fill: '필인'
};

export const DIFFICULTIES: Difficulty[] = ['tutorial', 'beginner', 'easy', 'normal', 'hard', 'expert'];

export const RHYTHM_STYLES: RhythmStyle[] = [
  'basic',
  'pop',
  'rock',
  'ballad',
  'shuffle',
  'funk',
  'latin',
  'flamenco',
  'kpop',
  'practice',
  'fill'
];
