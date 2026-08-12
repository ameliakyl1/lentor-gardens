import { test, expect } from "@playwright/test";

test("homepage loads and has expected H1", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
});

test("all navigation anchors exist on the page", async ({ page }) => {
  await page.goto("/");
  const anchors = [
    "about",
    "location",
    "price",
    "floorplans",
    "brochure",
    "gallery",
    "developer",
    "faq",
    "contact",
  ];
  for (const id of anchors) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test("mobile menu opens, shows links, and closes after selecting a link", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator("#menu-toggle");
  await toggle.click();
  await expect(page.locator("#mobile-menu")).toHaveAttribute("data-state", "open");
  await page.locator('[data-mobile-nav-link][href="#faq"]').click();
  await expect(page.locator("#mobile-menu")).toHaveAttribute("data-state", "closed");
});

test("mobile menu closes with Escape key", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#menu-toggle").click();
  await expect(page.locator("#mobile-menu")).toHaveAttribute("data-state", "open");
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toHaveAttribute("data-state", "closed");
});

test("Book Showflat CTA reaches the contact section", async ({ page }) => {
  await page.goto("/");
  await page.locator('.desktop-cta[href="#contact"]').click();
  await expect(page).toHaveURL(/#contact$/);
});

test("WhatsApp link is correctly formatted", async ({ page }) => {
  await page.goto("/");
  const href = await page.locator('[data-track="click_whatsapp"]').first().getAttribute("href");
  expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
});

test("telephone link is correctly formatted", async ({ page }) => {
  await page.goto("/");
  const href = await page.locator('[data-track="click_call"]').first().getAttribute("href");
  expect(href).toMatch(/^tel:/);
});

test("floorplan modal opens and closes with Escape", async ({ page }) => {
  await page.goto("/");
  await page.locator(".floorplan-card").first().click();
  const modal = page.locator(".floorplan-modal").first();
  await expect(modal).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
});

test("contact form shows validation errors on empty submit", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.locator("#submit-btn").click();
  await expect(page.locator("#fullName-error")).toBeVisible();
  await expect(page.locator("#mobileNumber-error")).toBeVisible();
});

test("consent checkboxes are not pre-checked", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#consentEnquiry")).not.toBeChecked();
  await expect(page.locator("#consentMarketing")).not.toBeChecked();
});

test("legal pages load", async ({ page }) => {
  for (const path of ["/privacy", "/terms", "/disclaimer"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBeLessThan(400);
  }
});

test("thank-you page loads", async ({ page }) => {
  const response = await page.goto("/thank-you");
  expect(response?.status()).toBeLessThan(400);
});
