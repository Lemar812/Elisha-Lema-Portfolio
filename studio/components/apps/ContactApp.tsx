"use client";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, Check } from "lucide-react";
import { profile } from "@/data/profile";
import { useProjectBriefStore } from "@/studio/store/projectBriefStore";
type Fields = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};
const empty: Fields = {
  name: "",
  email: "",
  company: "",
  subject: "",
  message: "",
};
const labels: Record<keyof Fields, string> = {
  name: "Your name",
  email: "Email address",
  company: "Business or organisation (optional)",
  subject: "What are you creating?",
  message: "Tell me about the project",
};
export default function ContactApp() {
  const [form, setForm] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");
  const pendingBrief = useProjectBriefStore((s) => s.pending);
  useEffect(() => {
    if (!pendingBrief || status === "sending" || useProjectBriefStore.getState().pending !== pendingBrief) return;
    if (form.message.length + pendingBrief.message.length + 2 > 5000) {
      setNotice("Your existing message is too long to add the brief. Shorten it below; your brief is kept until it fits.");
      return;
    }
    useProjectBriefStore.getState().consume();
    setForm((previous) => ({ ...previous, subject: previous.subject || pendingBrief.subject,
      message: previous.message ? `${previous.message}\n\n${pendingBrief.message}` : pendingBrief.message }));
    setErrors({});
    setStatus("idle");
    setNotice("Your project brief is ready to review below. Add your name and email before sending.");
  }, [pendingBrief, status, form.message]);
  function updateField(key: keyof Fields, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    setStatus("idle");
    setNotice("");
  }
  useEffect(() => {
    fetch("/api/studio-status")
      .then((r) => r.json())
      .then((d) => setConnected(!!d.email))
      .catch(() => {});
  }, []);
  const draft = `mailto:${profile.email}?subject=${encodeURIComponent(form.subject || "A project for Elisha Creatives")}&body=${encodeURIComponent(`Hi Elisha,\n\n${form.message}\n\n${form.name}\n${form.company}\n${form.email}`)}`;
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const next: Partial<Fields> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Please enter a valid email address.";
    if (form.subject.trim().length < 5)
      next.subject = "Give your project a short subject.";
    if (form.message.trim().length < 20)
      next.message = "Tell me a little more (at least 20 characters).";
    setErrors(next);
    if (Object.keys(next).length) {
      setNotice("Please check the highlighted fields.");
      return;
    }
    if (!connected) {
      setStatus("draft");
      setNotice(
        "Your draft is ready. Open it in your email app to review and send.",
      );
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("sent");
      setNotice("Your message has been sent. Thank you for getting in touch.");
      setForm(empty);
    } catch (e) {
      setStatus("error");
      setNotice(
        e instanceof Error
          ? e.message
          : "Could not send. Please use email or WhatsApp.",
      );
    }
  }
  return (
    <section className="ec-content">
      <p className="ec-kicker">Contact / Let’s make something</p>
      <h1>
        Good things start
        <br />
        <span>with a conversation.</span>
      </h1>
      <div className="ec-contact-layout">
        <aside>
          <p className="ec-lead">
            A new brand, a better website or an idea you’re still shaping. Tell
            me what you have in mind.
          </p>
          <p>
            Elisha Lema
            <br />
            Designer & developer · Tanzania
          </p>
          <div className="ec-contact-links">
            <a href={`mailto:${profile.email}`}>
              Email Elisha <ArrowUpRight size={16} />
            </a>
            <a
              href="https://wa.me/255674175613"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp <ArrowUpRight size={16} />
            </a>
            <a
              href="https://www.instagram.com/elishacreatives/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram <ArrowUpRight size={16} />
            </a>
            <a
              href="https://github.com/Lemar812"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={16} />
            </a>
          </div>
        </aside>
        <form className="ec-form" onSubmit={submit} noValidate>
          {(["name", "email", "company", "subject", "message"] as const).map(
            (key) => (
              <label key={key} htmlFor={`ec-contact-${key}`}>
                {
                  {
                    name: "Your name",
                    email: "Email address",
                    company: "Business or organisation (optional)",
                    subject: "What are you creating?",
                    message: "Tell me about the project",
                  }[key]
                }
                {key === "message" ? (
                  <textarea
                    disabled={status === "sending"}
                    id={`ec-contact-${key}`}
                    aria-label={labels[key]}
                    maxLength={5000}
                    value={form[key]}
                    onChange={(e) =>
                      updateField(key, e.target.value)
                    }
                    aria-invalid={!!errors[key]}
                    aria-describedby={errors[key] ? `error-${key}` : undefined}
                  />
                ) : (
                  <input
                    disabled={status === "sending"}
                    id={`ec-contact-${key}`}
                    aria-label={labels[key]}
                    type={key === "email" ? "email" : "text"}
                    autoComplete={
                      key === "name"
                        ? "name"
                        : key === "email"
                          ? "email"
                          : key === "company"
                            ? "organization"
                            : "off"
                    }
                    maxLength={key === "email" ? 254 : key === "name" ? 100 : 200}
                    value={form[key]}
                    onChange={(e) =>
                      updateField(key, e.target.value)
                    }
                    aria-invalid={!!errors[key]}
                    aria-describedby={errors[key] ? `error-${key}` : undefined}
                  />
                )}
                {errors[key] && (
                  <small id={`error-${key}`}>{errors[key]}</small>
                )}
              </label>
            ),
          )}
          <button className="ec-primary" disabled={status === "sending"}>
            {status === "sending"
              ? "Sending…"
              : connected
                ? "Send message"
                : "Prepare email"}{" "}
            {status === "sent" ? <Check size={16} /> : <Mail size={16} />}
          </button>
          {!connected && (
            <p className="ec-form-note">
              This opens a draft for you to send through your email app.
            </p>
          )}
          {notice && <p role="status">{notice}</p>}
          {(status === "draft" || status === "error") && (
            <a className="ec-secondary" href={draft}>
              Open email draft <ArrowUpRight size={16} />
            </a>
          )}
        </form>
      </div>
    </section>
  );
}
