import { test, expect } from "@playwright/test";
test("desktop branding, filter correctness and preserved minimize state", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Open Welcome", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Good design. A stronger presence." })).toBeVisible();
  await page.getByRole("button", { name: "Explore my work" }).click();
  const dialog = page.getByRole("dialog", { name: "Works", exact: true });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Poster/Banner", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "A&B Accessories Brochure — Back" })).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Kili Expeditions" })).toHaveCount(0);
  await dialog.getByRole("button", { name: /A&B Accessories Poster/ }).click();
  await page.getByRole("button", { name: "Minimize Works", exact: true }).last().click();
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: "Focus Works", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "A&B Accessories Poster" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Poster/Banner", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => dialog.locator(".work-image img").first().evaluate(img => (img as HTMLImageElement).naturalWidth), { timeout: 20000 }).toBeGreaterThan(0);
  await page.screenshot({ path: "test-results/desktop-works.png" });
  expect(errors).toEqual([]);
});
test("window focus, maximize, keyboard movement and focus return", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Contact", exact: true }).click();
  const contact = page.getByRole("dialog", { name: "Contact", exact: true });
  const original = await contact.boundingBox();
  await contact.getByRole("button", { name: "Maximize Contact" }).click();
  expect((await contact.boundingBox())!.width).toBeGreaterThan(original!.width);
  await contact.getByRole("button", { name: "Restore Contact" }).click();
  const bar = contact.locator(".window-titlebar");
  await bar.focus(); await page.keyboard.press("Alt+ArrowRight");
  expect((await contact.boundingBox())!.x).toBeGreaterThan(original!.x);
  await page.getByRole("button", { name: "Open About", exact: true }).click();
  await page.getByRole("button", { name: "Focus Contact", exact: true }).click();
  await expect(contact).toBeVisible();
  await contact.getByRole("button", { name: "Close Contact" }).click();
  await expect(page.getByRole("dialog", { name: "About Elisha" }).locator(".window-titlebar")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open About", exact: true })).toBeFocused();
});
test("dragging and resize keep windows within the workspace", async ({ page }) => {
  await page.goto("/#contact");
  const dialog = page.getByRole("dialog", { name: "Contact", exact: true });
  await expect(dialog).toBeVisible();
  const bar = await dialog.locator(".window-titlebar").boundingBox();
  await page.mouse.move(bar!.x + bar!.width / 2, bar!.y + 20);
  await page.mouse.down(); await page.mouse.move(2000, 1800, { steps: 5 }); await page.mouse.up();
  let box = (await dialog.boundingBox())!;
  expect(box.x + box.width).toBeLessThanOrEqual(1425); expect(box.y + box.height).toBeLessThanOrEqual(885);
  await page.setViewportSize({ width: 768, height: 900 });
  await expect.poll(async () => (await dialog.boundingBox())!.x + (await dialog.boundingBox())!.width).toBeLessThanOrEqual(752);
  box = (await dialog.boundingBox())!; expect(box.x).toBeGreaterThanOrEqual(16);
  await page.screenshot({ path: "test-results/tablet-contact.png" });
});
test("App Library searches, closes with Escape, and launches apps", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "App Library", exact: true });
  await trigger.click();
  const library = page.getByRole("dialog", { name: "App Library" });
  await library.getByRole("textbox", { name: "Search apps" }).fill("nothing");
  await expect(library.getByRole("status")).toContainText("No apps match");
  await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
  await trigger.click(); await library.getByRole("textbox").fill("services");
  await library.getByRole("button", { name: "Services", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Services", exact: true })).toBeVisible();
});
test("all apps have readable dark surfaces and contact/CV links", async ({ page }) => {
  await page.goto("/");
  for (const name of ["About", "Works", "Resume", "Contact", "Services", "Testimonials", "Help", "Preferences"]) {
    await page.getByRole("button", { name: new RegExp("^Open " + name + "$") }).click();
    const dialog = page.locator(".app-window.is-focused");
    await expect(dialog).toHaveCSS("background-color", "rgb(23, 25, 31)");
    await expect(dialog.locator(".window-content")).not.toBeEmpty();
    if (name === "Contact") {
      await expect(dialog.locator('a[href="tel:+255674175613"]')).toBeVisible();
      await expect(dialog.locator('a[href="https://www.instagram.com/elishacreatives/"]')).toBeVisible();
    }
    if (name === "Resume") await expect(dialog.getByRole("link", { name: "Open PDF" })).toBeVisible();
    await dialog.getByRole("button", { name: /^Close / }).click();
  }
});
test("mobile unlock, list/detail, Home and deep linking work without overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Enter workspace" }).click();
  await page.getByRole("button", { name: "Works", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Works", exact: true });
  await dialog.getByRole("button", { name: "Website", exact: true }).click();
  await dialog.getByRole("button", { name: /NatureWiseTours/ }).click();
  await expect(dialog.getByRole("heading", { name: "NatureWiseTours" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Back to list" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
  await expect.poll(() => dialog.locator(".work-image img").evaluate(img => (img as HTMLImageElement).naturalWidth), { timeout: 20000 }).toBeGreaterThan(0);
  await page.screenshot({ path: "test-results/mobile-work.png" });
  await dialog.getByRole("button", { name: "Back to list" }).click();
  await expect(dialog.getByRole("button", { name: "Website", exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Home", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Search apps" })).toBeVisible();
  await page.goto("/#works/work-9");
  await expect(page.getByRole("heading", { name: "A&B Accessories Poster" })).toBeVisible();
});
test("swipe unlock and reduced motion are supported", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 680 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const page = await context.newPage(); await page.goto("http://localhost:3000");
  const screen = page.locator(".lock-screen");
  await expect(screen).toBeVisible();
  const touch = await context.newCDPSession(page);
  await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 150, y: 450 }] });
  await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 150, y: 300 }] });
  await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.getByRole("textbox", { name: "Search apps" })).toBeVisible();
  await page.getByRole("button", { name: "Contact", exact: true }).click();
  await expect(page.getByRole("heading", { name: "What are you creating?" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await context.close();
});
test("project routes, metadata, missing page and server HTML", async ({ page, request }) => {
  const response = await request.get("/");
  expect(await response.text()).toContain("Elisha Creatives");
  await page.goto("/work/work-19"); await expect(page).toHaveTitle("NatureWiseTours | Elisha Creatives");
  await expect(page.getByRole("heading", { name: "NatureWiseTours" })).toBeVisible();
  await page.getByRole("link", { name: "View in workspace" }).click();
  await expect(page.getByRole("dialog", { name: "Works", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "NatureWiseTours" })).toBeVisible();
  const missing = await request.get("/work/not-a-project"); expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain("This page isn’t here.");
  const missingRsc = await request.get("/work/not-a-project?_rsc=regression", { headers: { RSC: "1" } });
  // Development may start streaming with 200 before notFound() resolves.
  expect([200, 404]).toContain(missingRsc.status());
  const missingRscBody = await missingRsc.text();
  expect(missingRscBody).toContain("NEXT_HTTP_ERROR_FALLBACK;404");
  expect(missingRscBody).not.toContain("NoFallbackError");
  const cv = await request.get("/works/cv.pdf"); expect(cv.headers()["content-type"]).toContain("application/pdf");
});
test("project index is readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto("http://localhost:3000/work");
  await expect(page.getByRole("heading", { name: "Selected work." })).toBeVisible();
  await expect(page.locator(".project-card")).toHaveCount(22);
  await context.close();
});
