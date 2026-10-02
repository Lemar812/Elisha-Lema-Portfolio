"use client";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
const AboutMeApp = dynamic(() => import("@/components/apps/AboutMeApp").then(m => m.AboutMeApp), { loading: () => <p className="p-6 text-sm text-muted" role="status">Opening app…</p> });
const WorksApp = dynamic(() => import("@/components/apps/WorksApp").then(m => m.WorksApp), { loading: () => <p className="p-6 text-sm text-muted" role="status">Opening app…</p> });
const ResumeApp = dynamic(() => import("@/components/apps/ResumeApp").then(m => m.ResumeApp), { loading: () => <p className="p-6 text-sm text-muted" role="status">Opening app…</p> });
const ContactApp = dynamic(() => import("@/components/apps/ContactApp").then(m => m.ContactApp), { loading: () => <p className="p-6 text-sm text-muted" role="status">Opening app…</p> });
const ServicesApp = dynamic(() => import("@/components/apps/ServicesApp").then(m => m.ServicesApp), { loading: () => <p className="p-6 text-sm text-muted" role="status">Opening app…</p> });
const TestimonialsApp = dynamic(() => import("@/components/apps/TestimonialsApp").then(m => m.TestimonialsApp), { loading: () => <p className="p-6 text-sm text-muted" role="status">Opening app…</p> });
import {
  PersonCardIcon,
  FolderIcon,
  DocumentIcon,
  MailIcon,
  BriefcaseIcon,
  GridIcon,
  QuoteIcon,
} from "@/lib/icons";
import type { AppId } from "@/lib/windowStore";

export interface AppDefinition {
  id: AppId;
  label: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  Component: ComponentType;
  width: number;
  height: number;
}

const WelcomeApp = dynamic(() => import("@/components/apps/WelcomeApp").then(m => m.WelcomeApp));
const HelpApp = dynamic(() => import("@/components/apps/HelpApp").then(m => m.HelpApp));
const PreferencesApp = dynamic(() => import("@/components/apps/PreferencesApp").then(m => m.PreferencesApp));

export const APPS: AppDefinition[] = [
  { id: "about", label: "About", title: "About Elisha", icon: PersonCardIcon, Component: AboutMeApp, width: 640, height: 580 },
  { id: "works", label: "Works", title: "Works", icon: FolderIcon, Component: WorksApp, width: 760, height: 580 },
  { id: "resume", label: "Resume", title: "Resume.pdf — Preview", icon: DocumentIcon, Component: ResumeApp, width: 620, height: 640 },
  { id: "contact", label: "Contact", title: "Contact", icon: MailIcon, Component: ContactApp, width: 520, height: 520 },
  { id: "services", label: "Services", title: "Services", icon: BriefcaseIcon, Component: ServicesApp, width: 680, height: 480 },
  { id: "testimonials", label: "Testimonials", title: "Testimonials", icon: QuoteIcon, Component: TestimonialsApp, width: 680, height: 520 },
  { id: "welcome", label: "Welcome", title: "Welcome to Elisha Creatives", icon: GridIcon, Component: WelcomeApp, width: 600, height: 570 },
  { id: "help", label: "Help", title: "Workspace guide", icon: DocumentIcon, Component: HelpApp, width: 540, height: 520 },
  { id: "preferences", label: "Preferences", title: "Preferences", icon: GridIcon, Component: PreferencesApp, width: 560, height: 600 },
];
