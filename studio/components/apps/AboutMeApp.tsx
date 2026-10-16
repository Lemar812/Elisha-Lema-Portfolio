"use client";
import { AboutMeApp } from "@/components/apps/AboutMeApp";
import { openStudioApp } from "@/studio/lib/navigation";
export default function About() {
  return (
    <AboutMeApp
      onNavigate={(id) =>
        openStudioApp(
          id === "works"
            ? "projects"
            : id === "about"
              ? "about-me"
              : id === "preferences"
                ? "display-options"
                : id,
        )
      }
      onWork={(id) => openStudioApp("projects", id)}
    />
  );
}
