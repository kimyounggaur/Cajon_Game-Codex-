import { useEffect, useMemo, useRef, useState } from 'react';
import { AppShell } from './components/AppShell';
import { GameScreen } from './components/GameScreen';
import { HomeScreen } from './components/HomeScreen';
import { RhythmDetailScreen } from './components/rhythm/RhythmDetailScreen';
import { RhythmSelectScreen } from './components/rhythm/RhythmSelectScreen';
import { SettingsPanel } from './components/SettingsPanel';
import { TutorialOverlay } from './components/TutorialOverlay';
import { AudioEngine } from './engine/audioEngine';
import type { Difficulty } from './engine/chart';
import {
  loadRhythmProgress,
  saveLastRhythmSelection,
  saveRhythmResult,
  type RhythmProgressState
} from './engine/progressStorage';
import {
  DEFAULT_SETTINGS,
  hasSeenTutorial,
  loadBestScores,
  loadSettings,
  markTutorialSeen,
  saveBestScore,
  saveSettings,
  type BestScore,
  type GameSettings
} from './engine/storage';
import { getUnlockMessage, isRhythmUnlocked } from './engine/unlockRules';
import { RHYTHM_CATALOG, getRhythmById } from './rhythms/rhythmCatalog';
import { createChartFromRhythm, createPracticeChartFromRhythm } from './rhythms/rhythmChartFactory';

type Screen = 'home' | 'instrument' | 'rhythmSelect' | 'rhythmDetail' | 'game';
type GameKind = 'full' | 'practice';

const FALLBACK_RHYTHM_ID = 'beginner-basic-4beat';

export default function App() {
  const audioEngine = useMemo(() => new AudioEngine(), []);
  const previewTimersRef = useRef<number[]>([]);
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedRhythmId, setSelectedRhythmId] = useState(FALLBACK_RHYTHM_ID);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>(() => loadRhythmProgress().lastSelectedDifficulty ?? 'beginner');
  const initialRhythm = getRhythmById(FALLBACK_RHYTHM_ID) ?? RHYTHM_CATALOG[0];
  const [gameChart, setGameChart] = useState(() => createChartFromRhythm(initialRhythm));
  const [gameKind, setGameKind] = useState<GameKind>('full');
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(() => !hasSeenTutorial());
  const [bestScores, setBestScores] = useState(() => loadBestScores());
  const [rhythmProgress, setRhythmProgress] = useState<RhythmProgressState>(() => loadRhythmProgress());
  const [fallbackActive, setFallbackActive] = useState(false);
  const selectedRhythm = getRhythmById(selectedRhythmId);
  const recentRhythm = rhythmProgress.lastSelectedRhythmId
    ? getRhythmById(rhythmProgress.lastSelectedRhythmId)
    : undefined;
  const recentRecord = recentRhythm ? rhythmProgress.records[recentRhythm.meta.id] : undefined;

  useEffect(() => {
    saveSettings(settings);
    audioEngine.setMasterVolume(settings.masterVolume);
    audioEngine.setSfxVolume(settings.sfxVolume);
    audioEngine.setHitVariation(settings.hitVariation);
  }, [audioEngine, settings]);

  useEffect(() => stopPreview, []);

  async function prepareAudio() {
    await audioEngine.unlock();
    await audioEngine.preload();
    setFallbackActive(audioEngine.isFallbackActive());
  }

  async function startInstrumentMode() {
    await prepareAudio();
    setScreen('instrument');
  }

  async function startRhythmGame(rhythmId = selectedRhythmId) {
    const rhythm = getRhythmById(rhythmId) ?? initialRhythm;
    setSelectedRhythmId(rhythm.meta.id);
    setGameChart(createChartFromRhythm(rhythm));
    setGameKind('full');
    setRhythmProgress((current) => saveLastRhythmSelection(current, rhythm.meta.difficulty, rhythm.meta.id));
    await prepareAudio();
    setScreen('game');
  }

  async function startPracticeLoop(rhythmId: string, loopId: string) {
    const rhythm = getRhythmById(rhythmId) ?? initialRhythm;
    const loop = rhythm.practiceLoops.find((item) => item.id === loopId) ?? rhythm.practiceLoops[0];
    setSelectedRhythmId(rhythm.meta.id);
    setGameChart(createPracticeChartFromRhythm(rhythm, loop));
    setGameKind('practice');
    setRhythmProgress((current) => saveLastRhythmSelection(current, rhythm.meta.difficulty, rhythm.meta.id));
    await prepareAudio();
    setScreen('game');
  }

  async function previewRhythm(rhythm = selectedRhythm ?? initialRhythm) {
    stopPreview();
    await prepareAudio();
    const chart = createChartFromRhythm(rhythm);
    const notes = chart.notes.filter((note) => note.timeMs <= chart.offsetMs + 5200);
    for (const note of notes) {
      const delay = Math.max(0, note.timeMs - chart.offsetMs);
      const timerId = window.setTimeout(() => {
        audioEngine.playLane(note.lane);
      }, delay);
      previewTimersRef.current.push(timerId);
    }
  }

  function stopPreview() {
    for (const timerId of previewTimersRef.current) {
      window.clearTimeout(timerId);
    }
    previewTimersRef.current = [];
  }

  function handleSettingsChange(next: GameSettings) {
    setSettings({ ...DEFAULT_SETTINGS, ...next });
  }

  function handleTutorialClose() {
    markTutorialSeen();
    setTutorialOpen(false);
  }

  function handleResult(score: BestScore) {
    setBestScores(saveBestScore(score));
    const rhythmId = gameChart.rhythmId;
    if (rhythmId && gameKind === 'full') {
      setRhythmProgress((current) =>
        saveRhythmResult(current, {
          rhythmId,
          score: score.score,
          accuracy: score.accuracy,
          maxCombo: score.maxCombo,
          rank: score.rank,
          stars: score.stars as 0 | 1 | 2 | 3
        })
      );
    }
  }

  function openRhythmDetail(rhythmId: string) {
    const rhythm = getRhythmById(rhythmId);
    if (rhythm) {
      setSelectedRhythmId(rhythmId);
      setRhythmProgress((current) => saveLastRhythmSelection(current, rhythm.meta.difficulty, rhythmId));
    }
    setScreen('rhythmDetail');
  }

  function changeDifficulty(difficulty: Difficulty | 'all') {
    setSelectedDifficulty(difficulty);
    if (difficulty !== 'all') {
      setRhythmProgress((current) => saveLastRhythmSelection(current, difficulty));
    }
  }

  return (
    <AppShell>
      {screen === 'home' ? (
        <HomeScreen
          fallbackActive={fallbackActive}
          recentRhythm={recentRhythm}
          recentRecord={recentRecord}
          onOpenRhythmSelect={() => setScreen('rhythmSelect')}
          onContinueRhythm={() => startRhythmGame(recentRhythm?.meta.id ?? selectedRhythmId)}
          onStartInstrument={startInstrumentMode}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenTutorial={() => setTutorialOpen(true)}
        />
      ) : null}

      {screen === 'rhythmSelect' ? (
        <RhythmSelectScreen
          rhythms={RHYTHM_CATALOG}
          progress={rhythmProgress}
          selectedDifficulty={selectedDifficulty}
          onBack={() => setScreen('home')}
          onDifficultyChange={changeDifficulty}
          onOpenRhythm={openRhythmDetail}
          onPreview={(rhythm) => previewRhythm(rhythm)}
        />
      ) : null}

      {screen === 'rhythmDetail' ? (
        <RhythmDetailScreen
          rhythm={selectedRhythm}
          progress={rhythmProgress}
          locked={selectedRhythm ? !isRhythmUnlocked(selectedRhythm, rhythmProgress, RHYTHM_CATALOG) : false}
          unlockMessage={selectedRhythm ? getUnlockMessage(selectedRhythm, rhythmProgress, RHYTHM_CATALOG) : null}
          onBack={() => setScreen('rhythmSelect')}
          onStart={startRhythmGame}
          onPracticeStart={startPracticeLoop}
          onPreview={(rhythm) => previewRhythm(rhythm)}
        />
      ) : null}

      {screen === 'instrument' || screen === 'game' ? (
        <GameScreen
          key={`${screen}-${gameChart.id}`}
          mode={screen === 'instrument' ? 'instrument' : 'rhythm'}
          chart={gameChart}
          rhythm={selectedRhythm}
          isPractice={gameKind === 'practice'}
          settings={settings}
          audioEngine={audioEngine}
          onBackHome={() => setScreen('home')}
          onOpenSettings={() => setSettingsOpen(true)}
          onResult={handleResult}
          onSwitchToInstrument={startInstrumentMode}
          onRhythmDetail={() => setScreen('rhythmDetail')}
          onRhythmSelect={() => setScreen('rhythmSelect')}
          onPractice={() => {
            const loop = selectedRhythm?.practiceLoops[0];
            if (selectedRhythm && loop) void startPracticeLoop(selectedRhythm.meta.id, loop.id);
          }}
        />
      ) : (
        null
      )}

      {settingsOpen ? (
        <SettingsPanel
          settings={settings}
          fallbackActive={fallbackActive}
          onChange={handleSettingsChange}
          onClose={() => setSettingsOpen(false)}
        />
      ) : null}

      {tutorialOpen ? (
        <TutorialOverlay
          onClose={handleTutorialClose}
          onPractice={() => {
            handleTutorialClose();
            void startRhythmGame('tutorial-doong-jjak');
          }}
        />
      ) : null}
    </AppShell>
  );
}
