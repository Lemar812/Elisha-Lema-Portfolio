import { ExternalArrowIcon } from "@/lib/icons";

interface ExternalLinkProps {
  label: string;
  value: string;
  href: string;
}

export function ExternalLink({ label, value, href }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 border-b border-line py-3 text-sm transition hover:bg-surface"
    >
      <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-muted">{label}</span>
      <span className="flex min-w-0 items-center gap-1.5 text-ink">
        <span className="truncate">{value}</span>
        <ExternalArrowIcon className="h-3.5 w-3.5 shrink-0 text-muted transition group-hover:text-heading" />
      </span>
    </a>
  );
}
