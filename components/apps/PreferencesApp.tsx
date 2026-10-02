"use client";
import { usePreferences, type WallpaperStyle } from "@/lib/preferences";
import { useMusic } from "@/components/os/AudioProvider";
export function PreferencesApp() {
  const settings = usePreferences();
  const { enabled, toggle, error } = useMusic();
  return <div className="space-y-8 p-6">
    <div><p className="eyebrow text-muted">Your workspace</p><h2 className="mt-2 text-2xl font-semibold text-heading">Set the atmosphere.</h2></div>
    <section><h3 className="mb-3 text-sm text-heading">Background</h3><div className="wallpaper-options">{(["signature", "grid", "plain"] as WallpaperStyle[]).map(style => <button key={style} className={`wallpaper-option option-${style}`} aria-pressed={settings.wallpaper === style} onClick={() => settings.setWallpaper(style)}><span aria-hidden>{style === "signature" ? "e" : style === "grid" ? "· · ·" : "—"}</span>{style === "signature" ? "Signature" : style === "grid" ? "Quiet grid" : "Plain dark"}</button>)}</div></section>
    <section className="space-y-4"><h3 className="text-sm text-heading">Motion & sound</h3>
      <label className="preference-row"><span>Background motion<small>Respects your device’s reduced-motion setting.</small></span><input type="checkbox" checked={settings.motion} onChange={e => settings.setMotion(e.target.checked)} /></label>
      <label className="preference-row"><span>Interface sounds<small>A soft tone when you select a control.</small></span><input type="checkbox" checked={settings.sounds} onChange={e => settings.setSounds(e.target.checked)} /></label>
      <div className="preference-row"><span>Background music<small>Dream Culture · Kevin MacLeod</small></span><button data-music-toggle className="button-secondary" onClick={toggle}>{enabled ? "Mute music" : "Unmute music"}</button></div>
      {error && <p role="status" className="text-sm text-muted">{error}</p>}
      <label className="preference-row"><span>Music volume · {Math.round(settings.volume * 100)}%</span><input aria-label="Music volume" type="range" min="0" max="1" step=".01" value={settings.volume} onChange={e => settings.setVolume(Number(e.target.value))} /></label>
    </section>
    <p className="text-xs leading-relaxed text-muted">“Dream Culture” by <a className="underline" href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1300046" target="_blank" rel="noopener noreferrer">Kevin MacLeod / incompetech.com</a>. Licensed under <a className="underline" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">Creative Commons Attribution 4.0</a>. Original recording, unmodified. Music starts on arrival when your browser permits it, or after your first interaction. You can mute it at any time; appearance, sound effects, and volume preferences are saved on this device.</p>
  </div>;
}
