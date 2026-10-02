# Elisha Creatives
A graphic design and web development portfolio by Elisha Lema, Tanzania.

The home page is an interactive desktop with a charcoal background, dark app windows, and the original Elisha Creatives wordmark. Phones use a swipe/tap entry screen and app library. The same portfolio also has server-rendered project pages for direct sharing and search.

## Run locally
Use Node.js 20.9+ and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

Development uses .next-dev and production uses .next, so building while the preview is open does not overwrite its generated files.

```sh
npm run build
npm start
```

## Checks
```sh
npm run lint
npm run typecheck
npm test
npm run test:browser
```

The browser tests use installed Google Chrome and expect a running server on port 3000. They cover desktop focus, category filtering, minimize/restore, window bounds, mobile navigation, swipe entry, reduced motion, contact links, CV access, and project pages without JavaScript.

## Brand
- Name: Elisha Creatives; personal attribution: Elisha Lema.
- Primary dark: #0B0C10 desktop and #17191F windows. Secondary navy: #0D1B52 for actions and selected states. White headings and muted light body text.
- Typography: Geist sans-serif for headings and body.
- Original SVG wordmark and e signature: public/brand.
- The original Illustrator kit remains in output/elisha-creatives-brand.
- Full wordmark: use at about 240px wide or larger. Use the signature in compact spaces.
- The original brand kit's clear-space guidance is a quarter of the full logo height on each side.
- One consistent dark/navy appearance is intentional. The incomplete theme switch, simulated battery/network indicators, and nonfunctional sound switch were removed.

## Architecture
- app/page.tsx: server entry; components/os/PortfolioShell.tsx owns the interactive desktop.
- components/os: menu bar, dock, workspace, bounded draggable windows.
- components/mobile: swipe/tap entry and searchable app library.
- components/apps: nine lazily loaded workspace apps.
- components/shared: responsive list/detail layout, reusable project detail and brand components.
- lib/windowStore.ts: Zustand window state, focus, position, maximize, selected project and library.
- lib/windowGeometry.ts: shared clamping logic, tested independently.
- data: editable portfolio content.
- app/work: server-rendered project index and 22 project pages.
- app/layout.tsx: brand metadata, font, and ProfessionalService structured data.

Apps do not have a backend. Contact opens email, phone, WhatsApp, or social profiles. Music attempts autoplay with a first-interaction fallback and a mute control; local preferences persist appearance, motion, effects, and volume.

## Interaction
- The dock opens a closed app, restores a minimized app, focuses a covered app, or minimizes the focused app.
- Close/minimize moves focus to the next visible window. When no windows remain visible, keyboard focus returns to the dock.
- Drag the title bar to move a desktop window. Movement is clamped to the usable workspace.
- With the title bar focused, Alt + arrow keys move a window; Shift increases the step.
- Double-click the title bar or use Maximize/Restore to change window size.
- Escape closes the focused window or App Library.
- Minimized apps remain mounted, preserving selection and scroll position. Closing an app resets its local component state. Window state is not saved across page reloads.
- Mobile Home hides apps and returns to the library. Back to list returns from project/service/testimonial details.
- Motion respects the operating system's reduced-motion preference.
- The CV has Open PDF and Download links even when a device cannot display its embedded preview.

## Direct links
- /#about, /#works, /#resume, /#contact, /#services, /#testimonials open workspace apps.
- /#works/work-9 opens a selected project in the workspace.
- /work lists all projects.
- /work/work-9 is a shareable project page that works without JavaScript.
- Focus changes replace the current hash rather than adding a browser-history entry for every window click.

## Content editing
- data/profile.ts: personal attribution, biography, contact details and statistics.
- data/works.ts: project title, category, image path, description, tags, optional website link. Keep existing IDs stable because they form public URLs.
- data/services.ts, skills.ts, testimonials.ts, socials.ts: corresponding app content.
- public/works: original portfolio images and CV.
- lib/appRegistry.tsx: app labels, components, icons and default sizes. New app IDs also belong in lib/windowStore.ts.

Project descriptions identify the supplied work without inventing client briefs or business results. Add verified briefs, dates, deliverables and results when available. Skill percentages are self-assessed. Testimonials and other experience counts are supplied portfolio content.

## Production URL and deployment
Production: https://elishalema.netlify.app, deployed from Lemar812/Elisha-Lema-Portfolio on GitHub. netlify.toml sets the Next.js build, publish folder, Node version, and production SITE_URL. The local preview is http://localhost:3000.

Set SITE_URL to your actual HTTPS origin in the hosting environment before building, for example the confirmed URL issued by your host. Do not use a guessed domain. The sitemap, canonical project URLs and absolute social-preview links use this setting. When it is absent, the sitemap is empty and domain-dependent metadata is omitted.

The site includes /robots.txt, /sitemap.xml, a brand social-preview image, and a branded favicon/app icon. Rebuild after setting SITE_URL. Use a host that supports Next.js image optimization and server rendering.

## Dependencies and repository notes
Next.js and eslint-config-next are aligned on 15.5.27. PostCSS is overridden to a patched compatible 8.5.x version because Next.js 15 pins an older transitive version. Keep that override until the upstream dependency no longer needs it; run build/tests after dependency changes.

AGENTS.md references bundled Next.js guides that are not shipped with this installed Next.js 15 package. Consult version-15 official documentation when those local guides are absent.

Generated .next, test-results and temporary files are not source. Existing brand and motion deliverables are preserved. Source changes are not automatically committed or published.

## Creative workspace
Desktop starts with the complete centered logo film and four shortcuts. Welcome remains available in the dock. Help provides a skippable six-step tour. Preferences controls signature/grid/plain backgrounds, background motion, optional synthesized interface tones, and music volume. Reduced motion always disables background video. Music attempts to start on arrival. If blocked by the browser, it retries on a click or keypress unless the visitor muted it. It pauses while the tab is hidden.

Featured projects are configured in data/projectStories.ts. The first three represent identity, promotional design, and web work. Project stories describe supplied artwork; optional results are displayed only when populated with verified information. The About window separates Overview, Journey, Approach, and The brand. Pricing has been removed.

public/media/elisha-motion.mp4 is the approved v3 master; the wallpaper plays the complete film in a centered, softly feathered loop, including its white transition. About offers the complete original video. Music attribution and source are in public/media/CREDITS.txt and Preferences.
