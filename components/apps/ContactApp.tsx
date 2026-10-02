import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { ExternalLink } from "@/components/shared/ExternalLink";
import { BrandLogo } from "@/components/shared/BrandLogo";
export function ContactApp() {
  return <div className="space-y-6 p-6"><BrandLogo white className="w-60 max-w-full" /><div><p className="eyebrow text-muted">Let’s work together</p><h2 className="mt-2 text-2xl font-semibold text-heading">What are you creating?</h2><p className="mt-3 text-sm leading-relaxed text-muted">Tell me about your business, what you need, and your timeline. We can discuss the right approach for your project.</p></div>
    <div className="flex flex-wrap gap-3"><a className="button-primary" href="https://wa.me/255674175613" target="_blank" rel="noopener noreferrer">Start on WhatsApp ↗</a><a className="button-secondary" href={`mailto:${profile.email}`}>Send an email</a></div>
    <dl className="divide-y divide-line border-y border-line text-sm"><div className="flex flex-wrap justify-between gap-2 py-3"><dt className="text-muted">Email</dt><dd className="break-all text-heading"><a href={`mailto:${profile.email}`}>{profile.email}</a></dd></div>{profile.phones.map((phone, i) => <div key={phone} className="flex flex-wrap justify-between gap-2 py-3"><dt className="text-muted">{i ? "Alternate phone" : "Business phone"}</dt><dd><a className="text-heading" href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a></dd></div>)}</dl>
    <div>{socials.map(s => <ExternalLink key={s.label} label={s.label} value={s.label === "Instagram" ? "@elishacreatives" : s.label === "WhatsApp" ? "+255 674 175 613" : "View profile"} href={s.href} />)}</div>
    <p className="text-xs text-muted">Elisha Creatives · By Elisha Lema · Tanzania</p>
  </div>;
}
