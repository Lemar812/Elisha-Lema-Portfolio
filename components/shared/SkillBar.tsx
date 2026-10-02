import type { Skill } from "@/data/skills";

export function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-ink">{skill.name}</span>
        <span className="font-sans text-muted">{skill.percentage}%</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface"
        role="progressbar"
        aria-label={skill.name}
        aria-valuenow={skill.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-navy" style={{ width: `${skill.percentage}%` }} />
      </div>
    </div>
  );
}
