"use client";
import Link from "next/link";
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="ec-recovery">
      <section>
        <span className="ec-kicker">Elisha Creatives / Recovery</span>
        <h1>Let’s try that again.</h1>
        <p>
          The workspace could not finish loading. Your browser may need a fresh
          connection.
        </p>
        <div className="ec-actions">
          <button className="ec-primary" onClick={reset}>
            Try again
          </button>
          <Link className="ec-secondary" href="/work">
            Browse creatives
          </Link>
        </div>
      </section>
    </main>
  );
}
