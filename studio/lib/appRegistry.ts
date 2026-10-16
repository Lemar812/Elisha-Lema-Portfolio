/**
 * App Registry — Single source of truth for all Elisha Creatives apps.
 *
 * Adding a new app:
 *   1. Add the AppType to shared/types.ts
 *   2. Create the component in components/apps/
 *   3. Add an entry here — that's it.
 *
 * WindowManager, Taskbar, Launchpad, and osStore all consume this registry.
 */

import { lazy } from "react";
import React from "react";
import {
  Activity,
  House,
  BriefcaseBusiness,
  MessagesSquare,
  BarChart3,
  Mail,
  Terminal,
  Gamepad2,
  Settings,
  HardDrive,
  ScrollText,
  Github,
  Compass,
  LifeBuoy,
  MessageSquare,
} from "lucide-react";
import { IdentificationCard, Folders, ReadCvLogo } from "@phosphor-icons/react";
import type { AppType } from "@/studio/shared/types";

// Phosphor icon wrappers — bake in the weight so AppIcon gets the right visual style
const AboutMeIcon = (
  props: React.SVGProps<SVGSVGElement> & { size?: number },
) =>
  React.createElement(IdentificationCard, {
    ...props,
    weight: "duotone",
  } as Parameters<typeof IdentificationCard>[0]);
const ProjectsIcon = (
  props: React.SVGProps<SVGSVGElement> & { size?: number },
) =>
  React.createElement(Folders, { ...props, weight: "fill" } as Parameters<
    typeof Folders
  >[0]);
const ResumeIcon = (props: React.SVGProps<SVGSVGElement> & { size?: number }) =>
  React.createElement(ReadCvLogo, { ...props, weight: "duotone" } as Parameters<
    typeof ReadCvLogo
  >[0]);
import { appLabels } from "@/studio/data/copy";

export interface AppRegistration {
  /** Lazy-loaded React component */
  component: React.LazyExoticComponent<React.ComponentType>;
  /** Lucide icon component */
  icon: React.ElementType;
  /** Tailwind color name for icon tint (e.g. 'blue', 'orange') */
  iconColor: string;
  /** Default window size */
  defaultSize: { width: number; height: number };
  /** Default window position */
  defaultPosition: { x: number; y: number };
  /** Pin to the dock (always visible even when not running) */
  pinnedToDock: boolean;
  /** Show in the Launchpad */
  launchpad: boolean;
}

// ---------------------------------------------------------------------------
// Lazy-loaded app components
// ---------------------------------------------------------------------------

const components = {
  welcome: lazy(() => import("@/studio/components/apps/WelcomeApp")),
  services: lazy(() => import("@/studio/components/apps/ServicesApp")),
  testimonials: lazy(() => import("@/studio/components/apps/TestimonialsApp")),
  "about-me": lazy(() => import("@/studio/components/apps/AboutMeApp")),
  projects: lazy(() => import("@/studio/components/apps/ProjectsApp")),
  "skills-dashboard": lazy(
    () => import("@/studio/components/apps/SkillsDashboardApp"),
  ),
  analytics: lazy(() => import("@/studio/components/apps/AnalyticsApp")),
  contact: lazy(() => import("@/studio/components/apps/ContactApp")),
  terminal: lazy(() => import("@/studio/components/apps/TerminalApp")),
  games: lazy(() => import("@/studio/components/apps/GamesApp")),
  "display-options": lazy(() => import("@/studio/components/apps/SettingsApp")),
  "file-explorer": lazy(
    () => import("@/studio/components/apps/FileExplorerApp"),
  ),
  resume: lazy(() => import("@/studio/components/apps/ResumeApp")),
  changelog: lazy(() => import("@/studio/components/apps/ChangelogApp")),
  "github-activity": lazy(
    () => import("@/studio/components/apps/GitHubActivityApp"),
  ),
  browser: lazy(() => import("@/studio/components/apps/BrowserApp")),
  help: lazy(() => import("@/studio/components/apps/HelpApp")),
  "dev-ai": lazy(() => import("@/studio/components/apps/DevAiApp")),
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const appRegistry: Record<AppType, AppRegistration> = {
  welcome: {
    component: components.welcome,
    icon: House,
    iconColor: "blue",
    defaultSize: { width: 860, height: 620 },
    defaultPosition: { x: 190, y: 80 },
    pinnedToDock: true,
    launchpad: true,
  },
  services: {
    component: components.services,
    icon: BriefcaseBusiness,
    iconColor: "blue",
    defaultSize: { width: 920, height: 680 },
    defaultPosition: { x: 180, y: 80 },
    pinnedToDock: false,
    launchpad: true,
  },
  testimonials: {
    component: components.testimonials,
    icon: MessagesSquare,
    iconColor: "blue",
    defaultSize: { width: 850, height: 740 },
    defaultPosition: { x: 190, y: 80 },
    pinnedToDock: false,
    launchpad: true,
  },
  "about-me": {
    component: components["about-me"],
    icon: AboutMeIcon,
    iconColor: "blue",
    defaultSize: { width: 1040, height: 740 },
    defaultPosition: { x: 100, y: 100 },
    pinnedToDock: false,
    launchpad: true,
  },
  projects: {
    component: components["projects"],
    icon: ProjectsIcon,
    iconColor: "orange",
    defaultSize: { width: 920, height: 720 },
    defaultPosition: { x: 150, y: 120 },
    pinnedToDock: false,
    launchpad: true,
  },
  "skills-dashboard": {
    component: components["skills-dashboard"],
    icon: Activity,
    iconColor: "purple",
    defaultSize: { width: 860, height: 720 },
    defaultPosition: { x: 200, y: 140 },
    pinnedToDock: false,
    launchpad: true,
  },
  analytics: {
    component: components["analytics"],
    icon: BarChart3,
    iconColor: "teal",
    defaultSize: { width: 900, height: 650 },
    defaultPosition: { x: 250, y: 160 },
    pinnedToDock: false,
    launchpad: true,
  },
  contact: {
    component: components["contact"],
    icon: Mail,
    iconColor: "pink",
    defaultSize: { width: 900, height: 760 },
    defaultPosition: { x: 300, y: 180 },
    pinnedToDock: false,
    launchpad: true,
  },
  terminal: {
    component: components["terminal"],
    icon: Terminal,
    iconColor: "slate",
    defaultSize: { width: 700, height: 450 },
    defaultPosition: { x: 180, y: 200 },
    pinnedToDock: false,
    launchpad: true,
  },
  games: {
    component: components["games"],
    icon: Gamepad2,
    iconColor: "green",
    defaultSize: { width: 620, height: 580 },
    defaultPosition: { x: 220, y: 160 },
    pinnedToDock: false,
    launchpad: true,
  },
  "display-options": {
    component: components["display-options"],
    icon: Settings,
    iconColor: "red",
    defaultSize: { width: 650, height: 550 },
    defaultPosition: { x: 350, y: 150 },
    pinnedToDock: true,
    launchpad: true,
  },
  "file-explorer": {
    component: components["file-explorer"],
    icon: HardDrive,
    iconColor: "sky",
    defaultSize: { width: 750, height: 550 },
    defaultPosition: { x: 180, y: 120 },
    pinnedToDock: false,
    launchpad: true,
  },
  resume: {
    component: components["resume"],
    icon: ResumeIcon,
    iconColor: "amber",
    defaultSize: { width: 650, height: 550 },
    defaultPosition: { x: 200, y: 130 },
    pinnedToDock: false,
    launchpad: true,
  },
  changelog: {
    component: components["changelog"],
    icon: ScrollText,
    iconColor: "indigo",
    defaultSize: { width: 1040, height: 740 },
    defaultPosition: { x: 250, y: 150 },
    pinnedToDock: false,
    launchpad: true,
  },
  "github-activity": {
    component: components["github-activity"],
    icon: Github,
    iconColor: "green",
    defaultSize: { width: 720, height: 600 },
    defaultPosition: { x: 180, y: 110 },
    pinnedToDock: false,
    launchpad: true,
  },
  browser: {
    component: components["browser"],
    icon: Compass,
    iconColor: "sky",
    defaultSize: { width: 1040, height: 720 },
    defaultPosition: { x: 160, y: 90 },
    pinnedToDock: false,
    launchpad: true,
  },
  help: {
    component: components["help"],
    icon: LifeBuoy,
    iconColor: "amber",
    defaultSize: { width: 760, height: 580 },
    defaultPosition: { x: 200, y: 100 },
    pinnedToDock: true,
    launchpad: true,
  },
  "dev-ai": {
    component: components["dev-ai"],
    icon: MessageSquare,
    iconColor: "indigo",
    defaultSize: { width: 420, height: 620 },
    defaultPosition: { x: 320, y: 120 },
    // Mobile-only surface: opened through the mobile AppView, never the
    // desktop dock or Launchpad (the desktop assistant orb stays the desktop path).
    pinnedToDock: false,
    launchpad: true,
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get app label/title from copy system, falling back to registry defaults */
export function getAppLabel(appType: AppType) {
  return (
    appLabels[appType] ?? {
      title: appType,
      windowTitle: appType,
      description: "",
    }
  );
}

/** Get apps pinned to the dock */
export function getPinnedApps() {
  return (Object.entries(appRegistry) as [AppType, AppRegistration][])
    .filter(([, reg]) => reg.pinnedToDock)
    .map(([appType, reg]) => ({ appType, ...reg }));
}

/** Get all apps that should appear in the Launchpad */
export function getLaunchpadApps() {
  return (Object.entries(appRegistry) as [AppType, AppRegistration][])
    .filter(([, reg]) => reg.launchpad)
    .map(([appType, reg]) => ({ appType, ...reg }));
}
