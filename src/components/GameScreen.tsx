import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AudioEngine } from '../engine/audioEngine';
import type { Chart, LaneId } from '../engine/chart';
import { getLaneFromKeyboardEvent, shouldIgnoreKeyTarget } from '../engine/input';
import { createCounts, type Judgement } from '../engine/judge';
import { RhythmEngine, type GameSnapshot } from '../engine/rhythmEngine';
import { triggerHaptic } from '../engine/haptics';
import type { RhythmDefinition } from '../engine/rhythmTypes';
import type { BestScore, GameSettings } from '../engine/storage';
import { CajonStage } from './CajonStage';
import { HUD } from './HUD';
import { ResultModal } from './ResultModal';

type PlayMode = 'instrument' | 'rhythm';

interface GameScreenProps {
  mode: PlayMode;
  chart: Chart;
  rhythm?: RhythmDefinition;
  isPractice?: boolean;
  settings: GameSettings;
  audioEngine: AudioEngine;
  onBackHome: () => void;
  onOpenSettings: () => void;
  onResult: (score: BestScore) => void;
  onSwitchToInstrument: () => void | Promise<void>;
  onRhythmDetail: () => void;
  onRhythmSelect: () => void;
  onPractice: () => void;
}

export function GameScreen({
  mode,
  chart,
  rhythm,
  isPractice = false,
  settings,
  audioEngine,
  onBackHome,
  onOpenSettings,
  onResult,
  onSwitchToInstrument,
  onRhythmDetail,
  onRhythmSelect,
  onPractice
}: GameScreenProps) {
  const engineRef = useRef(new RhythmEngine({ calibrationMs: settings.calibrationMs }));
  const resultReportedRef = useRef(false);
  const lastLaneInputRef = useRef<Partial<Record<LaneId, number>>>({});
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() =>
    createIdleSnapshot(mode === 'rhythm' ? chart : null)
  );
  const [activeLanes, setActiveLanes] = useState<LaneId[]>([]);
  const [countdown, setCountdown] = useState<number | null>(mode === 'rhythm' ? 4 : null);
  const [roundActive, setRoundActive] = useState(false);
  const [restartToken, setRestartToken] = useState(0);

  useEffect(() => {
    const engine = new RhythmEngine({ calibrationMs: settings.calibrationMs });
    engineRef.current = engine;
    resultReportedRef.current = false;
    setRoundActive(false);
    setActiveLanes([]);

    if (mode === 'instrument') {
      setCountdown(null);
      setSnapshot(createIdleSnapshot(null));
      return;
    }

    engine.loadChart(chart);
    setSnapshot(createIdleSnapshot(chart));
    setCountdown(4);

    let count = 4;
    const beatMs = 60_000 / chart.bpm;
    const intervalId = window.setInterval(() => {
      count -= 1;

      if (count <= 0) {
        window.clearInterval(intervalId);
        setCountdown(null);
        const startNow = performance.now();
        engine.start(startNow);
        setSnapshot(engine.tick(startNow));
        setRoundActive(true);
        return;
      }

      audioEngine.play('ui', { velocity: 0.2 });
      setCountdown(count);
    }, beatMs);

    return () => window.clearInterval(intervalId);
  }, [audioEngine, chart, mode, restartToken, settings.calibrationMs]);

  useEffect(() => {
    if (mode !== 'rhythm' || !roundActive) return;

    let frameId = 0;
    const loop = (now: number) => {
      const nextSnapshot = engineRef.current.tick(now);
      setSnapshot(nextSnapshot);

      if (nextSnapshot.mode === 'finished') {
        setRoundActive(false);
        reportResult(nextSnapshot);
        return;
      }

      if (nextSnapshot.mode === 'playing') {
        frameId = window.requestAnimationFrame(loop);
      }
    };

    frameId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frameId);
  }, [mode, roundActive]);

  const handleLaneDown = useCallback(
    (lane: LaneId) => {
      const now = performance.now();
      const lastInputAt = lastLaneInputRef.current[lane] ?? -Infinity;
      if (now - lastInputAt < 40) return;
      lastLaneInputRef.current[lane] = now;

      setActiveLanes((current) => (current.includes(lane) ? current : [...current, lane]));
      window.setTimeout(() => {
        setActiveLanes((current) => current.filter((item) => item !== lane));
      }, 130);

      let judgement: Judgement | undefined;
      if (mode === 'rhythm') {
        const result = engineRef.current.hit(lane, now);
        judgement = result?.judgement;
        const nextSnapshot = engineRef.current.tick(now);
        setSnapshot(nextSnapshot);
        if (nextSnapshot.mode === 'finished') {
          setRoundActive(false);
          reportResult(nextSnapshot);
        }
      }

      audioEngine.playLane(lane, judgement);
      triggerHaptic(settings.haptics, lane.startsWith('BASS') ? 10 : 6);
    },
    [audioEngine, mode, settings.haptics]
  );

  const handleLaneUp = useCallback((lane: LaneId) => {
    setActiveLanes((current) => current.filter((item) => item !== lane));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnoreKeyTarget(event.target)) return;
      const lane = getLaneFromKeyboardEvent(event);
      if (!lane) return;
      event.preventDefault();
      handleLaneDown(lane);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleLaneDown]);

  const lastJudgementsByLane = useMemo(() => {
    const byLane: Partial<Record<LaneId, Judgement>> = {};
    for (const item of snapshot.lastJudgements) {
      byLane[item.lane] = item.judgement;
    }
    return byLane;
  }, [snapshot.lastJudgements]);

  function togglePause() {
    if (mode !== 'rhythm') return;
    const now = performance.now();

    if (snapshot.mode === 'playing') {
      engineRef.current.pause(now);
      setRoundActive(false);
      setSnapshot(engineRef.current.tick(now));
      return;
    }

    if (snapshot.mode === 'paused') {
      engineRef.current.resume(now);
      setSnapshot(engineRef.current.tick(now));
      setRoundActive(true);
    }
  }

  function restart() {
    resultReportedRef.current = false;
    setRestartToken((value) => value + 1);
  }

  function reportResult(resultSnapshot: GameSnapshot) {
    if (mode !== 'rhythm' || resultReportedRef.current || !resultSnapshot.chart) return;
    resultReportedRef.current = true;
    onResult({
      chartId: resultSnapshot.chart.id,
      score: resultSnapshot.score,
      accuracy: resultSnapshot.accuracy,
      rank: resultSnapshot.rank,
      stars: resultSnapshot.stars,
      maxCombo: resultSnapshot.maxCombo,
      playedAt: new Date().toISOString()
    });
  }

  return (
    <section className="game-screen" aria-label="Cajon game">
      <HUD
        snapshot={snapshot}
        modeLabel={mode === 'instrument' ? '연주 모드' : snapshot.mode === 'paused' ? '일시정지' : '리듬 게임'}
        onBackHome={onBackHome}
        onPauseToggle={togglePause}
        onOpenSettings={onOpenSettings}
      />

      <CajonStage
        visibleNotes={snapshot.visibleNotes}
        activeLanes={activeLanes}
        lastJudgements={lastJudgementsByLane}
        debugHitboxes={settings.debugHitboxes}
        countdown={countdown}
        onLaneDown={handleLaneDown}
        onLaneUp={handleLaneUp}
      />

      <footer className="game-footer">
        <span>{mode === 'instrument' ? 'Free Play' : `${chart.title} · ${chart.bpm} BPM`}</span>
        <button type="button" onClick={onOpenSettings}>
          보정 {settings.calibrationMs}ms
        </button>
      </footer>

      {mode === 'rhythm' && snapshot.mode === 'finished' ? (
        <ResultModal
          snapshot={snapshot}
          rhythm={rhythm}
          isPractice={isPractice}
          onRetry={restart}
          onHome={onBackHome}
          onRhythmDetail={onRhythmDetail}
          onRhythmSelect={onRhythmSelect}
          onPractice={onPractice}
          onInstrument={() => {
            void onSwitchToInstrument();
          }}
        />
      ) : null}
    </section>
  );
}

function createIdleSnapshot(chart: Chart | null): GameSnapshot {
  return {
    mode: 'idle',
    nowMs: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    accuracy: 0,
    rank: 'D',
    stars: 0,
    counts: createCounts(),
    visibleNotes: [],
    lastJudgements: [],
    chart
  };
}
