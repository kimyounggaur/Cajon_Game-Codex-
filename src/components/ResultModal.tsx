import type { GameSnapshot } from '../engine/rhythmEngine';

interface ResultModalProps {
  snapshot: GameSnapshot;
  onRetry: () => void;
  onHome: () => void;
  onInstrument: () => void;
}

export function ResultModal({ snapshot, onRetry, onHome, onInstrument }: ResultModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <p className="eyebrow">Result</p>
        <h2 id="result-title">{snapshot.rank}</h2>
        <div className="stars" aria-label={`${snapshot.stars} stars`}>
          {'★'.repeat(snapshot.stars)}
          {'☆'.repeat(3 - snapshot.stars)}
        </div>
        <dl className="result-grid">
          <div>
            <dt>Score</dt>
            <dd>{snapshot.score.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Max Combo</dt>
            <dd>{snapshot.maxCombo}</dd>
          </div>
          <div>
            <dt>Accuracy</dt>
            <dd>{Math.round(snapshot.accuracy * 100)}%</dd>
          </div>
          <div>
            <dt>Perfect</dt>
            <dd>{snapshot.counts.PERFECT}</dd>
          </div>
          <div>
            <dt>Great</dt>
            <dd>{snapshot.counts.GREAT}</dd>
          </div>
          <div>
            <dt>Good</dt>
            <dd>{snapshot.counts.GOOD}</dd>
          </div>
          <div>
            <dt>Bad</dt>
            <dd>{snapshot.counts.BAD}</dd>
          </div>
          <div>
            <dt>Miss</dt>
            <dd>{snapshot.counts.MISS}</dd>
          </div>
        </dl>
        <div className="modal-actions">
          <button type="button" className="primary-action" onClick={onRetry}>
            다시하기
          </button>
          <button type="button" onClick={onHome}>
            곡 선택
          </button>
          <button type="button" onClick={onInstrument}>
            연주 모드
          </button>
        </div>
      </section>
    </div>
  );
}
