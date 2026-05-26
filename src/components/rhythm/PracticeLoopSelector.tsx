import type { PracticeLoop } from '../../engine/rhythmTypes';

interface PracticeLoopSelectorProps {
  loops: PracticeLoop[];
  selectedLoopId: string;
  onChange: (loopId: string) => void;
}

export function PracticeLoopSelector({ loops, selectedLoopId, onChange }: PracticeLoopSelectorProps) {
  return (
    <label className="practice-loop-selector">
      <span>연습 루프</span>
      <select value={selectedLoopId} onChange={(event) => onChange(event.target.value)}>
        {loops.map((loop) => (
          <option key={loop.id} value={loop.id}>
            {loop.title}
          </option>
        ))}
      </select>
    </label>
  );
}
