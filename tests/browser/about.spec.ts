import { test, expect, type Page, type Locator } from "@playwright/test";
import { works } from "../../data/works";

const sections = [
  "Meet Elisha",
  "The connection",
  "My journey",
  "The signature",
];
async function openAbout(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#about");
  const about = page.getByRole("dialog", { name: "About Elisha", exact: true });
  await expect(
    about.getByRole("heading", { name: "Elisha Lema." }),
  ).toBeVisible();
  await expect
    .poll(() =>
      about
        .getByRole("img", { name: "Portrait of Elisha Lema" })
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  return about;
}
async function noOverflow(about: Locator) {
  expect(
    await about
      .locator(".app-content")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
}
async function captureSections(page: Page, about: Locator, prefix: string) {
  for (let i = 0; i < sections.length; i++) {
    await about.getByRole("tab", { name: sections[i], exact: true }).click();
    await expect(about.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      `bio-tab-${i}`,
    );
    await noOverflow(about);
    for (const img of await about.locator(".bio-main img").all()) {
      await expect
        .poll(() =>
          img.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await page.screenshot({
      path: `output/portfolio-preview/${prefix}-${i + 1}.png`,
    });
    await about.locator(".bio-footer button").scrollIntoViewIfNeeded();
    await expect(about.locator(".bio-footer button")).toBeInViewport();
    await page.screenshot({
      path: `output/portfolio-preview/${prefix}-${i + 1}-end.png`,
    });
  }
}

test("desktop: four chapters, live work count and real project links", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const about = await openAbout(page);
  await expect(
    about
      .locator(".bio-facts > div")
      .filter({ has: page.locator("dt", { hasText: /^Creatives$/ }) })
      .locator("dd"),
  ).toHaveText(`${works.length}in the portfolio`);
  await captureSections(page, about, "about-desktop");
  await about.getByRole("tab", { name: "The connection", exact: true }).click();
  await expect(about.locator(".bio-capabilities article")).toHaveCount(3);
  await expect(about.getByRole("progressbar")).toHaveCount(0);
  await about.locator(".bio-toolbox summary").click();
  await expect(
    about.locator(".bio-toolbox").getByText("React", { exact: true }),
  ).toBeVisible();
  await about.locator(".bio-footer button").click();
  await expect(
    about.getByRole("heading", { name: /Built on curiosity/ }),
  ).toBeFocused();
  await about.getByRole("tab", { name: "The connection", exact: true }).click();
  await about.getByRole("button", { name: /Kili Expeditions/ }).click();
  const work = page.getByRole("dialog", { name: "Creatives", exact: true });
  await expect(
    work.getByRole("heading", { name: "Kili Expeditions", exact: true }),
  ).toBeVisible();
  await work.getByRole("button", { name: "Close", exact: true }).click();
  await about.getByRole("button", { name: /NatureWiseTours/ }).click();
  await expect(
    work.getByRole("heading", { name: /NatureWiseTours/ }).first(),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("large maximized screen: bounded composition in every chapter", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  const about = await openAbout(page);
  await about.getByRole("button", { name: "Maximize", exact: true }).click();
  await expect(about).toHaveCSS("width", "1920px");
  await captureSections(page, about, "about-large");
  await page.setViewportSize({ width: 2560, height: 1440 });
  await about.getByRole("tab", { name: "Meet Elisha", exact: true }).click();
  expect(
    await about
      .locator(".bio-layout")
      .evaluate((el) => el.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(1510);
  await noOverflow(about);
  await page.screenshot({
    path: "output/portfolio-preview/about-ultrawide.png",
  });
});

test("mobile: every chapter, certificate facts, film, and contact", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const about = await openAbout(page);
  await captureSections(page, about, "about-mobile");
  await about.getByRole("tab", { name: "Meet Elisha", exact: true }).click();
  await about.locator(".bio-portrait").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "output/portfolio-preview/about-mobile-portrait.png",
  });
  await about.getByRole("tab", { name: "My journey", exact: true }).click();
  await about
    .locator("summary")
    .filter({ hasText: "Software development training" })
    .click();
  await expect(about.getByText(/16-week Software Development/)).toBeVisible();
  await about
    .locator("summary")
    .filter({ hasText: "Community service at" })
    .click();
  await expect(
    about.getByText(/Rosetta Stone Classroom, eTestify, and EdClub/),
  ).toBeVisible();
  await about.locator(".bio-timeline details").nth(3).scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "output/portfolio-preview/about-mobile-journey-detail.png",
  });
  await about.getByRole("tab", { name: "The signature", exact: true }).click();
  await about
    .locator("summary")
    .filter({ hasText: "See the signature come to life" })
    .click();
  const film = about.getByLabel("Elisha Creatives logo animation");
  await expect(film).toHaveAttribute("controls", "");
  await film.evaluate(async (video: HTMLVideoElement) => {
    video.muted = true;
    await video.play();
  });
  await expect
    .poll(() =>
      film.evaluate((video: HTMLVideoElement) => video.currentTime > 0),
    )
    .toBe(true);
  await film.evaluate((video: HTMLVideoElement) => video.pause());
  await about.getByRole("button", { name: /Work with me/ }).click();
  await expect(
    page.getByRole("dialog", { name: /^Contact(?:\.app)?$/, exact: true }),
  ).toBeVisible();
});

test("tablet and short laptop screens retain reachable navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  const about = await openAbout(page);
  await noOverflow(about);
  await page.screenshot({ path: "output/portfolio-preview/about-tablet.png" });
  await page.setViewportSize({ width: 1366, height: 768 });
  await about.getByRole("tab", { name: "The signature", exact: true }).click();
  await noOverflow(about);
  await about.locator(".bio-footer button").scrollIntoViewIfNeeded();
  await expect(about.locator(".bio-footer button")).toBeInViewport();
  await page.screenshot({
    path: "output/portfolio-preview/about-laptop-end.png",
  });
  await about.getByRole("tab", { name: "Meet Elisha", exact: true }).click();
  await expect(
    about.getByRole("heading", { name: "Elisha Lema." }),
  ).toBeInViewport();
  await about
    .getByRole("button", { name: "Explore my work", exact: true })
    .click();
  const work = page.getByRole("dialog", { name: "Creatives", exact: true });
  await expect(
    work.getByRole("button", { name: "Featured", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("keyboard navigation and small screens preserve the story and actions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  const about = await openAbout(page);
  const tabs = about.getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(tabs.last()).toBeFocused();
  await page.keyboard.press("Home");
  await expect(tabs.first()).toBeFocused();
  for (const section of sections) {
    await about.getByRole("tab", { name: section, exact: true }).click();
    await noOverflow(about);
  }
  await about.getByRole("tab", { name: "Meet Elisha", exact: true }).click();
  await about.getByRole("button", { name: /Follow my journey/ }).click();
  await expect(
    about.getByRole("heading", { name: /Built on curiosity/ }),
  ).toBeFocused();
  await about.getByRole("button", { name: /View my CV/ }).click();
  await expect(page.getByRole("dialog", { name: /Resume/ })).toBeVisible();
});
