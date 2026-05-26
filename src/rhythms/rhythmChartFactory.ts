import type { Chart, PracticeLoop, RhythmDefinition } from '../engine/rhythmTypes';
import { getBeatsPerBar } from './rhythmPatternDsl';

const DEFAULT_OFFSET_MS = 900;
const END_PADDING_MS = 1400;

export function createChartFromRhythm(rhythm: RhythmDefinition): Chart {
  return createChart(rhythm);
}

export function createPracticeChartFromRhythm(rhythm: RhythmDefinition, loop: PracticeLoop): Chart {
  return createChart(rhythm, loop);
}

function createChart(rhythm: RhythmDefinition, loop?: PracticeLoop): Chart {
  const beatsPerBar = getBeatsPerBar(rhythm.meta.timeSignature);
  const beatDurationMs = 60_000 / (loop?.recommendedBpm ?? rhythm.meta.bpm);
  const barDurationMs = beatsPerBar * beatDurationMs;
  const startBeat = loop ? loop.startBar * beatsPerBar : 0;
  const endBeat = loop ? (loop.endBar + 1) * beatsPerBar : Number.POSITIVE_INFINITY;
  const filtered = rhythm.pattern.filter((step) => step.beat >= startBeat && step.beat < endBeat);
  const notes = filtered.map((step, index) => ({
    id: `${rhythm.meta.id}-${loop?.id ?? 'full'}-${index}`,
    timeMs: Math.round(DEFAULT_OFFSET_MS + (step.beat - startBeat) * beatDurationMs),
    lane: step.lane,
    accent: step.accent,
    ghost: step.ghost,
    type: 'tap' as const
  }));
  const durationMs = Math.round(
    DEFAULT_OFFSET_MS +
      (loop ? (loop.endBar - loop.startBar + 1) * barDurationMs : rhythm.meta.bars * barDurationMs) +
      END_PADDING_MS
  );

  return {
    id: `${rhythm.meta.id}${loop ? `:${loop.id}` : ''}`,
    rhythmId: rhythm.meta.id,
    title: rhythm.meta.title,
    bpm: loop?.recommendedBpm ?? rhythm.meta.bpm,
    offsetMs: DEFAULT_OFFSET_MS,
    durationMs,
    difficulty: rhythm.meta.difficulty,
    timeSignature: rhythm.meta.timeSignature,
    notes
  };
}
