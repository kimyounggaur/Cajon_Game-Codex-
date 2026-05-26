import { useMemo, useState } from 'react';
import type { RhythmProgressState } from '../../engine/progressStorage';
import type { Difficulty, RhythmDefinition, RhythmStyle } from '../../engine/rhythmTypes';
import { RHYTHM_STYLE_LABELS } from '../../engine/rhythmTypes';
import { sortRhythmsRecommended } from '../../engine/rhythmRecommendation';
import { DifficultyTabs } from './DifficultyTabs';
import { RhythmCardList } from './RhythmCardList';
import { RhythmFilterBar, type RhythmSort, type RhythmStyleFilter } from './RhythmFilterBar';

interface RhythmSelectScreenProps {
  rhythms: RhythmDefinition[];
  progress: RhythmProgressState;
  selectedDifficulty: Difficulty | 'all';
  onBack: () => void;
  onDifficultyChange: (difficulty: Difficulty | 'all') => void;
  onOpenRhythm: (rhythmId: string) => void;
  onPreview: (rhythm: RhythmDefinition) => void | Promise<void>;
}

export function RhythmSelectScreen({
  rhythms,
  progress,
  selectedDifficulty,
  onBack,
  onDifficultyChange,
  onOpenRhythm,
  onPreview
}: RhythmSelectScreenProps) {
  const [query, setQuery] = useState('');
  const [style, setStyle] = useState<RhythmStyleFilter>('all');
  const [sort, setSort] = useState<RhythmSort>('recommended');

  const styleCounts = useMemo(() => {
    const byDifficulty = rhythms.filter((rhythm) => selectedDifficulty === 'all' || rhythm.meta.difficulty === selectedDifficulty);
    return byDifficulty.reduce<Record<RhythmStyleFilter, number>>(
      (counts, rhythm) => {
        counts.all += 1;
        counts[rhythm.meta.style] = (counts[rhythm.meta.style] ?? 0) + 1;
        return counts;
      },
      { all: 0 } as Record<RhythmStyleFilter, number>
    );
  }, [rhythms, selectedDifficulty]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const byDifficulty = rhythms.filter((rhythm) => selectedDifficulty === 'all' || rhythm.meta.difficulty === selectedDifficulty);
    const byStyle = byDifficulty.filter((rhythm) => style === 'all' || rhythm.meta.style === style);
    const bySearch = normalizedQuery
      ? byStyle.filter((rhythm) => matchesQuery(rhythm, normalizedQuery))
      : byStyle;

    if (sort === 'recommended') return sortRhythmsRecommended(bySearch, progress);
    if (sort === 'bpmAsc') return [...bySearch].sort((a, b) => a.meta.bpm - b.meta.bpm);
    if (sort === 'title') return [...bySearch].sort((a, b) => a.meta.title.localeCompare(b.meta.title, 'ko'));
    return [...bySearch].sort((a, b) => a.meta.level - b.meta.level);
  }, [progress, query, rhythms, selectedDifficulty, sort, style]);

  return (
    <section className="rhythm-screen" aria-label="리듬 선택">
      <header className="rhythm-screen-header">
        <button className="icon-button" type="button" aria-label="뒤로가기" onClick={onBack}>
          ←
        </button>
        <div>
          <p className="eyebrow">Rhythm Library</p>
          <h1>리듬 선택</h1>
          <p>난이도와 스타일을 골라 카혼 패턴을 연습하세요.</p>
        </div>
      </header>

      <DifficultyTabs rhythms={rhythms} selected={selectedDifficulty} onChange={onDifficultyChange} />
      <RhythmFilterBar
        query={query}
        style={style}
        styleCounts={styleCounts}
        sort={sort}
        onQueryChange={setQuery}
        onStyleChange={setStyle}
        onSortChange={setSort}
      />
      <RhythmCardList rhythms={filtered} progress={progress} onOpenRhythm={onOpenRhythm} onPreview={onPreview} />
    </section>
  );
}

function matchesQuery(rhythm: RhythmDefinition, query: string): boolean {
  const style = RHYTHM_STYLE_LABELS[rhythm.meta.style as RhythmStyle];
  return [
    rhythm.meta.title,
    rhythm.meta.subtitle,
    rhythm.meta.description,
    rhythm.meta.learningGoal,
    rhythm.meta.recommendedFor,
    style,
    ...rhythm.meta.tags
  ]
    .join(' ')
    .toLowerCase()
    .includes(query);
}
