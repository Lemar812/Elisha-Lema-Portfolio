import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test("welcome, project library and help are connected", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("toolbar", { name: "Dock" })
    .getByRole("button", { name: "Welcome", exact: true })
    .click();
  const welcome = page.getByRole("dialog", { name: "Welcome", exact: true });
  await welcome.getByRole("button", { name: /Explore \d+ creatives/ }).click();
  await expect(
    page.getByRole("dialog", { name: "Creatives", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Pricing/ })).toHaveCount(0);
  await page
    .getByRole("toolbar", { name: "Dock" })
    .getByRole("button", { name: "Help.app", exact: true })
    .click();
  const help = page.getByRole("dialog", { name: "Help.app", exact: true });
  await expect(
    help.getByRole("heading", { name: "Welcome to Elisha Creatives" }),
  ).toBeVisible();
  await help.getByRole("button", { name: "Next", exact: true }).click();
  await expect(
    help.getByRole("heading", { name: "Command palette" }),
  ).toBeVisible();
});
test("music mute and the selected theme survive ordinary navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sound controls", exact: true }).click();
  const sound = page.getByRole("dialog", { name: "Sound controls", exact: true });
  await sound.getByRole("switch", { name: "Mute all audio" }).check();
  await expect(sound.getByRole("switch", { name: "Mute all audio" })).toBeChecked();
  await sound.getByRole("button", { name: "Close sound controls" }).click();
  await page
    .getByRole("button", { name: "Open About Elisha", exact: true })
    .dblclick();
  await expect
    .poll(() =>
      page.locator("audio").evaluate((a: HTMLAudioElement) => a.paused),
    )
    .toBe(true);
  await page
    .getByRole("button", { name: "Switch to light mode", exact: true })
    .click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect(page.locator(".signature-motion img")).toBeVisible();
});
test("search opens a specific creative and Escape only dismisses the palette", async ({
  page,
}) => {
  await page.goto("/#about");
  await expect(
    page.getByRole("dialog", { name: "About Elisha", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Control+k");
  const search = page.getByRole("dialog", { name: "Search portfolio" });
  await expect(search).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(search).toBeHidden();
  await expect(
    page.getByRole("dialog", { name: "About Elisha", exact: true }),
  ).toBeVisible();
});
