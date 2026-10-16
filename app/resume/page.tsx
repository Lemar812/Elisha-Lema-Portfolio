import { ReadingLayout } from "@/components/shared/ReadingLayout";
import { RESUME } from "@/studio/data/resume";
export const metadata = {
  title: "Resume",
  description:
    "Experience, capabilities and software development training of Elisha Lema.",
  alternates: { canonical: "/resume" },
};
export default function Resume() {
  return (
    <ReadingLayout>
      <p className="ec-kicker">Experience & training</p>
      <h1>{RESUME.name}</h1>
      <p className="ec-lead">
        {RESUME.title} · {RESUME.contact.location}
      </p>
      <a className="ec-primary" href="/works/cv.pdf" download>
        Download CV ↗
      </a>
      <section className="ec-story">
        <div>
          <h2>Profile</h2>
          <p>{RESUME.summary}</p>
        </div>
        <div>
          <h2>Capabilities</h2>
          {RESUME.skills.map((s) => (
            <p key={s.category}>
              <strong>{s.category}</strong>
              <br />
              {s.items.join(" · ")}
            </p>
          ))}
        </div>
      </section>
      <h2>Experience</h2>
      {RESUME.experience.map((e) => (
        <section key={e.company} className="ec-next">
          <p className="ec-kicker">{e.period}</p>
          <div className="max-w-2xl">
            <h3>{e.role}</h3>
            <p>{e.company}</p>
            {e.bullets.map((b) => (
              <p key={b}>{b}</p>
            ))}
          </div>
        </section>
      ))}
      <section className="ec-next">
        <h2>Education</h2>
        <div className="max-w-2xl">
          {RESUME.education.map((e) => (
            <article key={`${e.institution}-${e.degree}`}>
              <h3>{e.institution}</h3>
              <p>
                {e.degree} · {e.period}
              </p>
              <p>{e.detail}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="ec-next">
        <h2>Training</h2>
        <div className="max-w-2xl">
          {RESUME.training.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>
                {item.institution} · {item.period}
              </p>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </ReadingLayout>
  );
}
