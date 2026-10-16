/**
 * Sound Effects — Web Audio API synthetic sounds.
 * No audio files needed. All tones are generated programmatically.
 *
 * Off by default. User can toggle in Preferences.
 */

import { useSyncExternalStore } from "react";
import { usePreferences } from "@/lib/preferences";
let audioCtx: AudioContext | null = null;

export function stopSounds() {
  if (audioCtx && audioCtx.state !== "closed") void audioCtx.close();
  audioCtx = null;
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx || audioCtx.state === "closed") {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  startAt: number,
  duration: number,
  volume = 0.05,
  type: OscillatorType = "sine",
) {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.setValueAtTime(
      volume * usePreferences.getState().effectsVolume * 2,
      ctx.currentTime + startAt,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + startAt + duration,
    );
    osc.start(ctx.currentTime + startAt);
    osc.stop(ctx.currentTime + startAt + duration + 0.05);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  } catch {
    // AudioContext not available
  }
}

// Sound library
const SOUNDS = {
  click() {
    tone(660, 0.025, 0.065, 0.045);
  },
  windowOpen() {
    tone(523.25, 0, 0.07, 0.04); // C5
    tone(659.25, 0.06, 0.07, 0.04); // E5
    tone(783.99, 0.12, 0.1, 0.03); // G5
  },
  windowClose() {
    tone(523.25, 0, 0.08, 0.04); // C5
    tone(392.0, 0.07, 0.12, 0.03); // G4
  },
  notify() {
    tone(880.0, 0, 0.08, 0.05); // A5
    tone(1108.7, 0.09, 0.12, 0.04); // C#6
  },
  error() {
    tone(220.0, 0, 0.08, 0.04, "sawtooth");
    tone(196.0, 0.07, 0.12, 0.03, "sawtooth");
  },
  bootChime() {
    tone(261.63, 0, 0.5, 0.04); // C4
    tone(329.63, 0.1, 0.5, 0.03); // E4
    tone(392.0, 0.2, 0.5, 0.03); // G4
    tone(523.25, 0.3, 0.6, 0.04); // C5
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const STORAGE_KEY = "elisha-studio-sound-enabled";

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  // Default: OFF (subtle but user must opt in)
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
  } catch {
    return;
  }
  window.dispatchEvent(new Event("elisha-sound-preference"));
  // Warm up AudioContext on enable (browsers need user gesture)
  if (enabled) getCtx();
}

export type SoundName = keyof typeof SOUNDS;

function subscribe(callback: () => void) {
  window.addEventListener("elisha-sound-preference", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("elisha-sound-preference", callback);
    window.removeEventListener("storage", callback);
  };
}
export function useSoundEnabled() {
  return useSyncExternalStore(subscribe, isSoundEnabled, () => false);
}

export function playSound(name: SoundName): void {
  if (
    !isSoundEnabled() ||
    usePreferences.getState().masterMuted ||
    usePreferences.getState().effectsVolume === 0
  )
    return;
  window.dispatchEvent(
    new CustomEvent("elisha-ui-sound", {
      detail: name === "bootChime" ? 1150 : 450,
    }),
  );
  SOUNDS[name]?.();
}
