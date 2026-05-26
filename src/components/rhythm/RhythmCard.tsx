import type { RhythmBestRecord } from '../../engine/progressStorage';
import type { RhythmDefinition } from '../../engine/rhythmTypes';
import { DIFFICULTY_LABELS, RHYTHM_STYLE_LABELS } from '../../engine/rhythmTypes';
import { RhythmPreviewPlayer } from './RhythmPreviewPlayer';
import { RhythmStatsBadge } from './RhythmStatsBadge';
import { RhythmUnlockBadge } from './RhythmUnlockBadge';

interface RhythmCardProps {
  rhythm: RhythmDefinition;
  record?: RhythmBestRecord;
  locked: boolean;
  unlockMessage: string | null;
  recommendation: string;
  onOpen: () => void;
  onPreview: () => void | Promise<void>;
}

export function RhythmCard({
  rhythm,
  record,
  locked,
  unlockMessage,
  recommendation,
  onOpen,
  onPreview
}: RhythmCardProps) {
  return (
    <article className={locked ? 'rhythm-card locked' : 'rhythm-card'}>
      <div className={`rhythm-thumb ${rhythm.meta.thumbnailType}`} aria-hidden="true">
        <span />
      </div>
      <div className="rhythm-card-main">
        <div className="rhythm-card-title-row">
          <button
            className="rhythm-card-title-button"
            type="button"
            aria-label={`${rhythm.meta.title} 상세 보기`}
            onClick={onOpen}
          >
            {rhythm.meta.title}
          </button>
          <RhythmUnlockBadge locked={locked} message={unlockMessage} />
        </div>
        <p>{rhythm.meta.subtitle}</p>
        <div className="rhythm-meta-line">
          <span className={`diff-badge ${rhythm.meta.difficulty}`}>{DIFFICULTY_LABELS[rhythm.meta.difficulty]}</span>
          <span>Lv.{rhythm.meta.level}</span>
          <span>{rhythm.meta.bpm} BPM</span>
          <span>{RHYTHM_STYLE_LABELS[rhythm.meta.style]}</span>
        </div>
        <RhythmStatsBadge record={record} />
        {unlockMessage ? <small className="unlock-message">{unlockMessage}</small> : <small>{recommendation}</small>}
        <div className="rhythm-card-actions">
          <RhythmPreviewPlayer disabled={locked} onPreview={onPreview} />
          <button type="button" disabled={locked} onClick={onOpen}>
            상세
          </button>
        </div>
      </div>
    </article>
  );
}
