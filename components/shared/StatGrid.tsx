interface Stat {
  value: string;
  label: string;
}

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-line bg-surface p-4 text-center"
        >
          <p className="font-sans font-semibold text-2xl text-heading">{stat.value}</p>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.14em] text-muted">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
