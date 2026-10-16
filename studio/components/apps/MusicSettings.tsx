"use client";
import { useMusic } from "@/components/os/AudioProvider";
import { usePreferences } from "@/lib/preferences";
import {
  useSoundEnabled,
  setSoundEnabled,
  playSound,
} from "@/studio/hooks/useSoundEffects";
export default function MusicSettings() {
  const { volume, masterMuted, musicEnabled, effectsVolume } = usePreferences();
  const effects = useSoundEnabled();
  const { error } = useMusic();
  return (
    <div className="ec-audio-settings">
      <label className="ec-audio-row">
        <span>Mute all audio</span>
        <input
          type="checkbox"
          role="switch"
          checked={masterMuted}
          onChange={(e) =>
            usePreferences.setState({ masterMuted: e.target.checked })
          }
        />
      </label>
      <label className="ec-audio-row">
        <span>Background music</span>
        <input
          data-music-toggle
          type="checkbox"
          role="switch"
          checked={musicEnabled}
          onChange={(e) =>
            usePreferences.setState({ musicEnabled: e.target.checked })
          }
        />
      </label>
      <label className="ec-audio-slider">
        <span>
          Music volume <output>{Math.round(volume * 100)}%</output>
        </span>
        <input
          aria-label="Music volume"
          type="range"
          min="0"
          max="1"
          step=".01"
          value={volume}
          onChange={(e) =>
            usePreferences.setState({ volume: Number(e.target.value) })
          }
        />
      </label>
      <label className="ec-audio-row">
        <span>UI sound effects</span>
        <input
          type="checkbox"
          role="switch"
          checked={effects}
          onChange={(e) => {
            setSoundEnabled(e.target.checked);
            if (e.target.checked) playSound("notify");
          }}
        />
      </label>
      <label className="ec-audio-slider">
        <span>
          Effects volume <output>{Math.round(effectsVolume * 100)}%</output>
        </span>
        <input
          aria-label="Effects volume"
          type="range"
          min="0"
          max="1"
          step=".05"
          value={effectsVolume}
          onChange={(e) =>
            usePreferences.setState({ effectsVolume: Number(e.target.value) })
          }
          onPointerUp={() => playSound("notify")}
          onKeyUp={() => playSound("notify")}
        />
      </label>
      <p>
        Music lowers briefly when interface sounds play, so each action stays
        clear.
      </p>
      {masterMuted && (
        <p role="status">
          All audio is muted. Your individual levels are saved.
        </p>
      )}
      {error && <p role="status">{error}</p>}
    </div>
  );
}
