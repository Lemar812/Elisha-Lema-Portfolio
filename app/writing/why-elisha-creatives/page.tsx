import { ReadingLayout } from "@/components/shared/ReadingLayout";
import Link from "next/link";
export const metadata = {
  title: "Why Elisha Creatives?",
  description:
    "The meaning behind Elisha Creatives, the signature e and the initials ec.",
  alternates: { canonical: "/writing/why-elisha-creatives" },
};
export default function Story() {
  return (
    <ReadingLayout>
      <p className="ec-kicker">Brand story / Elisha Lema</p>
      <h1>
        Why Elisha
        <br />
        <span>Creatives?</span>
      </h1>
      <div className="max-w-2xl space-y-7">
        <p className="ec-lead">
          Elisha Creatives began with a simple realisation: productive skills
          need a clear identity.
        </p>
        <p>
          My interest in programming started in secondary school, guided by a
          supportive tech community. Design came later. Over time, the two
          became connected: I could shape how something looked and build how it
          worked.
        </p>
        <p>
          By 2024, I had begun freelancing, working mostly with clients in
          Tanzania through direct, in-person relationships. I had the skills to
          produce useful work, but needed a brand that could bring that work
          together.
        </p>
        <h2>A name that holds both sides.</h2>
        <p>
          Elisha is my real name. Creatives represents the things I produce,
          whether through design or development. Together, Elisha Creatives
          means the creative products made by Elisha.
        </p>
        <p>
          The signature “e” comes from my name, while “ec” is the initial for
          Elisha Creatives. Both belong to the same idea: one person, bringing
          design and development into one practice.
        </p>
        <h2>Imagine. Design. Develop. Create.</h2>
        <p>
          Today, my development focus is websites, especially the frontend—the
          visible parts people interact with. Backend and database integration
          support the projects that need them. Alongside this, I create logos,
          identities and promotional materials for businesses.
        </p>
      </div>
      <footer className="ec-next">
        <Link className="ec-primary" href="/work">
          Explore the creatives ↗
        </Link>
        <Link href="/about">More about Elisha ↗</Link>
      </footer>
    </ReadingLayout>
  );
}
