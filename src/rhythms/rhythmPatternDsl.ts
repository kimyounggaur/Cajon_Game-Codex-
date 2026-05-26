import type { Difficulty, LaneId, RhythmDefinition, RhythmPatternStep, RhythmStyle } from '../engine/rhythmTypes';

export type RhythmToken = 'BL' | 'BR' | 'SL' | 'SR' | 'B' | 'S' | 'X' | 'g' | '-' | '.';

interface CreateRhythmFromGridInput {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  bpm: number;
  difficulty: Difficulty;
  level: number;
  style: RhythmStyle;
  timeSignature?: '4/4' | '3/4' | '6/8' | '12/8';
  subdivision?: number;
  bars: string[][];
  tags?: string[];
  learningGoal?: string;
  recommendedFor?: string;
  thumbnailType?: 'slap' | 'bass' | 'mixed' | 'fill' | 'latin';
}

export function createRhythmFromGrid(input: CreateRhythmFromGridInput): RhythmDefinition {
  const timeSignature = input.timeSignature ?? '4/4';
  const subdivision = input.subdivision ?? (timeSignature === '6/8' || timeSignature === '12/8' ? 12 : 16);
  const beatsPerBar = getBeatsPerBar(timeSignature);
  const pattern: RhythmPatternStep[] = [];
  let nextBass: LaneId = 'BASS_L';
  let nextSlap: LaneId = 'SLAP_L';

  input.bars.forEach((bar, barIndex) => {
    bar.forEach((rawToken, cellIndex) => {
      const token = rawToken as RhythmToken;
      if (token === '-' || token === '.') return;

      const parsed = parseToken(token, nextBass, nextSlap);
      if (!parsed) {
        if (import.meta.env.DEV) {
          console.warn(`Unknown rhythm token "${rawToken}" in ${input.id}`);
        }
        return;
      }

      if (token === 'B') nextBass = nextBass === 'BASS_L' ? 'BASS_R' : 'BASS_L';
      if (token === 'S' || token === 'X' || token === 'g') nextSlap = nextSlap === 'SLAP_L' ? 'SLAP_R' : 'SLAP_L';

      pattern.push({
        beat: barIndex * beatsPerBar + (cellIndex / subdivision) * beatsPerBar,
        subdivision: cellIndex,
        lane: parsed.lane,
        accent: parsed.accent,
        ghost: parsed.ghost,
        label: parsed.label
      });
    });
  });

  return {
    meta: {
      id: input.id,
      title: input.title,
      subtitle: input.subtitle ?? `${input.bpm} BPM · Lv.${input.level}`,
      description: input.description ?? `${input.title} 리듬을 연습합니다.`,
      difficulty: input.difficulty,
      level: input.level,
      style: input.style,
      bpm: input.bpm,
      timeSignature,
      bars: input.bars.length,
      tags: input.tags ?? [input.style, input.difficulty],
      learningGoal: input.learningGoal ?? '정확한 타이밍과 손 위치를 익히기',
      recommendedFor: input.recommendedFor ?? '카혼 리듬을 단계적으로 연습하는 사용자',
      thumbnailType: input.thumbnailType ?? inferThumbnail(input.style)
    },
    pattern,
    practiceLoops: [
      {
        id: 'loop-main',
        title: '핵심 패턴 루프',
        description: '첫 구간을 반복하며 손 위치와 박자를 익힙니다.',
        startBar: 0,
        endBar: Math.min(1, Math.max(0, input.bars.length - 1)),
        recommendedBpm: Math.max(60, input.bpm - 10)
      }
    ]
  };
}

export function getBeatsPerBar(timeSignature: RhythmDefinition['meta']['timeSignature']): number {
  if (timeSignature === '3/4') return 3;
  if (timeSignature === '6/8') return 2;
  if (timeSignature === '12/8') return 4;
  return 4;
}

function parseToken(
  token: RhythmToken,
  nextBass: LaneId,
  nextSlap: LaneId
): { lane: LaneId; accent?: boolean; ghost?: boolean; label?: string } | null {
  if (token === 'BL') return { lane: 'BASS_L', label: 'Bass L' };
  if (token === 'BR') return { lane: 'BASS_R', label: 'Bass R' };
  if (token === 'SL') return { lane: 'SLAP_L', label: 'Slap L' };
  if (token === 'SR') return { lane: 'SLAP_R', label: 'Slap R' };
  if (token === 'B') return { lane: nextBass, label: 'Bass' };
  if (token === 'S') return { lane: nextSlap, label: 'Slap' };
  if (token === 'X') return { lane: nextSlap, accent: true, label: 'Accent' };
  if (token === 'g') return { lane: nextSlap, ghost: true, label: 'Ghost' };
  return null;
}

function inferThumbnail(style: RhythmStyle): RhythmDefinition['meta']['thumbnailType'] {
  if (style === 'fill') return 'fill';
  if (style === 'latin' || style === 'flamenco') return 'latin';
  if (style === 'basic' || style === 'practice') return 'mixed';
  return 'slap';
}
