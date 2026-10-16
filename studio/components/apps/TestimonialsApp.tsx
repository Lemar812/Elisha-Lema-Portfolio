"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { openStudioApp } from "@/studio/lib/navigation";
export default function TestimonialsApp() {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];
  return (
    <section className="ec-content ec-testimonials">
      <p className="ec-kicker">Testimonials / In their words</p>
      <h1>
        The work is personal.
        <br />
        <span>So are the relationships.</span>
      </h1>
      <div className="ec-quote-stage" aria-live="polite">
        <span className="ec-quote-mark" aria-hidden>
          “
        </span>
        <blockquote key={index}>{t.text}</blockquote>
        <p>
          <strong>{t.name}</strong>
          <span>{t.role}</span>
        </p>
      </div>
      <div className="ec-quote-nav">
        <span>
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(testimonials.length).padStart(2, "0")}
        </span>
        <div>
          <button
            aria-label="Previous testimonial"
            onClick={() =>
              setIndex((index + testimonials.length - 1) % testimonials.length)
            }
          >
            <ArrowLeft size={20} />
          </button>
          <button
            aria-label="Next testimonial"
            onClick={() => setIndex((index + 1) % testimonials.length)}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      <footer className="ec-next">
        <p>Have a project in mind?</p>
        <button
          className="ec-secondary"
          onClick={() => openStudioApp("contact")}
        >
          Let’s talk <ArrowUpRight size={16} />
        </button>
      </footer>
    </section>
  );
}
