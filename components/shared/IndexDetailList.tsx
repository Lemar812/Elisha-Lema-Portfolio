"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
interface IndexDetailListProps<T> {
  items: T[]; getId: (item: T) => string; getTitle: (item: T) => string;
  getSubtitle?: (item: T) => string; renderDetail: (item: T) => ReactNode;
  matchesCategory?: (item: T, category: string) => boolean;
  categories?: string[]; getCategory?: (item: T) => string;
  selectedId?: string | null; category?: string;
  onSelect?: (id: string) => void; onCategory?: (category: string, firstId: string | null) => void;
}
export function IndexDetailList<T>({ items, getId, getTitle, getSubtitle, renderDetail, matchesCategory, categories, getCategory, selectedId, category, onSelect, onCategory }: IndexDetailListProps<T>) {
  const [localCategory, setCategory] = useState("All");
  const [localId, setId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(Boolean(selectedId));
  const detail = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const activeCategory = category ?? localCategory;
  const filtered = activeCategory === "All" || !getCategory ? items : items.filter(item => matchesCategory ? matchesCategory(item, activeCategory) : getCategory(item) === activeCategory);
  const selected = filtered.find(item => getId(item) === (selectedId ?? localId)) ?? filtered[0];
  useEffect(() => { if (selectedId !== undefined) setShowDetail(Boolean(selectedId)); }, [selectedId]);
  const choose = (item: T) => {
    setId(getId(item)); onSelect?.(getId(item)); setShowDetail(true);
    requestAnimationFrame(() => { detail.current?.scrollTo(0, 0); detail.current?.focus({ preventScroll: true }); });
  };
  return <div className={`index-detail ${showDetail ? "show-detail" : ""}`}>
    <div ref={list} className="index-pane" tabIndex={-1}>
      <div className="index-heading"><span>Explore</span><span>{filtered.length.toString().padStart(2, "0")}</span></div>
      {categories && <div className="category-filters">{["All", ...categories].map(cat => <button key={cat} aria-pressed={activeCategory === cat} onClick={() => {
        const first = items.find(item => cat === "All" || (matchesCategory ? matchesCategory(item, cat) : getCategory?.(item) === cat));
        setCategory(cat); setId(first ? getId(first) : null); onCategory?.(cat, first ? getId(first) : null); setShowDetail(false);
      }}>{cat}</button>)}</div>}
      <div className="index-items">{filtered.map((item, index) => <button key={getId(item)} onClick={() => choose(item)} aria-current={selected && getId(selected) === getId(item) ? "true" : undefined}>
        <span className="index-number">{String(index + 1).padStart(2, "0")}</span><span className="min-w-0"><span className="index-item-title">{getTitle(item)}</span>{getSubtitle && <span className="index-subtitle">{getSubtitle(item)}</span>}</span><span aria-hidden className="index-arrow">↗</span>
      </button>)}</div>
    </div>
    <div ref={detail} className="detail-pane" tabIndex={-1} aria-label="Selected item details">
      <button className="detail-back" onClick={() => { setShowDetail(false); requestAnimationFrame(() => list.current?.focus()); }}>← Back to list</button>
      {selected ? renderDetail(selected) : <p className="text-muted">Nothing to show.</p>}
    </div>
  </div>;
}
