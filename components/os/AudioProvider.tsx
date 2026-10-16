"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePreferences } from "@/lib/preferences";
import { playSound, stopSounds } from "@/studio/hooks/useSoundEffects";
const AudioContextValue = createContext({
  playing: false,
  enabled: true,
  error: "",
  toggle: () => {},
});
export const useMusic = () => useContext(AudioContextValue);
export function AudioProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const { volume, masterMuted, musicEnabled } = usePreferences();
  const duckUntil = useRef(0);
  const frame = useRef(0);
  const enabled = musicEnabled && !masterMuted;
  useEffect(() => {
    void usePreferences.persist.rehydrate();
  }, []);
  // Lower the music around interface feedback; repeated sounds extend the interval.
  useEffect(() => {
    let last = performance.now();
    const mix = (now: number) => {
      const player = audio.current;
      if (player) {
        const target =
          usePreferences.getState().volume *
          (now < duckUntil.current ? 0.16 : 1);
        const timeConstant = target < player.volume ? 24 : 180;
        player.volume = Math.max(
          0,
          Math.min(
            1,
            player.volume +
              (target - player.volume) *
                (1 - Math.exp(-(now - last) / timeConstant)),
          ),
        );
      }
      last = now;
      frame.current = requestAnimationFrame(mix);
    };
    const duck = (event: Event) => {
      const duration = (event as CustomEvent<number>).detail;
      duckUntil.current = Math.max(
        duckUntil.current,
        performance.now() + Math.min(2000, duration || 400),
      );
    };
    window.addEventListener("elisha-ui-sound", duck);
    frame.current = requestAnimationFrame(mix);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("elisha-ui-sound", duck);
    };
  }, []);
  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    if (!enabled) {
      player.pause();
      if (masterMuted) stopSounds();
      return;
    }
    if (!document.hidden) void player.play().catch(() => {});
  }, [enabled, masterMuted]);
  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    player.volume = usePreferences.getState().volume;
    const start = () => {
      const prefs = usePreferences.getState();
      if (
        !prefs.musicEnabled ||
        prefs.masterMuted ||
        document.hidden ||
        !player.paused
      )
        return;
      void player
        .play()
        .then(() => {
          const current = usePreferences.getState();
          if (!current.musicEnabled || current.masterMuted) player.pause();
        })
        .catch(() => {});
    };
    const gesture = (event: Event) => {
      if (
        event.target instanceof Element &&
        event.target.closest("[data-music-toggle]")
      )
        return;
      start();
    };
    const visibility = () => (document.hidden ? player.pause() : start());
    const click = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("button"))
        playSound("click");
    };
    start();
    player.addEventListener("canplay", start);
    document.addEventListener("pointerup", gesture);
    document.addEventListener("keydown", gesture);
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("click", click);
    return () => {
      player.removeEventListener("canplay", start);
      document.removeEventListener("pointerup", gesture);
      document.removeEventListener("keydown", gesture);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("click", click);
      player.pause();
      stopSounds();
    };
  }, []);
  function toggle() {
    setError("");
    usePreferences.setState({ musicEnabled: !musicEnabled });
  }
  return (
    <AudioContextValue.Provider value={{ playing, enabled, error, toggle }}>
      <audio
        ref={audio}
        src="/media/dream-culture.mp3"
        loop
        preload="auto"
        data-audio-channel="music"
        data-user-volume={volume}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setError("Music is unavailable. Please try again.");
        }}
      />
      {children}
    </AudioContextValue.Provider>
  );
}
// Legacy shell only; the current workspace uses SoundControl.
export function MusicControl() {
  const { enabled, toggle } = useMusic();
  return (
    <button
      data-music-toggle
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute music" : "Unmute music"}
    >
      ♫
    </button>
  );
}
