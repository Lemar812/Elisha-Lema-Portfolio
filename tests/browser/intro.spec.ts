import { test, expect } from "@playwright/test";
test("silent introduction and brand title, then desktop reveal and music", async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Designer.', { exact: true })).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(0);
  await expect(page.getByText('Developer.', { exact: true })).toBeVisible();
  await expect(page.locator('.intro-manifesto')).toHaveText('Imagine.Design.Develop.Create.');
  await expect(page.locator('.intro-manifesto span')).toHaveCount(4);
  await expect(page.locator('.intro-brand h1')).toHaveText('Elisha Creatives');
  await expect(page.locator('.intro-brand-byline')).toHaveText('by Elisha Lema');
  await expect(page.locator('.intro-screen video')).toHaveCount(0);
  await page.screenshot({ path: 'output/portfolio-preview/intro-brand.png' });
  await expect(page.locator('audio')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Dock', exact: true })).toBeVisible({ timeout: 12000 });
  await expect(page.locator('audio')).toHaveAttribute('autoplay', '');
  await expect(page.locator('.signature-motion video')).toBeVisible();
  await expect(page.locator('.signature-idle img')).toBeVisible();
  await expect(page.locator('.signature-motion video')).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('Designer.', { exact: true })).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(0);
  await expect(page.getByText('Developer.', { exact: true })).toBeVisible();
  await expect(page.locator('.intro-manifesto')).toHaveText('Imagine.Design.Develop.Create.');
  await expect(page.locator('.intro-brand h1')).toHaveText('Elisha Creatives');
  await expect(page.getByRole('navigation', { name: 'Dock', exact: true })).toBeVisible();
  await expect(page.locator('.signature-motion video')).toBeVisible();
});
test("skip enters immediately and unlocks music; mute stays muted", async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await expect(page.getByRole('navigation', { name: 'Dock', exact: true })).toBeVisible();
  await expect.poll(() => page.locator('audio').evaluate((a: HTMLAudioElement) => !a.paused)).toBe(true);
  await page.getByRole('button', { name: 'Mute music', exact: true }).click();
  await page.getByRole('button', { name: 'Desktop: Selected Work', exact: true }).click();
  await expect.poll(() => page.locator('audio').evaluate((a: HTMLAudioElement) => a.paused)).toBe(true);
});
test("deep links and reduced motion bypass the intro", async ({ page }) => {
  await page.goto('/#contact');
  await expect(page.getByRole('dialog', { name: 'Contact', exact: true })).toBeVisible();
  await expect(page.locator('.intro-role')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Dock', exact: true })).toBeVisible();
  await expect(page.locator('.intro-role')).toHaveCount(0);
});
test("mobile intro opens the app library without a second entry screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await expect(page.getByRole('button', { name: 'Works', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enter workspace' })).toHaveCount(0);
});

test("reload with an open app repeats the silent intro and restores the app", async ({ page }) => {
  await page.goto('/#contact');
  await expect(page.getByRole('dialog', { name: 'Contact', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Designer.', { exact: true })).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(0);
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await expect(page.getByRole('dialog', { name: 'Contact', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Designer.', { exact: true })).toBeVisible();
});
