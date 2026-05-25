import type { GameSettings, VisualEffectsLevel } from '../engine/storage';

interface SettingsPanelProps {
  settings: GameSettings;
  fallbackActive: boolean;
  onChange: (settings: GameSettings) => void;
  onClose: () => void;
}

export function SettingsPanel({ settings, fallbackActive, onChange, onClose }: SettingsPanelProps) {
  function update(partial: Partial<GameSettings>) {
    onChange({ ...settings, ...partial });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Settings</p>
            <h2 id="settings-title">설정</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <label className="setting-row">
          <span>Master volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.masterVolume}
            onChange={(event) => update({ masterVolume: Number(event.currentTarget.value) })}
          />
        </label>

        <label className="setting-row">
          <span>SFX volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.sfxVolume}
            onChange={(event) => update({ sfxVolume: Number(event.currentTarget.value) })}
          />
        </label>

        <label className="setting-row">
          <span>Timing calibration</span>
          <input
            type="range"
            min="-150"
            max="150"
            step="1"
            value={settings.calibrationMs}
            onChange={(event) => update({ calibrationMs: Number(event.currentTarget.value) })}
          />
          <strong>{settings.calibrationMs}ms</strong>
        </label>

        <label className="setting-row">
          <span>Visual effects</span>
          <select
            value={settings.visualEffects}
            onChange={(event) => update({ visualEffects: event.currentTarget.value as VisualEffectsLevel })}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </label>

        <label className="toggle-row">
          <input
            type="checkbox"
            checked={settings.hitVariation}
            onChange={(event) => update({ hitVariation: event.currentTarget.checked })}
          />
          <span>Hit sound variation</span>
        </label>

        <label className="toggle-row">
          <input
            type="checkbox"
            checked={settings.haptics}
            onChange={(event) => update({ haptics: event.currentTarget.checked })}
          />
          <span>Haptic feedback</span>
        </label>

        <label className="toggle-row">
          <input
            type="checkbox"
            checked={settings.debugHitboxes}
            onChange={(event) => update({ debugHitboxes: event.currentTarget.checked })}
          />
          <span>Debug hitbox overlay</span>
        </label>

        <div className={fallbackActive ? 'sample-status active' : 'sample-status'}>
          {fallbackActive ? 'sample fallback active' : 'sample files loaded'}
        </div>
      </section>
    </div>
  );
}
