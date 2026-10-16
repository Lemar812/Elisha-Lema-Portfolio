import { ReadingLayout } from "@/components/shared/ReadingLayout";
import { capabilities, journey } from "@/data/about";
import { works } from "@/data/works";
import Link from "next/link";
export const metadata = {
  title: "About Elisha",
  description:
    "Elisha Lema, designer and developer in Tanzania. The journey and practice behind Elisha Creatives.",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <ReadingLayout>
      <p className="ec-kicker">About Elisha / Designer & developer</p>
      <h1>
        Design meets
        <br />
        <span>development.</span>
      </h1>
      <p className="ec-lead">
        I’m Elisha Lema, a designer and developer based in Tanzania. Through
        Elisha Creatives, I bring visual design and website development into one
        practice.
      </p>
      <div className="ec-actions">
        <Link className="ec-primary" href="/work">
          Explore {works.length} creatives ↗
        </Link>
        <Link className="ec-secondary" href="/#about">
          Open the interactive About app ↗
        </Link>
      </div>
      <div className="ec-story">
        {capabilities.map((c) => (
          <section key={c.title}>
            <h2>{c.title}</h2>
            <p>{c.text}</p>
          </section>
        ))}
      </div>
      <h2>The journey so far.</h2>
      {journey.map((j) => (
        <section key={j.title} className="ec-next">
          <p className="ec-kicker">{j.date}</p>
          <div className="max-w-2xl">
            <h3>{j.title}</h3>
            <p>{j.text}</p>
          </div>
        </section>
      ))}
      <footer className="ec-next">
        <Link className="ec-secondary" href="/writing/why-elisha-creatives">
          The meaning of Elisha Creatives ↗
        </Link>
        <Link className="ec-primary" href="/#contact">
          Start a conversation ↗
        </Link>
      </footer>
    </ReadingLayout>
  );
}
