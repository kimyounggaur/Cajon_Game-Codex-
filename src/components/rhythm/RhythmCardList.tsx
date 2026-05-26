import type { RhythmProgressState } from '../../engine/progressStorage';
import type { RhythmDefinition } from '../../engine/rhythmTypes';
import { getRecommendationReason } from '../../engine/rhythmRecommendation';
import { getUnlockMessage, isRhythmUnlocked } from '../../engine/unlockRules';
import { RHYTHM_CATALOG } from '../../rhythms/rhythmCatalog';
import { RhythmCard } from './RhythmCard';

interface RhythmCardListProps {
  rhythms: RhythmDefinition[];
  progress: RhythmProgressState;
  onOpenRhythm: (rhythmId: string) => void;
  onPreview: (rhythm: RhythmDefinition) => void | Promise<void>;
}

export function RhythmCardList({ rhythms, progress, onOpenRhythm, onPreview }: RhythmCardListProps) {
  if (rhythms.length === 0) {
    return (
      <div className="rhythm-empty-state">
        <strong>조건에 맞는 리듬이 없어요.</strong>
        <span>필터를 줄이거나 전체 난이도를 선택해보세요.</span>
      </div>
    );
  }

  return (
    <div className="rhythm-card-list">
      {rhythms.map((rhythm) => {
        const locked = !isRhythmUnlocked(rhythm, progress, RHYTHM_CATALOG);
        return (
          <RhythmCard
            key={rhythm.meta.id}
            rhythm={rhythm}
            record={progress.records[rhythm.meta.id]}
            locked={locked}
            unlockMessage={getUnlockMessage(rhythm, progress, RHYTHM_CATALOG)}
            recommendation={getRecommendationReason(rhythm, progress)}
            onOpen={() => onOpenRhythm(rhythm.meta.id)}
            onPreview={() => onPreview(rhythm)}
          />
        );
      })}
    </div>
  );
}
