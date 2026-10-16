"use client";

/**
 * DesktopWidgets — rotating dev quotes card, top-right corner of the desktop.
 *
 * Positioning notes:
 *   - The menu bar is 28px tall (h-7).
 *   - NotificationCenter renders at top-9 (36px). A typical notification card
 *     is ~90px tall, ending at ~126px from the top.
 *   - This widget starts at top-[130px] so notifications have clear space above
 *     it and never overlap on initial page load.
 *
 * Clock note:
 *   - The menu bar already shows the full date + time in the system tray.
 *   - This widget therefore skips the clock and focuses on the quotes rotator,
 *     which is the part that adds personality and isn't duplicated elsewhere.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/studio/store/themeStore";

const QUOTES = [
  { text: "Imagine. Design. Develop. Create.", author: "Elisha Creatives" },
  { text: "Design meets development.", author: "Elisha Creatives" },
  { text: "Identities. Visuals. Websites.", author: "Elisha Creatives" },
];

export function DesktopWidgets() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const { mode } = useTheme();

  const isDark = mode === "dark";

  // Rotate quotes every 18 seconds
  useEffect(() => {
    const t = setInterval(
      () => setQuoteIdx((i) => (i + 1) % QUOTES.length),
      18_000,
    );
    return () => clearInterval(t);
  }, []);

  const quote = QUOTES[quoteIdx];

  // Theme-aware frosted glass card
  const card = isDark
    ? "bg-black/25 border-white/10"
    : "bg-surface/95 border-border";
  const quoteColor = isDark ? "text-white/40" : "text-text-secondary";
  const authorColor = isDark ? "text-white/25" : "text-text-secondary";

  return (
    /*
     * top-[130px] — clears the menu bar (28px) + a full notification card (~90px)
     *               so the welcome notification never overlaps this widget.
     * pointer-events-none / select-none — widget is decorative; clicks pass through
     *   to windows underneath.
     */
    <div className="absolute right-5 top-[130px] pointer-events-none select-none z-[1]">
      <div
        className={`rounded-2xl border backdrop-blur-md px-5 py-4 text-right max-w-[240px] ${card}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIdx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="space-y-1.5"
          >
            <p className={`text-[10px] leading-relaxed italic ${quoteColor}`}>
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className={`text-[9px] ${authorColor}`}>· {quote.author}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
