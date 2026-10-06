"use client";
import { APPS } from "@/lib/appRegistry";
import { useWindowStore } from "@/lib/windowStore";
import { GridIcon } from "@/lib/icons";
export function Dock() {
  const { windows, focusedId, toggleApp, libraryOpen, showLibrary } = useWindowStore();
  const pinned = ['welcome', 'preferences', 'help'];
  const dockApps = [...pinned.map(id => APPS.find(app => app.id === id)!), ...APPS.filter(app => !pinned.includes(app.id) && windows[app.id].isOpen)];
  const renderApp = (app: (typeof APPS)[number]) => {
    const Icon = app.icon, win = windows[app.id];
    const action = focusedId === app.id && !win.isMinimized ? 'Minimize' : win.isOpen ? 'Focus' : 'Open';
    return <button key={app.id} id={`dock-${app.id}`} onClick={() => toggleApp(app.id)} aria-label={`${action} ${app.label}`} aria-pressed={focusedId === app.id} className="dock-item"><Icon className="h-5 w-5" /><span>{app.label}</span>{win.isOpen && <i aria-hidden className={`dock-dot ${win.isMinimized ? 'opacity-40' : ''}`} />}</button>;
  };
  return <nav aria-label="Dock" className="dock">
    {renderApp(dockApps[0])}
    <button id="library-trigger" onClick={() => showLibrary(!libraryOpen)} aria-label="App Library" aria-expanded={libraryOpen} className="dock-item"><GridIcon className="h-5 w-5" /><span>Apps</span></button>
    <div aria-hidden className="mx-1 h-9 w-px bg-white/20" />
    {dockApps.slice(1).map(renderApp)}
  </nav>;
}
