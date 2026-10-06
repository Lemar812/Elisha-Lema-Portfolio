"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePreferences } from "@/lib/preferences";
const AudioContextValue = createContext({ playing: false, enabled: true, error: "", toggle: () => {} });
export const useMusic = () => useContext(AudioContextValue);
export function AudioProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const synth = useRef<AudioContext | null>(null);
  const requested = useRef(true);
  const [enabled, setEnabled] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const volume = usePreferences(s => s.volume);
  useEffect(() => { void usePreferences.persist.rehydrate(); }, []);
  useEffect(() => { if (audio.current) audio.current.volume = volume; }, [volume]);
  async function toggle() {
    const player = audio.current;
    if (!player) return;
    setError("");
    requested.current = !requested.current;
    setEnabled(requested.current);
    if (!requested.current) { player.pause(); setPlaying(false); return; }
    try { await player.play(); if (!requested.current) player.pause(); }
    catch { setError("Playback is unavailable. Try unmuting again."); }
  }
  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    player.volume = usePreferences.getState().volume;
    const start = () => {
      if (!requested.current || document.hidden || !player.paused) return;
      void player.play().then(() => { if (!requested.current) player.pause(); }).catch(() => {
        // Autoplay may require a click or keypress. Keep the visitor's music preference.
      });
    };
    const gesture = (event: Event) => {
      if (event.target instanceof Element && event.target.closest("[data-music-toggle]")) return;
      start();
    };
    start();
    player.addEventListener("canplay", start);
    document.addEventListener("pointerup", gesture);
    document.addEventListener("click", gesture);
    document.addEventListener("keydown", gesture);
    document.addEventListener("visibilitychange", start);
    return () => { player.removeEventListener("canplay", start); document.removeEventListener("pointerup", gesture); document.removeEventListener("click", gesture); document.removeEventListener("keydown", gesture); document.removeEventListener("visibilitychange", start); player.pause(); };
  }, []);
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) audio.current?.pause();

    };
    const sound = (event: MouseEvent) => {
      if (!usePreferences.getState().sounds || !(event.target instanceof Element) || !event.target.closest("button")) return;
      try {
        const ctx = synth.current ?? (synth.current = new AudioContext());
        void ctx.resume();
        const oscillator = ctx.createOscillator(), gain = ctx.createGain();
        oscillator.type = "sine"; oscillator.frequency.setValueAtTime(620, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + .06);
        gain.gain.setValueAtTime(.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .07);
        oscillator.connect(gain); gain.connect(ctx.destination);
        oscillator.start(); oscillator.stop(ctx.currentTime + .08);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      } catch { /* Browsers without Web Audio retain silent controls. */ }
    };
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("click", sound);
    return () => { document.removeEventListener("visibilitychange", visibility); document.removeEventListener("click", sound); void synth.current?.close(); };
  }, []);
  return <AudioContextValue.Provider value={{ playing, enabled, error, toggle }}>
    <audio ref={audio} src="/media/dream-culture.mp3" autoPlay loop preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onError={() => { requested.current = false; setPlaying(false); setEnabled(false); setError("Music is unavailable. Please try again."); }} />
    {children}
  </AudioContextValue.Provider>;
}
export function MusicControl() {
  const { playing, enabled, toggle, error } = useMusic();
  return <div className="music-control"><button data-music-toggle onClick={toggle} aria-pressed={enabled} aria-label={enabled ? "Mute music" : "Unmute music"}><span aria-hidden>♫</span> {enabled ? playing ? "Music on" : "Music ready" : "Music muted"}</button>{error && <span role="status" className="music-error">{error}</span>}</div>;
}
