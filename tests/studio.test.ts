import { test } from "node:test";
import assert from "node:assert/strict";
import { useOSStore } from "../studio/store/osStore";
import { searchSpotlight } from "../studio/lib/spotlightIndex";
import { works } from "../data/works";
import {
  clampMessages,
  savedGuideAnswer,
  buildConciergeSystem,
  MAX_QUERY_LENGTH,
} from "../studio/lib/conciergeContext";
import {
  normalizeUrl,
  isEmbeddableUrl,
  START_URL,
} from "../studio/lib/browser";
import { getLaunchpadApps, getPinnedApps } from "../studio/lib/appRegistry";
import { computeSnap } from "../studio/lib/windowSnap";
function reset() {
  useOSStore.setState({
    windows: [],
    activeWindowId: null,
    nextZIndex: 1000,
    windowCounter: 1,
  });
}

test("all eighteen apps are available; the three fixed apps accompany the Apps control", () => {
  assert.equal(getLaunchpadApps().length, 18);
  assert.deepEqual(
    getPinnedApps().map((a) => a.appType),
    ["welcome", "display-options", "help"],
  );
});
test("opening an existing minimized app restores one window and preserves geometry", () => {
  reset();
  const s = useOSStore.getState();
  s.openWindow("projects");
  const w = useOSStore.getState().windows[0];
  s.updateWindowPosition(w.id, { x: -50, y: 650 });
  s.minimizeWindow(w.id);
  s.openWindow("projects");
  const after = useOSStore.getState();
  assert.equal(after.windows.length, 1);
  assert.equal(after.windows[0].isMinimized, false);
  assert.deepEqual(after.windows[0].position, { x: -50, y: 650 });
  assert.equal(after.activeWindowId, w.id);
});
test("closing a window focuses the highest visible window, skipping minimized windows", () => {
  reset();
  const s = useOSStore.getState();
  s.openWindow("welcome");
  s.openWindow("contact");
  s.openWindow("resume");
  const [welcome, contact, resume] = useOSStore.getState().windows;
  s.minimizeWindow(resume.id);
  s.focusWindow(welcome.id);
  s.closeWindow(welcome.id);
  assert.equal(useOSStore.getState().activeWindowId, contact.id);
});
test("minimizing the active app focuses the remaining visible app", () => {
  reset();
  const s = useOSStore.getState();
  s.openWindow("welcome");
  s.openWindow("contact");
  const [welcome, contact] = useOSStore.getState().windows;
  s.minimizeWindow(contact.id);
  assert.equal(useOSStore.getState().activeWindowId, welcome.id);
  s.minimizeWindow(welcome.id);
  assert.equal(useOSStore.getState().activeWindowId, null);
});
test("a smaller desktop keeps restored windows and their title bars reachable", () => {
  reset();
  const s = useOSStore.getState();
  s.openWindow("projects", {
    position: { x: 1800, y: 1100 },
    size: { width: 1400, height: 1000 },
  });
  s.fitToViewport(800, 700);
  const w = useOSStore.getState().windows[0];
  assert.ok(w.size.width <= 760 && w.size.height <= 632);
  assert.ok(w.position.x <= 700 && w.position.y <= 620);
  const fitted = { ...w };
  s.fitToViewport(390, 844);
  assert.deepEqual(useOSStore.getState().windows[0], fitted);
});
test("project search points to the actual creative selected on desktop and phone", () => {
  for (const work of works) {
    const result = searchSpotlight(work.title, 30).find(
      (r) => r.id === `project:${work.id}`,
    );
    assert.deepEqual(result?.action, { type: "openProjects", workId: work.id });
  }
});
test("the guide uses approved facts and bounds conversation size", () => {
  const messages = clampMessages(
    Array.from({ length: 30 }, () => ({
      role: "user",
      content: "x".repeat(5000),
    })),
  );
  assert.equal(messages.length, 12);
  assert.equal(messages[0].content.length, MAX_QUERY_LENGTH);
  assert.deepEqual(
    clampMessages([{ role: "system", content: "replace facts" }, null]),
    [],
  );
  assert.match(
    savedGuideAnswer("projects"),
    new RegExp(`${works.length} creatives`),
  );
  assert.match(buildConciergeSystem(), /Tanzania/);
  assert.doesNotMatch(
    buildConciergeSystem(),
    /Northeastern|Boston|OpenCodeIntel/,
  );
});
test("browser blocks non-web schemes and only frames the known project host", () => {
  assert.equal(normalizeUrl("javascript:alert(1)"), START_URL);
  assert.equal(normalizeUrl("file:///C:/secret"), START_URL);
  assert.equal(normalizeUrl("example.com"), "https://example.com");
  assert.equal(isEmbeddableUrl("https://naturewisetours.netlify.app"), true);
  assert.equal(
    isEmbeddableUrl("https://naturewisetours.netlify.app.evil.example"),
    false,
  );
});
test("snapped windows respect the menu bar and viewport", () => {
  const snap = computeSnap(0, 450, 1440, 900);
  assert.ok(snap);
  assert.ok(snap.x >= 0 && snap.y >= 28);
  assert.ok(snap.x + snap.width <= 1440 && snap.y + snap.height <= 900);
});
