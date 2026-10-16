"use client";

import { Search } from "lucide-react";

interface PageDotsProps {
  /** Number of real home pages (dots). */
  count: number;
  /** Currently visible page index. The App Library is index === count. */
  active: number;
  /**
   * When true, render a trailing search/library glyph after the dots that reads
   * as active when the App Library page (index === count) is showing.
   */
  showLibrary?: boolean;
  onNavigate?: (page: number) => void;
}

export default function PageDots({
  count,
  active,
  showLibrary = false,
  onNavigate,
}: PageDotsProps) {
  const libraryActive = active >= count;

  return (
    <nav
      className="flex items-center justify-center gap-1.5"
      aria-label="Home pages"
    >
      {Array.from({ length: count }).map((_, i) => (
        <button
          type="button"
          aria-label={`Home page ${i + 1}`}
          onClick={() => onNavigate?.(i)}
          key={i}
          aria-current={i === active}
          className={`h-8 w-8 grid place-items-center rounded-full transition-colors ${
            i === active ? "text-white" : "text-white/35"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        </button>
      ))}

      {showLibrary && (
        <button
          type="button"
          onClick={() => onNavigate?.(count)}
          aria-current={libraryActive}
          aria-label="App Library"
          className={`ml-1 flex h-8 w-8 items-center justify-center transition-colors ${
            libraryActive ? "text-white" : "text-white/35"
          }`}
        >
          <Search size={11} strokeWidth={2.25} />
        </button>
      )}
    </nav>
  );
}
