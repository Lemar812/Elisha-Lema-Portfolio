export type ChangeType = "feature" | "fix" | "perf" | "refactor" | "release";
export interface Release {
  highlight?: string;
  version: string;
  date: string;
  codename: string;
  summary: string;
  changes: { type: ChangeType; text: string }[];
}
export const CHANGE_TYPE_LABEL: Record<ChangeType, string> = {
  feature: "FEATURE",
  fix: "FIX",
  perf: "PERFORMANCE",
  refactor: "REFINEMENT",
  release: "RELEASE",
};
export const RELEASES: Release[] = [
  {
    version: "2.0 preview",
    date: "October 2026",
    codename: "Creative workspace",
    summary:
      "A complete desktop and phone experience, built around Elisha Creatives.",
    changes: [
      {
        type: "feature",
        text: "Phone home screen, app library, gestures and full-screen apps.",
      },
      {
        type: "feature",
        text: "Global search, window snapping, Finder, terminal, arcade and activity.",
      },
      {
        type: "refactor",
        text: "Shared project content across the gallery, search and Finder.",
      },
    ],
  },
  {
    version: "1.1",
    date: "October 2026",
    codename: "The person behind the work",
    summary:
      "An introduction to Elisha, his capabilities, journey and creative practice.",
    changes: [
      {
        type: "feature",
        text: "About Elisha: story, capabilities, certificates and brand meaning.",
      },
      {
        type: "refactor",
        text: "Creatives count follows the actual portfolio collection.",
      },
    ],
  },
  {
    version: "1.0",
    date: "October 2026",
    codename: "Elisha Creatives",
    summary: "The branded portfolio desktop.",
    changes: [
      {
        type: "feature",
        text: "Brand introduction, motion wallpaper, music and app windows.",
      },
      {
        type: "fix",
        text: "The introduction replays on refresh; windows move behind the dock.",
      },
    ],
  },
];
