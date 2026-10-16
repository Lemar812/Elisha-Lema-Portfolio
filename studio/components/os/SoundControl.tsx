"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Volume2, VolumeX, X } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
import MusicSettings from "@/studio/components/apps/MusicSettings";

export default function SoundControl() {
  const muted = usePreferences((s) => s.masterMuted);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const outside = (event: PointerEvent) => {
      if (
        !panel.current?.contains(event.target as Node) &&
        !trigger.current?.contains(event.target as Node)
      )
        setOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", key, true);
    };
  }, [open]);
  return (
    <>
      <button
        ref={trigger}
        aria-label="Sound controls"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="ec-sound-trigger"
        title="Sound controls"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      {open &&
        createPortal(
          <div
            ref={panel}
            role="dialog"
            aria-label="Sound controls"
            className="ec-sound-panel"
          >
            <header>
              <strong>Sound</strong>
              <button
                aria-label="Close sound controls"
                onClick={() => {
                  setOpen(false);
                  trigger.current?.focus();
                }}
              >
                <X size={18} />
              </button>
            </header>
            <MusicSettings />
          </div>,
          document.body,
        )}
    </>
  );
}
