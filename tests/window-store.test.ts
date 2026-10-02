import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { useWindowStore as store } from "../lib/windowStore";
import { fitWindow } from "../lib/windowGeometry";
const initial = store.getState();
beforeEach(() => store.setState(initial, true));
test("dock focuses a covered window and minimizes only the focused window", () => {
  store.getState().openApp("works"); store.getState().openApp("about");
  store.getState().toggleApp("works");
  assert.equal(store.getState().focusedId, "works"); assert.equal(store.getState().windows.works.isMinimized, false);
  store.getState().toggleApp("works");
  assert.equal(store.getState().windows.works.isMinimized, true); assert.equal(store.getState().focusedId, "about");
});
test("closing the front window focuses the next visible window", () => {
  store.getState().openApp("works"); store.getState().openApp("about"); store.getState().openApp("contact");
  store.getState().closeApp("contact"); assert.equal(store.getState().focusedId, "about");
  store.getState().minimizeApp("about"); assert.equal(store.getState().focusedId, "works");
  store.getState().closeApp("works"); assert.equal(store.getState().focusedId, null);
});
test("minimize/restore preserves position, maximization and project selection", () => {
  store.getState().openApp("works"); store.getState().moveApp("works", { x: 90, y: 45 });
  store.getState().selectWork("work-9", "Poster/Banner"); store.getState().toggleMaximize("works");
  store.getState().minimizeApp("works"); store.getState().openApp("works");
  assert.deepEqual(store.getState().windows.works.position, { x: 90, y: 45 });
  assert.equal(store.getState().windows.works.isMaximized, true);
  assert.equal(store.getState().selectedWork, "work-9");
});
test("show desktop hides open apps without closing them", () => {
  store.getState().openApp("about"); store.getState().openApp("works"); store.getState().showDesktop();
  assert.equal(store.getState().focusedId, null); assert.equal(store.getState().windows.about.isOpen, true);
  assert.equal(store.getState().windows.works.isMinimized, true);
});
test("window bounds remain reachable on tablet, tiny and resized viewports", () => {
  assert.deepEqual(fitWindow({ x: 500, y: -10 }, 760, 580, 608, 420), { width: 608, height: 420, x: 0, y: 0 });
  assert.deepEqual(fitWindow({ x: 10000, y: 10000 }, 520, 400, 900, 600), { width: 520, height: 400, x: 380, y: 200 });
  assert.deepEqual(fitWindow({ x: 100, y: 100 }, 760, 580, 0, 0), { width: 0, height: 0, x: 0, y: 0 });
});
