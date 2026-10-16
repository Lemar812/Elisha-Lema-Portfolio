"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Grid2X2, List, Search } from "lucide-react";
import { works } from "@/data/works";
import { featuredWorkIds, projectStories } from "@/data/projectStories";
import { useCreativeSelection, openStudioApp } from "@/studio/lib/navigation";
export default function ProjectsApp() {
  const root = useRef<HTMLElement>(null);
  const { id, select } = useCreativeSelection();
  useEffect(() => {
    root.current?.closest(".app-content")?.scrollTo({ top: 0 });
  }, [id]);
  const [filter, setFilter] = useState("Featured");
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState("grid");
  const [expanded, setExpanded] = useState(false);
  const selected = works.find((w) => w.id === id);
  const story = selected ? projectStories[selected.id] : undefined;
  const results = works.filter(
    (w) =>
      (filter === "All" ||
        (filter === "Featured"
          ? featuredWorkIds.includes(w.id)
          : w.category === filter)) &&
      `${w.title} ${w.tags.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  if (selected)
    return (
      <article
        ref={root}
        className="ec-content ec-project-detail"
        key={selected.id}
      >
        <button className="ec-back" onClick={() => select(null)}>
          <ArrowLeft size={16} /> All creatives
        </button>
        <div className="ec-project-heading">
          <div>
            <p className="ec-kicker">{selected.category} · Elisha Creatives</p>
            <h1>{selected.title}</h1>
          </div>
          <a
            className="ec-secondary"
            href={`/work/${selected.id}`}
            target="_blank"
            rel="noreferrer"
          >
            Project page <ArrowUpRight size={16} />
          </a>
        </div>
        <button
          className={`ec-artwork ${expanded ? "is-expanded" : ""}`}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={`${expanded ? "Fit" : "Enlarge"} ${selected.title} artwork`}
        >
          <Image
            src={selected.imageSrc}
            alt={selected.title}
            width={1400}
            height={1000}
            sizes="(max-width:768px) 100vw, 900px"
            priority
          />
          <span>{expanded ? "Fit artwork" : "Explore the artwork ↗"}</span>
        </button>
        <div className="ec-story">
          <div>
            <p className="ec-kicker">The brief</p>
            <h2>An idea, made visible.</h2>
            <p>{story?.context ?? selected.description}</p>
            {selected.websiteUrl && (
              <a
                className="ec-primary"
                href={selected.websiteUrl}
                target="_blank"
                rel="noreferrer"
              >
                Explore live website <ArrowUpRight size={16} />
              </a>
            )}
          </div>
          <div>
            {story && (
              <>
                <h3>Design focus</h3>
                <p>{story.focus}</p>
                <h3>Decisions behind the work</h3>
                <ul>
                  {story.decisions.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <h3>Deliverables</h3>
                <p>{story.deliverables.join(" · ")}</p>
                {story.result && (
                  <>
                    <h3>Outcome</h3>
                    <p>{story.result}</p>
                  </>
                )}
              </>
            )}
            <div className="ec-tags">
              {selected.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        {!!story?.relatedIds?.length && (
          <section>
            <p className="ec-kicker">Part of the same story</p>
            <div className="ec-work-grid">
              {works
                .filter((w) => story.relatedIds?.includes(w.id))
                .map((w) => (
                  <button
                    className="ec-work-tile"
                    key={w.id}
                    onClick={() => {
                      select(w.id);
                      setExpanded(false);
                    }}
                  >
                    <Image
                      src={w.imageSrc}
                      alt={w.title}
                      width={500}
                      height={360}
                    />
                    <h3>{w.title}</h3>
                  </button>
                ))}
            </div>
          </section>
        )}
        <footer className="ec-next">
          <div>
            <p className="ec-kicker">Your idea could be next</p>
            <h2>Let’s create something that fits.</h2>
          </div>
          <button
            className="ec-primary"
            onClick={() => openStudioApp("contact")}
          >
            Start a conversation <ArrowUpRight size={16} />
          </button>
        </footer>
      </article>
    );
  return (
    <section ref={root} className="ec-content ec-projects">
      <header className="ec-page-heading">
        <div>
          <p className="ec-kicker">Selected work / The collection</p>
          <h1>
            Ideas become
            <br />
            <span>creatives.</span>
          </h1>
        </div>
        <div>
          <strong className="ec-count">
            {works.length.toString().padStart(2, "0")}
          </strong>
          <p>Identities. Visuals. Websites.</p>
        </div>
      </header>
      <div className="ec-work-tools">
        <div className="ec-tabs" aria-label="Filter creatives">
          {["Featured", "All", "Logo", "Poster/Banner", "Website"].map((f) => (
            <button
              aria-pressed={filter === f}
              key={f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="ec-view-toggle">
          <button
            aria-label="Grid view"
            aria-pressed={layout === "grid"}
            onClick={() => setLayout("grid")}
          >
            <Grid2X2 size={18} />
          </button>
          <button
            aria-label="List view"
            aria-pressed={layout === "list"}
            onClick={() => setLayout("list")}
          >
            <List size={18} />
          </button>
        </div>
      </div>
      <label className="ec-search">
        <Search size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a creative…"
          aria-label="Search creatives"
        />
        <span>{results.length} works</span>
      </label>
      <div className={layout === "grid" ? "ec-work-grid" : "ec-work-list"}>
        {results.map((w, i) => (
          <button
            className="ec-work-tile"
            key={w.id}
            onClick={() => {
              select(w.id);
              setExpanded(false);
            }}
          >
            <div className="ec-work-image">
              <Image
                src={w.imageSrc}
                alt={w.title}
                width={800}
                height={600}
                sizes="(max-width:768px) 100vw, 500px"
                loading={i < 2 ? "eager" : "lazy"}
              />
              <span aria-hidden>↗</span>
            </div>
            <div className="ec-work-caption">
              <p className="ec-kicker">{w.category}</p>
              <h2>{w.title}</h2>
            </div>
          </button>
        ))}
      </div>
      {!results.length && (
        <div className="ec-empty">
          <h2>No creatives found.</h2>
          <p>Try another name or explore the full collection.</p>
          <button
            className="ec-secondary"
            onClick={() => {
              setQuery("");
              setFilter("All");
            }}
          >
            Show all creatives
          </button>
        </div>
      )}
    </section>
  );
}
