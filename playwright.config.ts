import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser", fullyParallel: false, workers: 1, timeout: 30000,
  use: { baseURL: "http://localhost:3000", browserName: "chromium", channel: "chrome", viewport: { width: 1440, height: 1000 }, screenshot: "only-on-failure", trace: "retain-on-failure" },
  reporter: "list",
});
