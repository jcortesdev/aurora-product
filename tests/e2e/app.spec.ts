import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('page loads without accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('sticky add-to-cart appears when hero CTA scrolls out of view, with no a11y violations', async ({
  page,
}) => {
  // Tall viewport so the hero CTA is well within the fold on load.
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/');

  const sticky = page.locator('aside[aria-label="Sticky add to cart"]');
  // The bar is conditionally rendered: it stays out of the DOM until the IO
  // says the hero CTA has left the viewport.
  await expect(sticky).toHaveCount(0);

  // Inject runway so we can scroll past the hero CTA. The real page will gain
  // height naturally once Module 7+ ships below-the-fold sections.
  await page.evaluate(() => {
    const spacer = document.createElement('div');
    spacer.style.height = '2000px';
    document.body.appendChild(spacer);
  });
  await page.evaluate(() => window.scrollTo(0, 2000));
  await expect(sticky).toBeVisible();
  // Wait for the enter transition to settle so axe reads final colors (not the
  // blended mid-transition opacity, which would trip color-contrast).
  await sticky.evaluate(
    (el) =>
      new Promise<void>((resolve) => {
        if (Number.parseFloat(getComputedStyle(el).opacity) >= 1) return resolve();
        el.addEventListener('transitionend', () => resolve(), { once: true });
      })
  );

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);

  // Scrolling back up should unmount the sticky bar again.
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(sticky).toHaveCount(0);
});

test('lazy below-the-fold sections mount on scroll with no a11y violations', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/');

  // Heading visibility implies the lazy chunk fetched, parsed, and rendered.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByRole('heading', { name: /customer reviews/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /you may also like/i })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('cart persists across reload and items can be removed via the popover', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.removeItem('aurora-cart'));
  await page.reload();

  // Add two units of the default Matte Black variant from the hero CTA.
  const addToCart = page.getByRole('button', { name: /^add to cart$/i }).first();
  await addToCart.click();
  await addToCart.click();

  const cartToggle = page.getByRole('button', { name: /cart, 2 items/i });
  await expect(cartToggle).toBeVisible();

  // Reload — items should survive because the cart is persisted in localStorage.
  await page.reload();
  await expect(page.getByRole('button', { name: /cart, 2 items/i })).toBeVisible();

  // Open the popover and remove the only line.
  await page.getByRole('button', { name: /cart, 2 items/i }).click();
  const dialog = page.getByRole('dialog', { name: /shopping cart/i });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: /remove matte black/i }).click();
  await expect(dialog.getByText(/your cart is empty/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /cart, empty/i })).toBeVisible();

  // Persisted state is now an empty array, not a stale 2-item payload.
  const stored = await page.evaluate(() => window.localStorage.getItem('aurora-cart'));
  expect(stored).toBe('[]');
});
