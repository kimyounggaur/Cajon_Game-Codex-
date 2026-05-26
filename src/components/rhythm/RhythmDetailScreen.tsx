import { useState } from 'react';
import type { RhythmProgressState } from '../../engine/progressStorage';
import type { RhythmDefinition } from '../../engine/rhythmTypes';
import { DIFFICULTY_LABELS, RHYTHM_STYLE_LABELS } from '../../engine/rhythmTypes';
import { PracticeLoopSelector } from './PracticeLoopSelector';
import { RhythmMiniPattern } from './RhythmMiniPattern';
import { RhythmPreviewPlayer } from './RhythmPreviewPlayer';
import { RhythmStatsBadge } from './RhythmStatsBadge';

interface RhythmDetailScreenProps {
  rhythm: RhythmDefinition | undefined;
  progress: RhythmProgressState;
  locked: boolean;
  unlockMessage: string | null;
  onBack: () => void;
  onStart: (rhythmId: string) => void | Promise<void>;
  onPracticeStart: (rhythmId: string, loopId: string) => void | Promise<void>;
  onPreview: (rhythm: RhythmDefinition) => void | Promise<void>;
}

export function RhythmDetailScreen({
  rhythm,
  progress,
  locked,
  unlockMessage,
  onBack,
  onStart,
  onPracticeStart,
  onPreview
}: RhythmDetailScreenProps) {
  const [loopId, setLoopId] = useState(rhythm?.practiceLoops[0]?.id ?? 'loop-main');

  if (!rhythm) {
    return (
      <section className="rhythm-screen rhythm-detail-screen">
        <div className="rhythm-empty-state">
          <strong>리듬을 찾을 수 없어요.</strong>
          <button type="button" onClick={onBack}>리듬 선택으로 돌아가기</button>
        </div>
      </section>
    );
  }

  const record = progress.records[rhythm.meta.id];

  return (
    <section className="rhythm-screen rhythm-detail-screen" aria-label={`${rhythm.meta.title} 상세`}>
      <header className="rhythm-screen-header">
        <button className="icon-button" type="button" aria-label="뒤로가기" onClick={onBack}>
          ←
        </button>
        <div>
          <p className="eyebrow">Rhythm Detail</p>
          <h1>{rhythm.meta.title}</h1>
          <p>{rhythm.meta.subtitle}</p>
        </div>
      </header>

      <div className="rhythm-detail-panel">
        <div className="rhythm-detail-meta">
          <span className={`diff-badge ${rhythm.meta.difficulty}`}>{DIFFICULTY_LABELS[rhythm.meta.difficulty]}</span>
          <span>Lv.{rhythm.meta.level}</span>
          <span>{rhythm.meta.bpm} BPM</span>
          <span>{rhythm.meta.timeSignature}</span>
          <span>{RHYTHM_STYLE_LABELS[rhythm.meta.style]}</span>
        </div>
        <p>{rhythm.meta.description}</p>
        <dl className="rhythm-goals">
          <div>
            <dt>학습 목표</dt>
            <dd>{rhythm.meta.learningGoal}</dd>
          </div>
          <div>
            <dt>추천 대상</dt>
            <dd>{rhythm.meta.recommendedFor}</dd>
          </div>
        </dl>
        <RhythmStatsBadge record={record} />
        <RhythmMiniPattern rhythm={rhythm} />
        {locked && unlockMessage ? <p className="unlock-message">{unlockMessage}</p> : null}
        <PracticeLoopSelector loops={rhythm.practiceLoops} selectedLoopId={loopId} onChange={setLoopId} />
        <div className="rhythm-detail-actions">
          <RhythmPreviewPlayer disabled={locked} onPreview={() => onPreview(rhythm)} />
          <button type="button" disabled={locked} onClick={() => void onPracticeStart(rhythm.meta.id, loopId)}>
            연습하기
          </button>
          <button className="primary-action" type="button" disabled={locked} onClick={() => void onStart(rhythm.meta.id)}>
            게임 시작
          </button>
        </div>
      </div>
    </section>
  );
}
