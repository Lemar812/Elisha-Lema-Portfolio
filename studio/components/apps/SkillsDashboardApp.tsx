"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  PenTool,
  Code2,
  Database,
  GraduationCap,
} from "lucide-react";
import { capabilities } from "@/data/about";
import { openStudioApp } from "@/studio/lib/navigation";
const groups = [
  {
    ...capabilities[0],
    icon: PenTool,
    skills: [
      "Brand identities",
      "Logo design",
      "Posters & banners",
      "Digital & print layouts",
    ],
    example:
      "See how the Kili Expeditions identity brings a travel business into one mark.",
    work: "work-1",
  },
  {
    ...capabilities[1],
    icon: Code2,
    skills: [
      "Responsive layouts",
      "Website interfaces",
      "Interactive experiences",
      "Frontend implementation",
    ],
    example:
      "Explore the NatureWiseTours website, from visual direction to the live experience.",
    work: "work-19",
  },
  {
    ...capabilities[2],
    work: undefined,
    icon: Database,
    skills: [
      "Database connections",
      "Forms & data handling",
      "Backend integration",
    ],
    example:
      "Connecting the visible website with the data and services a project needs.",
  },
  {
    work: undefined,
    title: "Programming foundation",
    text: "Power Learn Project’s 16-week Software Development programme, completed in May 2024.",
    icon: GraduationCap,
    skills: [
      "Python",
      "Web technologies",
      "Database management",
      "Dart & Flutter",
    ],
    example:
      "Specialisation in Dart and Flutter for mobile application development.",
  },
];
export default function SkillsDashboardApp() {
  const [active, setActive] = useState(0);
  const item = groups[active];
  const Icon = item.icon;
  return (
    <section className="ec-content ec-skills">
      <p className="ec-kicker">Capability tree / Design meets development</p>
      <h1>
        Two ways of thinking.
        <br />
        <span>One creative practice.</span>
      </h1>
      <p className="ec-lead">
        From the way a brand looks to the way a website works. Explore the
        capabilities behind the work.
      </p>
      <div className="ec-skill-layout">
        <nav className="ec-skill-nav" aria-label="Capability groups">
          {groups.map((g, i) => (
            <button
              key={g.title}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              <g.icon size={22} />
              <span>
                <small>0{i + 1}</small>
                {g.title}
              </span>
              <ArrowUpRight size={16} />
            </button>
          ))}
        </nav>
        <section className="ec-skill-detail" key={item.title}>
          <Icon size={38} strokeWidth={1.2} />
          <h2>{item.title}</h2>
          <p>{item.text}</p>
          <ul>
            {item.skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p>{item.example}</p>
          {item.work ? (
            <button
              className="ec-secondary"
              onClick={() => openStudioApp("projects", item.work)}
            >
              See it in the work <ArrowUpRight size={16} />
            </button>
          ) : (
            <button
              className="ec-secondary"
              onClick={() =>
                openStudioApp(
                  item.title === "Programming foundation"
                    ? "resume"
                    : "contact",
                )
              }
            >
              {item.title === "Programming foundation"
                ? "View credentials"
                : "Discuss your project"}{" "}
              <ArrowUpRight size={16} />
            </button>
          )}
        </section>
      </div>
    </section>
  );
}
