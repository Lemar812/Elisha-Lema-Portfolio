/**
 * Terminal command registry
 *
 * Each command returns one of:
 *   - string[]  — plain text lines
 *   - { type: 'action'; action: string; payload?: string }  — triggers an OS action
 *   - { type: 'special'; id: string }  — renders a custom component in the terminal
 */

import { works } from "@/data/works";
import { capabilities, process } from "@/data/about";
import { services } from "@/data/services";
import { opinions } from "@/studio/data/aboutMe";
import type { AppType } from "@/studio/shared/types";

export type CommandResult =
  | string[]
  | { type: "action"; action: "openWindow"; payload: AppType }
  | { type: "action"; action: "openAssistant"; payload: string }
  | { type: "action"; action: "toggleTheme" }
  | { type: "action"; action: "openProject"; payload: string }
  | { type: "action"; action: "startTour" | "closeTerminal" | "planProject" | "history" }
  | { type: "special"; id: "matrix" | "hire" };

export type TerminalContext = {
  openWindow: (appType: AppType) => void;
  toggleTheme: () => void;
  currentTheme: "light" | "dark";
};

export type CommandHandler = (
  args: string[],
  ctx: TerminalContext,
) => CommandResult;

/**
 * Single source of truth for contact details. The `contact`, `secret`,
 * `github`, and `about` handlers reference this so the canonical email and
 * links never drift between commands.
 */
export const CONTACT = {
  email: "elishalema12@gmail.com",
  instagram: "instagram.com/elishacreatives",
  github: "github.com/Lemar812",
  web: "elishalema.netlify.app",
} as const;
export const OPEN_APP_ALIASES: Record<string, AppType> = {
  welcome: "welcome",
  about: "about-me",
  projects: "projects",
  creatives: "projects",
  skills: "skills-dashboard",
  services: "services",
  testimonials: "testimonials",
  contact: "contact",
  terminal: "terminal",
  arcade: "games",
  games: "games",
  settings: "display-options",
  preferences: "display-options",
  finder: "file-explorer",
  resume: "resume",
  changelog: "changelog",
  activity: "github-activity",
  browser: "browser",
  help: "help",
  analytics: "analytics",
  ai: "dev-ai",
  assistant: "dev-ai",
};
export const THEME_ARGS = ["dark", "light"] as const;
export const commandRegistry: Record<string, CommandHandler> = {
  help: () => [
    "Elisha Creatives / interactive terminal",
    "help — show this command reference",
    "",
    "about · projects [search] · skills · services · process · opinions · contact",
    "find <keywords> · project <id or title> · resume · brief",
    "open <app> · ask <question> · hire elisha · tour",
    "theme dark|light · github · neofetch · matrix",
    "cowsay <message> · secret · clear · echo <message>",
    "history · whoami · ls · pwd · date · sudo · vim · exit",
    "",
    "Use Tab to complete commands and ↑/↓ for history.",
  ],
  about: () => [
    "Elisha Lema — Designer & developer",
    "Based in Tanzania. Freelancing since 2024.",
    "Visual design, frontend websites and backend integration.",
    "Elisha Creatives brings both sides of the practice together.",
  ],
  projects: (args) => projectResults(args.join(" ")),
  find: (args) => args.length ? projectResults(args.join(" ")) : ["Usage: find <title, category or keyword>", "Example: find travel"],
  project: (args) => {
    const query = args.join(" ").toLowerCase();
    if (!query) return ["Usage: project <id or title>", "Example: project work-19"];
    const exact = works.find((w) => w.id === query || w.title.toLowerCase() === query);
    const matches = exact ? [exact] : works.filter((w) => w.title.toLowerCase().includes(query));
    return matches.length === 1
      ? { type: "action", action: "openProject", payload: matches[0].id }
      : matches.length ? ["More than one match. Use a project ID:", ...matches.map((w) => `${w.id} / ${w.title}`)]
      : [`No creative matches “${args.join(" ")}”. Try find <keyword>.`];
  },
  services: () => services.map((s) => `${s.title}: ${s.description}`),
  process: () => process.map((p, i) => `${i + 1}. ${p.title}: ${p.text}`),
  resume: () => ({ type: "action", action: "openWindow", payload: "resume" }),
  brief: () => ({ type: "action", action: "planProject" }),
  history: () => ({ type: "action", action: "history" }),
  skills: () => capabilities.map((c) => `${c.title}: ${c.text}`),
  opinions: () => opinions,
  contact: () => [CONTACT.email, "https://" + CONTACT.instagram, "https://" + CONTACT.github],
  hire: (args) => !args.length || args.join(" ").toLowerCase() === "elisha" ? { type: "special", id: "hire" } : ["Usage: hire elisha", "This shows contact options; it does not send a message."],
  ask: (args) =>
    args.length
      ? { type: "action", action: "openAssistant", payload: args.join(" ") }
      : ["Usage: ask <your question>"],
  open: (args) =>
    Object.hasOwn(OPEN_APP_ALIASES, args.join(" ").toLowerCase())
      ? {
          type: "action",
          action: "openWindow",
          payload: OPEN_APP_ALIASES[args.join(" ").toLowerCase()],
        }
      : ["Available apps: " + Object.keys(OPEN_APP_ALIASES).join(", ")],
  tour: () => ({ type: "action", action: "startTour" }),
  theme: (args, ctx) => {
    if (!args.length) return [`Current appearance: ${ctx.currentTheme}. Use theme dark|light to change it.`];
    const theme = args[0].toLowerCase();
    if (args.length !== 1 || !THEME_ARGS.includes(theme as "dark" | "light"))
      return ["Usage: theme dark|light"];
    return ctx.currentTheme !== theme ? { type: "action", action: "toggleTheme" } : [`Already using ${theme} mode.`];
  },
  github: () => [
    "GitHub: https://" + CONTACT.github,
    "Open Activity for live public contributions.",
  ],
  neofetch: () => [
    "   ec     Elisha Creatives",
    "          Design + development",
    "          Tanzania",
    "          " + works.length + " creatives in the collection",
    "          Imagine. Design. Develop. Create.",
  ],
  matrix: () => ({ type: "special", id: "matrix" }),
  cowsay: (args) => [
    " " + "_".repeat(Math.min(args.join(" ").length || 20, 70)),
    "( " + (args.join(" ") || "Imagine. Design. Develop. Create.") + " )",
    "  \\   ^__^",
    "   \\  (oo)_______",
    "      (__)       )/",
    "          ||----w |",
    "          ||     ||",
  ],
  secret: () => [
    "The e is Elisha’s signature. ec stands for Elisha Creatives.",
    "The brand brings together the products of his design and development.",
  ],
  clear: (args) => args.length ? ["Usage: clear"] : [],
  whoami: () => ["guest@elisha-creatives"],
  ls: () => ["about/ creatives/ skills/ services/ contact.txt resume.pdf"],
  pwd: () => ["/home/elisha-creatives"],
  date: () => [new Date().toLocaleString()],
  echo: (args) => [args.join(" ")],
  sudo: () => [
    "This is a portfolio terminal. No administrator access required.",
  ],
  vim: () => ["This portfolio terminal has no text editor installed.", "Use help to explore the available commands."],
  exit: () => ({ type: "action", action: "closeTerminal" }),
};

function projectResults(query: string): string[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = works.filter((w) => terms.every((term) => `${w.title} ${w.category} ${w.description} ${w.tags.join(" ")}`.toLowerCase().includes(term)));
  return matches.length ? [`${matches.length} creatives${query ? ` matching “${query}”` : " in the collection"}:`, ...matches.map((w) => `${w.id} / ${w.title} / ${w.category}`), "Open one with: project <id>"] : [`No creatives match “${query}”. Try logo, travel, poster or website.`];
}

/** Lookup a command (case-insensitive). Returns null if not found. */
export function resolveCommand(input: string): {
  handler: CommandHandler;
  args: string[];
  baseCmd: string;
} | null {
  const tokens = [...input.trim().matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map((m) => m[1] ?? m[2] ?? m[3]);
  const [command = "", ...args] = tokens;
  const baseCmd = command.toLowerCase();
  if (!Object.hasOwn(commandRegistry, baseCmd)) return null;
  const handler = commandRegistry[baseCmd];
  return { handler, args, baseCmd };
}

/** Every registered command name, in registry order. */
export const commandNames = Object.keys(commandRegistry);

/**
 * Curated, recruiter-pointed suggestions surfaced as the rotating empty-state
 * hint on the input line. Not the full command list on purpose.
 */
export const TERMINAL_SUGGESTIONS = [
  "hire elisha",
  "tour",
  "projects",
  "about",
  "secret",
  "find travel",
  "brief",
];

/** Longest common prefix shared by every string in the list. */
function longestCommonPrefix(items: string[]): string {
  if (items.length === 0) return "";
  let prefix = items[0];
  for (let i = 1; i < items.length; i++) {
    const candidate = items[i];
    let j = 0;
    while (
      j < prefix.length &&
      j < candidate.length &&
      prefix[j] === candidate[j]
    ) {
      j++;
    }
    prefix = prefix.slice(0, j);
    if (prefix === "") break;
  }
  return prefix;
}

/**
 * Resolve completion state for an input token. Pure string logic over a fixed
 * pool of candidate names. Never invokes a handler.
 *
 *   - candidates: pool entries that start with `token` (case-insensitive)
 *   - commonPrefix: longest common prefix of candidates (for Tab-to-fill)
 *   - ghost: case-SENSITIVE remainder of the first candidate that exactly
 *     `startsWith(token)`, else '' (lowercase typing gets a ghost, mismatched
 *     case does not — avoids showing a ghost that wouldn't actually complete)
 */
function completeToken(
  token: string,
  pool: string[],
): {
  ghost: string;
  candidates: string[];
  commonPrefix: string;
} {
  const lower = token.toLowerCase();
  const candidates = pool.filter((name) =>
    name.toLowerCase().startsWith(lower),
  );
  const commonPrefix = longestCommonPrefix(candidates);
  let ghost = "";
  for (const candidate of candidates) {
    if (candidate.startsWith(token)) {
      ghost = candidate.slice(token.length);
      break;
    }
  }
  return { ghost, candidates, commonPrefix };
}

/**
 * Pure, testable autocomplete helper for the terminal input line.
 *
 * Tokenizes like `resolveCommand` (leading whitespace stripped, split on runs
 * of whitespace) and returns the ghost suffix, the candidate pool, and the
 * longest common prefix. Handles command-name completion and arg completion
 * for `open <app>` and `theme <mode>`. Returns empty state for everything else.
 */
export function getCompletions(input: string): {
  ghost: string;
  candidates: string[];
  commonPrefix: string;
} {
  const empty = { ghost: "", candidates: [], commonPrefix: "" };
  if (input.trim() === "") return empty;

  const parts = input.replace(/^\s+/, "").split(/\s+/);

  // Single token, no trailing space → complete the command name.
  if (parts.length === 1) {
    return completeToken(parts[0], commandNames);
  }

  // Two tokens → arg completion for `open` / `theme` only.
  if (parts.length === 2) {
    const base = parts[0].toLowerCase();
    const arg = parts[1];
    if (base === "open") {
      return completeToken(arg, Object.keys(OPEN_APP_ALIASES));
    }
    if (base === "theme") {
      return completeToken(arg, [...THEME_ARGS]);
    }
  }

  return empty;
}
