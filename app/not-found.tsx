import Link from "next/link";
export default function NotFound() {
  return (
    <main className="ec-recovery">
      <section>
        <span className="ec-kicker">Elisha Creatives / System message</span>
        <p className="ec-recovery-face" aria-hidden>
          :(
        </p>
        <h1>This page wandered off.</h1>
        <p>
          The workspace is still here. Return to the desktop or explore the
          creative collection.
        </p>
        <code>PAGE_NOT_FOUND · 404</code>
        <div className="ec-actions">
          <Link href="/" className="ec-primary">
            Return to desktop
          </Link>
          <Link href="/work" className="ec-secondary">
            Browse creatives
          </Link>
        </div>
        <small>ec · Elisha Creatives by Elisha Lema</small>
      </section>
    </main>
  );
}
