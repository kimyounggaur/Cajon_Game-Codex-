import type { RhythmStyle } from '../../engine/rhythmTypes';
import { RHYTHM_STYLE_LABELS } from '../../engine/rhythmTypes';

export type RhythmSort = 'recommended' | 'levelAsc' | 'bpmAsc' | 'title';
export type RhythmStyleFilter = RhythmStyle | 'all';

const STYLE_FILTERS: RhythmStyleFilter[] = ['all', 'basic', 'pop', 'rock', 'ballad', 'shuffle', 'funk', 'latin', 'fill'];

interface RhythmFilterBarProps {
  query: string;
  style: RhythmStyleFilter;
  styleCounts: Record<RhythmStyleFilter, number>;
  sort: RhythmSort;
  onQueryChange: (query: string) => void;
  onStyleChange: (style: RhythmStyleFilter) => void;
  onSortChange: (sort: RhythmSort) => void;
}

export function RhythmFilterBar({
  query,
  style,
  styleCounts,
  sort,
  onQueryChange,
  onStyleChange,
  onSortChange
}: RhythmFilterBarProps) {
  return (
    <div className="rhythm-filter-bar">
      <label className="rhythm-search">
        <span>검색</span>
        <input
          value={query}
          type="search"
          placeholder="리듬, 스타일, 목표 검색"
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>

      <div className="rhythm-style-chips" aria-label="스타일 필터">
        {STYLE_FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            className={style === item ? 'style-chip selected' : 'style-chip'}
            onClick={() => onStyleChange(item)}
          >
            {item === 'all' ? '전체' : RHYTHM_STYLE_LABELS[item]}
            <span className="style-chip-count">{styleCounts[item] ?? 0}</span>
          </button>
        ))}
      </div>

      <label className="rhythm-sort">
        <span>정렬</span>
        <select value={sort} onChange={(event) => onSortChange(event.target.value as RhythmSort)}>
          <option value="recommended">추천순</option>
          <option value="levelAsc">레벨 낮은순</option>
          <option value="bpmAsc">BPM 낮은순</option>
          <option value="title">이름순</option>
        </select>
      </label>
    </div>
  );
}
