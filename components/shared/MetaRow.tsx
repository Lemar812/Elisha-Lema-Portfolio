import type { ReactNode } from "react";

interface MetaItem {
  label: string;
  value: ReactNode;
}

export function MetaRow({ items }: { items: MetaItem[] }) {
  return (
    <dl className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <div key={item.label} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
          <dt className="font-sans text-[11px] uppercase tracking-[0.14em] text-muted">
            {item.label}
          </dt>
          <dd className="break-all text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
