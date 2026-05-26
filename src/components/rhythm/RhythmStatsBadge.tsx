import type { RhythmBestRecord } from '../../engine/progressStorage';

interface RhythmStatsBadgeProps {
  record?: RhythmBestRecord;
}

export function RhythmStatsBadge({ record }: RhythmStatsBadgeProps) {
  if (!record) {
    return <span className="rhythm-stats-badge">미도전</span>;
  }

  return (
    <span className="rhythm-stats-badge" aria-label={`별점 ${record.stars}개`}>
      {'★'.repeat(record.stars)}
      {'☆'.repeat(3 - record.stars)} · {Math.round(record.bestAccuracy * 100)}% · {record.bestRank}
    </span>
  );
}
