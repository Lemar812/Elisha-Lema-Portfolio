"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";
import { useWindowStore, type AppId } from "@/lib/windowStore";
import { fitWindow } from "@/lib/windowGeometry";
interface WindowProps { id: AppId; title: string; width: number; height: number; area: { width: number; height: number }; mobile: boolean; children: ReactNode }
export function Window({ id, title, width, height, area, mobile, children }: WindowProps) {
  const { windows, focusedId, focusApp, closeApp, minimizeApp, toggleMaximize, moveApp, showDesktop } = useWindowStore();
  const win = windows[id];
  const visible = !win.isMinimized && (!mobile || focusedId === id);
  const focused = focusedId === id;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const bounds = fitWindow(win.position, win.isMaximized ? area.width : width, win.isMaximized ? area.height : height, area.width, area.height);
  useEffect(() => {
    if (!visible || !focused) return;
    const frame = requestAnimationFrame(() => {
      if (!ref.current?.contains(document.activeElement)) titleRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [visible, focused]);
  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (mobile || win.isMaximized || event.button !== 0 || (event.target as HTMLElement).closest("button,a")) return;
    focusApp(id);
    drag.current = { x: event.clientX, y: event.clientY, left: bounds.x, top: bounds.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  return <motion.div ref={ref} role="dialog" aria-modal={mobile || undefined} aria-label={title}
    className={`app-window ${mobile ? "mobile-window" : ""} ${focused ? "is-focused" : ""}`}
    inert={!visible} aria-hidden={!visible || undefined}
    style={mobile ? { pointerEvents: visible ? "auto" : "none" } : { left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height, zIndex: win.zIndex, pointerEvents: visible ? "auto" : "none" }}
    onPointerDownCapture={() => focusApp(id)}
    onFocusCapture={() => focusApp(id)}
    initial={reduced ? false : { opacity: 0, y: mobile ? 64 : 12, scale: mobile ? 1 : 0.98 }}
    animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : mobile ? 80 : 10, scale: 1, ...(visible ? { display: "flex" } : {}), transitionEnd: { display: visible ? "flex" : "none" } }}
    exit={reduced ? { opacity: 0 } : { opacity: 0, y: mobile ? 80 : 10, scale: mobile ? 1 : 0.98 }}
    transition={{ duration: reduced ? 0 : 0.2 }}
    onKeyDown={event => {
      if (event.key === "Escape") { event.stopPropagation(); closeApp(id); }
      if (mobile && event.key === "Tab") {
        const nodes = Array.from(ref.current?.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex="0"]') ?? []).filter(el => el.getClientRects().length);
        const first = nodes[0], last = nodes.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }}>
    <div ref={titleRef} tabIndex={0} className="window-titlebar" aria-label={mobile ? title : `${title}. Hold Alt and use arrow keys to move; double-click to maximize.`}
      onDoubleClick={event => { if (!mobile && !(event.target as HTMLElement).closest("button")) toggleMaximize(id); }}
      onPointerDown={startDrag}
      onPointerMove={event => {
        if (!drag.current) return;
        const next = fitWindow({ x: drag.current.left + event.clientX - drag.current.x, y: drag.current.top + event.clientY - drag.current.y }, bounds.width, bounds.height, area.width, area.height);
        moveApp(id, { x: next.x, y: next.y });
      }}
      onPointerUp={() => { drag.current = null; }}
      onPointerCancel={() => { drag.current = null; }}
      onKeyDown={event => {
        if (!mobile && event.altKey && event.key.startsWith("Arrow") && !win.isMaximized) {
          event.preventDefault();
          const step = event.shiftKey ? 40 : 16;
          const next = fitWindow({ x: bounds.x + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0), y: bounds.y + (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0) }, bounds.width, bounds.height, area.width, area.height);
          moveApp(id, { x: next.x, y: next.y });
        }
      }}>
      {mobile ? <button className="mobile-home" onClick={showDesktop}><span aria-hidden>← </span>Home</button> : <div className="window-controls">
        <button aria-label={`Close ${title}`} onClick={() => closeApp(id)} className="control-close">×</button>
        <button aria-label={`Minimize ${title}`} onClick={() => minimizeApp(id)} className="control-minimize">−</button>
        <button aria-label={`${win.isMaximized ? "Restore" : "Maximize"} ${title}`} onClick={() => toggleMaximize(id)} className="control-maximize">↗</button>
      </div>}
      <span className="window-title">{title}</span>
      <span aria-hidden className="window-brand">EC</span>
    </div>
    <div className="window-content">{children}</div>
  </motion.div>;
}
