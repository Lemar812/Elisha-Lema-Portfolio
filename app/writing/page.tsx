import { ReadingLayout } from "@/components/shared/ReadingLayout";
import Link from "next/link";
export const metadata = {
  title: "Notes",
  description: "Stories and thinking behind Elisha Creatives.",
  alternates: { canonical: "/writing" },
};
export default function Writing() {
  return (
    <ReadingLayout>
      <p className="ec-kicker">Notes / Behind the work</p>
      <h1>
        The ideas behind
        <br />
        <span>the creatives.</span>
      </h1>
      <Link href="/writing/why-elisha-creatives" className="ec-next">
        <span className="ec-kicker">01 / Brand story</span>
        <div>
          <h2>Why Elisha Creatives?</h2>
          <p>How programming and design became one creative practice.</p>
        </div>
        <span aria-hidden>↗</span>
      </Link>
    </ReadingLayout>
  );
}
