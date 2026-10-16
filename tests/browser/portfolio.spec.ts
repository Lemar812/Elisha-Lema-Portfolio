import { test, expect } from "@playwright/test";
import { works } from "../../data/works";
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test("all apps are discoverable and closed apps leave the dock", async ({
  page,
}) => {
  await page.goto("/");
  const dock = page.getByRole("toolbar", { name: "Dock" });
  await expect(dock.getByRole("button")).toHaveCount(4);
  await dock
    .getByRole("button", { name: "Launchpad, explore all apps" })
    .click();
  const library = page.getByRole("dialog", { name: "App Library" });
  await expect(library.getByRole("button")).toHaveCount(18);
  await library.getByRole("textbox", { name: "Search apps" }).fill("terminal");
  await library.getByRole("button", { name: "Terminal", exact: true }).click();
  const app = page.getByRole("dialog", { name: "Terminal.app", exact: true });
  await app
    .getByRole("textbox", { name: "Terminal command input" })
    .fill("about");
  await app
    .getByRole("textbox", { name: "Terminal command input" })
    .press("Enter");
  await expect(app).toContainText("Freelancing since 2024");
  await app.getByRole("button", { name: "Minimize", exact: true }).click();
  await expect(app).toBeHidden();
  await dock
    .getByRole("button", { name: "Terminal.app (open)", exact: true })
    .click();
  await expect(app).toContainText("Freelancing since 2024");
  await app.getByRole("button", { name: "Close", exact: true }).click();
  await expect(dock.getByRole("button")).toHaveCount(4);
});
test("creative filters, detail and search use the real collection", async ({
  page,
}) => {
  await page.goto("/#works");
  const app = page.getByRole("dialog", { name: "Creatives", exact: true });
  await app.getByRole("button", { name: "All", exact: true }).click();
  await expect(app.locator(".ec-work-tile")).toHaveCount(works.length);
  await app.getByRole("button", { name: "Website", exact: true }).click();
  await expect(app.locator(".ec-work-tile")).toHaveCount(1);
  await app.getByRole("button", { name: /NatureWiseTours/ }).click();
  await expect(
    app.getByRole("heading", { name: "NatureWiseTours", exact: true }),
  ).toBeVisible();
  await expect(
    app.getByRole("link", { name: "Explore live website" }),
  ).toHaveAttribute("href", "https://naturewisetours.netlify.app");
  await app.getByRole("button", { name: "All creatives", exact: true }).click();
  await app
    .getByRole("textbox", { name: "Search creatives" })
    .fill("unmatched-search");
  await expect(
    app.getByRole("heading", { name: "No creatives found." }),
  ).toBeVisible();
});
test("contact preserves a draft on minimize and validates without sending", async ({
  page,
}) => {
  await page.goto("/#contact");
  const app = page.getByRole("dialog", { name: "Contact.app", exact: true });
  await app.getByLabel("Your name", { exact: true }).fill("Preview visitor");
  await app.getByRole("button", { name: "Minimize", exact: true }).click();
  await page
    .getByRole("toolbar", { name: "Dock" })
    .getByRole("button", { name: "Contact.app (open)", exact: true })
    .click();
  await expect(app.getByLabel("Your name", { exact: true })).toHaveValue(
    "Preview visitor",
  );
  await app.getByRole("button", { name: /Prepare email|Send message/ }).click();
  await expect(
    app.getByLabel("Email address", { exact: true }),
  ).toHaveAttribute("aria-invalid", "true");
  await expect(app.getByRole("status")).toContainText("highlighted fields");
});
test("phone library, work detail and close control fit the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#works/work-9");
  const app = page.getByRole("dialog", { name: "Creatives", exact: true });
  await expect(
    app.getByRole("heading", { name: "A&B Accessories Poster", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await app.getByRole("button", { name: "Close app" }).click();
  await page.getByRole("button", { name: "App Library", exact: true }).click();
  const library = page.getByRole("region", {
    name: "App Library",
    exact: true,
  });
  await expect(library).toBeInViewport();
  await library.getByRole("button", { name: "Settings", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Settings", exact: true }),
  ).toBeVisible();
});
