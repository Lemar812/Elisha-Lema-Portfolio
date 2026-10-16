<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## Product design standard

For every app and feature, design the experience as carefully as the content. Accurate copy alone is not a finished interface. Before implementation, establish the visitor's primary question, the intended first impression, the information hierarchy, the discovery sequence, and the next useful action. Discuss substantive design directions with the user before implementing them.

- Design for the actual desktop window and phone viewport, not just a full browser page. Make the initial view understandable and useful without requiring scrolling through introductory prose.
- Use progressive disclosure for supporting detail while keeping essential identity, capabilities, navigation, and actions easy to find. Curiosity must not depend on hiding basic information or forcing a sequence.
- Give each section a distinct purpose and suitable presentation: visual introduction, demonstrable capabilities, chronological story, or brand meaning. Avoid repeating a portrait and biography in every section or turning every paragraph into an identical card.
- Establish deliberate typography, spacing, contrast, image treatment, and emphasis. Use meaningful visual evidence and authentic project work; never invent metrics, credentials, client outcomes, or decorative evidence.
- Use interaction and motion only when they clarify navigation, relationships, or feedback. Preserve keyboard access, visible focus, touch usability, readable contrast, reduced-motion support, and clear loading/error states.
- Review realistic desktop, on large screens and mobile renders, including scrolling, empty/loading states where applicable, and primary actions. Check legibility, hierarchy, density, consistency, and responsiveness as well as code correctness.
- Complete a personal visual review before inviting the user to review: inspect every section at the normal app size, maximized on a large display, and on mobile. Check image crops, text widths, navigation, lower-page content, and action visibility; repair issues found and inspect the affected views again. Passing code checks alone is not a design review.
- Before calling work complete, explain the design rationale and verification, identify material unresolved weaknesses, and allow the agreed user review. Do not describe quality as guaranteed or claim that no reviewer could raise questions.
