import type { Difficulty, RhythmDefinition } from '../../engine/rhythmTypes';
import { DIFFICULTIES, DIFFICULTY_LABELS } from '../../engine/rhythmTypes';

interface DifficultyTabsProps {
  rhythms: RhythmDefinition[];
  selected: Difficulty | 'all';
  onChange: (difficulty: Difficulty | 'all') => void;
}

export function DifficultyTabs({ rhythms, selected, onChange }: DifficultyTabsProps) {
  const items: Array<Difficulty | 'all'> = ['all', ...DIFFICULTIES];

  return (
    <div className="difficulty-tabs" role="tablist" aria-label="난이도 선택">
      {items.map((item) => {
        const count = item === 'all' ? rhythms.length : rhythms.filter((rhythm) => rhythm.meta.difficulty === item).length;
        const label = item === 'all' ? '전체' : DIFFICULTY_LABELS[item];
        return (
          <button
            key={item}
            className={selected === item ? `difficulty-tab selected ${item}` : `difficulty-tab ${item}`}
            type="button"
            role="tab"
            aria-selected={selected === item}
            onClick={() => onChange(item)}
          >
            {label} <span>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
