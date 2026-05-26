import type { RhythmDefinition } from '../../engine/rhythmTypes';

interface RhythmMiniPatternProps {
  rhythm: RhythmDefinition;
}

export function RhythmMiniPattern({ rhythm }: RhythmMiniPatternProps) {
  const cells = Array.from({ length: rhythm.meta.bars * 16 }, (_, index) => {
    const beat = (index / 16) * 4;
    const step = rhythm.pattern.find((item) => Math.abs(item.beat - beat) < 0.001);
    return step;
  });

  return (
    <div className="rhythm-mini-pattern" aria-label={`${rhythm.meta.title} 미니 패턴`}>
      {cells.map((step, index) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className={step ? `mini-step active ${step.lane.startsWith('BASS') ? 'bass' : 'slap'}` : 'mini-step'}
          title={step?.label}
        />
      ))}
    </div>
  );
}
