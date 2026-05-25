import type { GameSnapshot } from '../engine/rhythmEngine';

interface HUDProps {
  snapshot: GameSnapshot;
  modeLabel: string;
  onBackHome: () => void;
  onPauseToggle: () => void;
  onOpenSettings: () => void;
}

export function HUD({ snapshot, modeLabel, onBackHome, onPauseToggle, onOpenSettings }: HUDProps) {
  const accuracy = Math.round(snapshot.accuracy * 100);
  const isRhythm = snapshot.chart !== null;
  const paused = snapshot.mode === 'paused';

  return (
    <header className="hud">
      <button type="button" className="icon-button" onClick={onBackHome} aria-label="홈으로">
        ←
      </button>
      <div className="hud-metrics" aria-label="score">
        <span>
          <strong>{snapshot.score.toLocaleString()}</strong>
          <small>Score</small>
        </span>
        <span>
          <strong>{snapshot.combo}</strong>
          <small>Combo</small>
        </span>
        <span>
          <strong>{accuracy}%</strong>
          <small>Acc</small>
        </span>
      </div>
      <div className="hud-song">
        <strong>{snapshot.chart?.title ?? 'Instrument Mode'}</strong>
        <small>{modeLabel}</small>
      </div>
      <div className="hud-buttons">
        {isRhythm ? (
          <button type="button" className="icon-button" onClick={onPauseToggle} aria-label={paused ? '재개' : '일시정지'}>
            {paused ? '▶' : 'Ⅱ'}
          </button>
        ) : null}
        <button type="button" className="icon-button" onClick={onOpenSettings} aria-label="설정">
          ⚙
        </button>
      </div>
    </header>
  );
}
