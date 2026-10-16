import { test, expect } from "@playwright/test";

test("tray Escape dismisses the menu without closing the app", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#welcome");
  const welcome = page.getByRole("dialog", { name: "Welcome", exact: true });
  for (const name of ["Wi-Fi", "Battery"]) {
    const trigger = page.getByRole("button", { name, exact: true });
    await trigger.click();
    await trigger.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(welcome).toBeVisible();
  }
});

test("a dock restore supersedes an unfinished minimize animation", async ({ page }) => {
  await page.goto("/#welcome");
  await page.getByRole("button", { name: "Skip intro" }).click();
  const welcome = page.getByRole("dialog", { name: "Welcome", exact: true });
  await welcome.getByRole("button", { name: "Minimize", exact: true }).click();
  await page.getByRole("toolbar", { name: "Dock" }).getByRole("button", { name: "Welcome (open)", exact: true }).click();
  // Check after the old animation could have completed, not just its first frame.
  await page.waitForTimeout(1200);
  await expect(welcome).toBeVisible();
});

test("contact labels stay stable after validation and edits clear old errors", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#contact");
  const contact = page.getByRole("dialog", { name: "Contact.app", exact: true });
  await contact.getByRole("button", { name: /Prepare email|Send message/ }).click();
  const name = contact.getByRole("textbox", { name: "Your name", exact: true });
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await name.fill("Preview visitor");
  await expect(name).toHaveAttribute("aria-invalid", "false");
});
