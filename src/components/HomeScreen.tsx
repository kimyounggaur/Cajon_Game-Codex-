import { ASSETS } from '../assets/assets';
import type { RhythmBestRecord } from '../engine/progressStorage';
import type { RhythmDefinition } from '../engine/rhythmTypes';

interface HomeScreenProps {
  fallbackActive: boolean;
  recentRhythm?: RhythmDefinition;
  recentRecord?: RhythmBestRecord;
  onOpenRhythmSelect: () => void;
  onContinueRhythm: () => void | Promise<void>;
  onStartInstrument: () => void | Promise<void>;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
}

type HomeIconName = 'play' | 'cajon' | 'book' | 'settings' | 'metronome' | 'bars' | 'wave' | 'bolt';

export function HomeScreen({
  fallbackActive,
  recentRhythm,
  recentRecord,
  onOpenRhythmSelect,
  onContinueRhythm,
  onStartInstrument,
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
        <button className="primary-action" type="button" onClick={onOpenRhythmSelect} aria-label="리듬 선택">
          <span className="menu-label">
            <MenuIcon name="play" />
            <span>리듬 선택</span>
          </span>
        </button>
        <button type="button" onClick={onStartInstrument} aria-label="연주 모드">
          <span className="menu-label">
            <MenuIcon name="cajon" />
            <span>연주 모드</span>
          </span>
        </button>
        <button type="button" onClick={onOpenTutorial} aria-label="튜토리얼">
          <span className="menu-label">
            <MenuIcon name="book" />
            <span>튜토리얼</span>
          </span>
        </button>
        <button type="button" onClick={onOpenSettings} aria-label="설정">
          <span className="menu-label">
            <MenuIcon name="settings" />
            <span>설정</span>
          </span>
        </button>
      </div>

      {recentRhythm && recentRecord ? (
        <div className="home-recent-rhythm">
          <span>최근 리듬</span>
          <strong>
            {recentRhythm.meta.title} · 정확도 {Math.round(recentRecord.bestAccuracy * 100)}% · {recentRecord.bestRank}
          </strong>
          <button type="button" onClick={onContinueRhythm}>
            이어하기
          </button>
        </div>
      ) : null}

      <div className="home-reference">
        <img src={ASSETS.cajonPhotoRef.src} alt={ASSETS.cajonPhotoRef.alt} />
      </div>

      <p className={fallbackActive ? 'fallback-line active' : 'fallback-line'}>
        {fallbackActive ? 'sample fallback active' : 'audio ready'}
      </p>
    </section>
  );
}

function MenuIcon({ name }: { name: HomeIconName }) {
  return (
    <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {name === 'play' ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M10 8.5 16 12l-6 3.5Z" />
        </>
      ) : null}
      {name === 'cajon' ? (
        <>
          <rect x="7" y="4" width="10" height="16" rx="2" />
          <circle cx="12" cy="9" r="2" />
          <path d="M10 14v4M14 14v4" />
        </>
      ) : null}
      {name === 'book' ? (
        <>
          <path d="M5 5.5h6a3 3 0 0 1 3 3V19a3 3 0 0 0-3-3H5Z" />
          <path d="M14 8.5a3 3 0 0 1 3-3h2v10.5h-2a3 3 0 0 0-3 3" />
        </>
      ) : null}
      {name === 'settings' ? (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        </>
      ) : null}
      {name === 'metronome' ? (
        <>
          <path d="M8 20h8L14.5 5h-5Z" />
          <path d="m13 8-3 6M9 20h6" />
        </>
      ) : null}
      {name === 'bars' ? (
        <>
          <path d="M6 18V11M12 18V7M18 18v-5" />
          <path d="M4 18h16" />
        </>
      ) : null}
      {name === 'wave' ? (
        <path d="M4 13c2.2-4 4.2-4 6 0s3.8 4 6 0 3-3.4 4-2" />
      ) : null}
      {name === 'bolt' ? (
        <path d="M13 3 6 13h5l-1 8 8-12h-5Z" />
      ) : null}
    </svg>
  );
}
