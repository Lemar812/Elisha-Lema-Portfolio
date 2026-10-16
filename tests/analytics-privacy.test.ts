import test from "node:test";
import assert from "node:assert/strict";
import { useAnalyticsStore } from "../studio/store/analyticsStore";

test("opting out clears usage clocks and does not retain activity while disabled", () => {
  const store = useAnalyticsStore.getState();
  store.setOptOut(false);
  store.trackAppOpen("projects");
  assert.equal(useAnalyticsStore.getState().appUsage.projects.openCount, 1);
  store.setOptOut(true);
  store.trackAppOpen("contact");
  store.trackEvent("interaction", "ignored");
  assert.deepEqual(useAnalyticsStore.getState().events, []);
  assert.deepEqual(useAnalyticsStore.getState().appUsage, {});
  assert.equal(useAnalyticsStore.getState().currentlyOpenApps.size, 0);
  store.setOptOut(false);
  store.trackAppOpen("contact");
  assert.equal(useAnalyticsStore.getState().appUsage.contact.openCount, 1);
  assert.equal(useAnalyticsStore.getState().appUsage.contact.totalTimeMs, 0);
});
