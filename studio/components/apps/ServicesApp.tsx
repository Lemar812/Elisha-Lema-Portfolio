"use client";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { services } from "@/data/services";
import { works } from "@/data/works";
import { process } from "@/data/about";
import { openStudioApp } from "@/studio/lib/navigation";
const ids = ["work-1", "work-19", "work-9"];
export default function ServicesApp() {
  return (
    <section className="ec-content">
      <p className="ec-kicker">Services / Independent creative practice</p>
      <h1>
        A clearer identity.
        <br />
        <span>A stronger presence.</span>
      </h1>
      <p className="ec-lead">
        Design and website development for business owners, startups and
        established organisations.
      </p>
      <div className="ec-service-list">
        {services.map((s, i) => {
          const work = works.find((w) => w.id === ids[i])!;
          return (
            <article key={s.title}>
              <span className="ec-kicker">0{i + 1}</span>
              <div>
                <h2>{s.title}</h2>
                <p>{s.description}</p>
                <button
                  className="ec-text-link"
                  onClick={() => openStudioApp("projects", work.id)}
                >
                  Explore related work <ArrowUpRight size={16} />
                </button>
              </div>
              <button
                className="ec-service-image"
                onClick={() => openStudioApp("projects", work.id)}
                aria-label={`View ${work.title}`}
              >
                <Image
                  src={work.imageSrc}
                  alt={work.title}
                  width={480}
                  height={320}
                />
              </button>
            </article>
          );
        })}
      </div>
      <section className="ec-process">
        <p className="ec-kicker">How we get there</p>
        <div>
          {process.map((p, i) => (
            <article key={p.title}>
              <small>0{i + 1}</small>
              <h3>{p.title}.</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>
      <footer className="ec-next">
        <h2>What are you imagining?</h2>
        <button className="ec-primary" onClick={() => openStudioApp("contact")}>
          Tell me about it <ArrowUpRight size={16} />
        </button>
      </footer>
    </section>
  );
}
