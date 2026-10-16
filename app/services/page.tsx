import { ReadingLayout } from "@/components/shared/ReadingLayout";
import { services } from "@/data/services";
import Link from "next/link";
export const metadata = {
  title: "Services",
  description:
    "Brand identity, web development and graphic design from Elisha Creatives.",
  alternates: { canonical: "/services" },
};
export default function Services() {
  return (
    <ReadingLayout>
      <p className="ec-kicker">Elisha Creatives / Services</p>
      <h1>
        Design and development
        <br />
        <span>for your business.</span>
      </h1>
      {services.map((s, i) => (
        <section className="ec-next" key={s.title}>
          <p className="ec-kicker">0{i + 1}</p>
          <h2>{s.title}</h2>
          <p>{s.description}</p>
        </section>
      ))}
      <div className="ec-actions">
        <Link className="ec-primary" href="/#contact">
          Discuss your project ↗
        </Link>
        <Link className="ec-secondary" href="/work">
          Explore the work ↗
        </Link>
      </div>
    </ReadingLayout>
  );
}
