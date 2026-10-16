/**
 * Pure logic for the Elisha Creatives Browser app — no React, no DOM, so it's unit-testable.
 *
 * The browser is a curated minimal hybrid: sites on the allow-list render live
 * in a sandboxed iframe; everything else gets a graceful "open in new tab"
 * card, so a frame is never blank. The allow-list is the security + UX boundary.
 *
 * Only sites verified to permit framing belong here. Most of the web sends
 * X-Frame-Options / frame-ancestors and cannot be embedded; that is by design
 * the fallback path, not a bug.
 */

/** The project site that permits a live preview. Other addresses open externally. */
export const EMBEDDABLE_HOSTS = ["naturewisetours.netlify.app"] as const;

export const START_URL = "about:home";

export interface StartLink {
  label: string;
  url: string;
  note: string;
}

/** The start-page grid: Elisha's properties first, then the code. */
export const START_LINKS: StartLink[] = [
  {
    label: "NatureWiseTours",
    url: "https://naturewisetours.netlify.app",
    note: "Website design & development",
  },
  {
    label: "Creative collection",
    url: "https://elishalema.netlify.app/work",
    note: "Logos, artwork and websites",
  },
  {
    label: "GitHub",
    url: "https://github.com/Lemar812",
    note: "Explore the code",
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/elishacreatives/",
    note: "Elisha Creatives",
  },
];

/** Turn whatever the user typed into a navigable URL. */
export function normalizeUrl(input: string): string {
  const s = input.trim();
  if (!s) return START_URL;
  if (s === START_URL) return START_URL;
  if (/^[a-z][a-z0-9+.-]*:/i.test(s) && !/^https?:\/\//i.test(s))
    return START_URL;
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

/** Hostname without a leading www., or null if the URL is unparseable. */
export function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Whether a URL may be shown in a live iframe (allow-list match). */
export function isEmbeddableUrl(url: string): boolean {
  const host = hostOf(url);
  if (!host) return false;
  return EMBEDDABLE_HOSTS.some((d) => host === d || host.endsWith(`.${d}`));
}

/** Whether a URL is https (drives the lock glyph). */
export function isSecure(url: string): boolean {
  return /^https:\/\//i.test(url);
}
