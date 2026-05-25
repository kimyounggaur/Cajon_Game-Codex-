import { ASSETS } from '../assets/assets';
import type { Chart } from '../engine/chart';
import type { BestScore } from '../engine/storage';

interface HomeScreenProps {
  charts: readonly Chart[];
  selectedChartId: string;
  bestScores: Record<string, BestScore>;
  fallbackActive: boolean;
  onSelectChart: (chartId: string) => void;
  onStartInstrument: () => void | Promise<void>;
  onStartGame: () => void | Promise<void>;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
}

export function HomeScreen({
  charts,
  selectedChartId,
  bestScores,
  fallbackActive,
  onSelectChart,
  onStartInstrument,
  onStartGame,
  onOpenSettings,
  onOpenTutorial
}: HomeScreenProps) {
  return (
    <section className="home-screen" aria-label="Cajon Rhythm home">
      <div className="home-brand">
        <img className="home-logo" src={ASSETS.cajonIcon.src} alt={ASSETS.cajonIcon.alt} />
        <div>
          <p className="eyebrow">Mobile Cajon</p>
          <h1>Cajon Rhythm</h1>
          <p className="home-subtitle">손끝으로 치는 카혼 리듬 게임</p>
        </div>
      </div>

      <div className="home-actions" aria-label="main actions">
        <button className="primary-action" type="button" onClick={onStartGame} aria-label="리듬 게임 시작">
          리듬 게임 시작
        </button>
        <button type="button" onClick={onStartInstrument} aria-label="연주 모드">
          연주 모드
        </button>
        <button type="button" onClick={onOpenTutorial} aria-label="튜토리얼">
          튜토리얼
        </button>
        <button type="button" onClick={onOpenSettings} aria-label="설정">
          설정
        </button>
      </div>

      <div className="chart-strip" aria-label="chart selection">
        {charts.map((chart) => {
          const best = bestScores[chart.id];
          return (
            <button
              key={chart.id}
              className={chart.id === selectedChartId ? 'chart-tile selected' : 'chart-tile'}
              type="button"
              onClick={() => onSelectChart(chart.id)}
              aria-pressed={chart.id === selectedChartId}
            >
              <span>{chart.title}</span>
              <small>
                {chart.bpm} BPM · {best ? `${best.rank} ${Math.round(best.accuracy * 100)}%` : chart.difficulty}
              </small>
            </button>
          );
        })}
      </div>

      <div className="home-reference">
        <img src={ASSETS.cajonPhotoRef.src} alt={ASSETS.cajonPhotoRef.alt} />
      </div>

      <p className={fallbackActive ? 'fallback-line active' : 'fallback-line'}>
        {fallbackActive ? 'sample fallback active' : 'audio ready'}
      </p>
    </section>
  );
}
