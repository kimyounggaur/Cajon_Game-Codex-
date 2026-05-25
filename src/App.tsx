import { useEffect, useMemo, useState } from 'react';
import { CHARTS, getChartById, type ChartId } from './charts';
import { AppShell } from './components/AppShell';
import { GameScreen } from './components/GameScreen';
import { HomeScreen } from './components/HomeScreen';
import { SettingsPanel } from './components/SettingsPanel';
import { TutorialOverlay } from './components/TutorialOverlay';
import { AudioEngine } from './engine/audioEngine';
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

type Screen = 'home' | 'instrument' | 'game';

export default function App() {
  const audioEngine = useMemo(() => new AudioEngine(), []);
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedChartId, setSelectedChartId] = useState<ChartId>('tutorial');
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(() => !hasSeenTutorial());
  const [bestScores, setBestScores] = useState(() => loadBestScores());
  const [fallbackActive, setFallbackActive] = useState(false);
  const selectedChart = getChartById(selectedChartId);

  useEffect(() => {
    saveSettings(settings);
    audioEngine.setMasterVolume(settings.masterVolume);
    audioEngine.setSfxVolume(settings.sfxVolume);
    audioEngine.setHitVariation(settings.hitVariation);
  }, [audioEngine, settings]);

  async function prepareAudio() {
    await audioEngine.unlock();
    await audioEngine.preload();
    setFallbackActive(audioEngine.isFallbackActive());
  }

  async function startInstrumentMode() {
    await prepareAudio();
    setScreen('instrument');
  }

  async function startRhythmGame(chartId = selectedChartId) {
    setSelectedChartId(chartId as ChartId);
    await prepareAudio();
    setScreen('game');
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
  }

  return (
    <AppShell>
      {screen === 'home' ? (
        <HomeScreen
          charts={CHARTS}
          selectedChartId={selectedChartId}
          bestScores={bestScores}
          fallbackActive={fallbackActive}
          onSelectChart={(chartId) => setSelectedChartId(chartId as ChartId)}
          onStartInstrument={startInstrumentMode}
          onStartGame={() => startRhythmGame()}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenTutorial={() => setTutorialOpen(true)}
        />
      ) : (
        <GameScreen
          key={`${screen}-${selectedChart.id}`}
          mode={screen === 'instrument' ? 'instrument' : 'rhythm'}
          chart={selectedChart}
          settings={settings}
          audioEngine={audioEngine}
          onBackHome={() => setScreen('home')}
          onOpenSettings={() => setSettingsOpen(true)}
          onResult={handleResult}
          onSwitchToInstrument={startInstrumentMode}
        />
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
            void startRhythmGame('tutorial');
          }}
        />
      ) : null}
    </AppShell>
  );
}
