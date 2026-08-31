import { test, expect, type Page } from "@playwright/test";

/**
 * Target. Defaults to the local preview; set SITE_URL to run the same checks against the
 * deployed site, which is what actually matters — a disclosure can be correct in the build and
 * broken in production.
 *
 *   SITE_URL=https://example.com npm run test:disclosure
 */
const TARGET = process.env.SITE_URL ?? "/";

/**
 * Operator-disclosure compliance tests.
 *
 * These exist because of a specific, real failure. A sibling marketing page for another project
 * carried a correctly worded compliance notice at the very top of its HTML — and never showed it
 * to anyone, because the site header painted over it at a higher stacking level. The disclosure
 * was present in the markup and invisible on screen, which is indistinguishable from deliberately
 * hidden text and is exactly what Google Ads' Misrepresentation policy treats as egregious.
 *
 * Asserting that the text exists is therefore not enough. Each check below asserts that the
 * disclosure is actually *seen*: rendered, non-trivially sized, not painted over by anything
 * else, no smaller than body copy, and legible against its own background.
 *
 * If any of these fail, the disclosure is not doing its job and the build should not ship.
 */

/** Selectors that must resolve to a visible, unobscured disclosure element. */
const DISCLOSURES = [
  { name: "top notice bar", selector: ".notice-bar-inner p" },
  { name: "about-this-website statement", selector: "#about-website p" },
  { name: "appointment chain statement", selector: ".chain-detail" },
  { name: "contact credentials", selector: ".credentials-lines" },
  { name: "footer disclosure", selector: ".footer-disclosure-box p" },
  { name: "footer operator name", selector: ".operated-by-name" },
  { name: "footer operator lines", selector: ".operated-by-line" },
];

/** Facts that must appear in the rendered text of every page. */
const REQUIRED_TEXT = [
  "Amelia Lek Kai Yi",
  "R072094A",
  "L3008899K",
  "not the official developer website",
];

/**
 * Claims that must never appear. Unsubstantiated pricing, scarcity and investment language are
 * the categories that draw Misrepresentation enforcement in property advertising.
 */
const FORBIDDEN_TEXT = [
  "guaranteed return",
  "guaranteed profit",
  "risk-free",
  "best investment",
  "lowest price",
  "limited units available",
  "selling fast",
  "last chance",
  "to be updated",
];

function srgb(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance([r, g, b]: number[]): number {
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}

function contrastRatio(fg: number[], bg: number[]): number {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function parseRgb(value: string): number[] {
  const parts = value.match(/\d+(\.\d+)?/g);
  if (!parts) throw new Error(`unparseable colour: ${value}`);
  return parts.slice(0, 3).map(Number);
}

/**
 * Dismiss the consent notice. It is an intentional overlay, so leaving it up would make every
 * obscured-element check fail for the wrong reason.
 */
async function dismissConsent(page: Page) {
  const decline = page.getByRole("button", { name: /decline non-essential/i });
  if (await decline.count()) {
    await decline.first().click();
    await page.waitForTimeout(200);
  }
}

test.describe("operator disclosures", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(TARGET);
    await dismissConsent(page);
  });

  for (const { name, selector } of DISCLOSURES) {
    test(`${name} is present and rendered`, async ({ page }) => {
      const el = page.locator(selector).first();
      await expect(el, `${name} (${selector}) is missing from the page`).toHaveCount(1);
      await expect(el, `${name} is in the DOM but not visible`).toBeVisible();

      const box = await el.boundingBox();
      expect(box, `${name} has no layout box`).not.toBeNull();
      expect(box!.height, `${name} has collapsed to zero height`).toBeGreaterThan(4);
      expect(box!.width, `${name} has collapsed to zero width`).toBeGreaterThan(4);
    });

    test(`${name} is not painted over by another element`, async ({ page }) => {
      const el = page.locator(selector).first();
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);

      // Hit-test three points down the element. If something else is returned, the disclosure is
      // covered — the exact defect this suite exists to prevent.
      const covered = await el.evaluate((node: Element) => {
        const rect = node.getBoundingClientRect();
        const offenders: string[] = [];
        for (const fraction of [0.25, 0.5, 0.75]) {
          const x = Math.round(rect.left + Math.min(rect.width / 2, window.innerWidth - 2));
          const y = Math.round(rect.top + rect.height * fraction);
          if (y < 0 || y > window.innerHeight) continue;
          const top = document.elementFromPoint(x, y);
          if (top && !node.contains(top) && top !== node) {
            offenders.push(`${top.tagName}.${(top.className || "").toString().slice(0, 40)}`);
          }
        }
        return offenders;
      });

      expect(covered, `${name} is obscured by: ${covered.join(", ")}`).toEqual([]);
    });

    test(`${name} is no smaller than body text`, async ({ page }) => {
      const el = page.locator(selector).first();
      const { size, bodySize } = await el.evaluate((node: Element) => ({
        size: parseFloat(getComputedStyle(node).fontSize),
        bodySize: parseFloat(getComputedStyle(document.body).fontSize),
      }));

      // A disclosure set smaller than the marketing copy around it reads as a buried disclaimer.
      expect(size, `${name} renders at ${size}px against ${bodySize}px body copy`).toBeGreaterThanOrEqual(bodySize);
    });

    test(`${name} meets WCAG AA contrast`, async ({ page }) => {
      const el = page.locator(selector).first();
      const { fg, bg } = await el.evaluate((node: Element) => {
        const colour = getComputedStyle(node).color;
        let cursor: Element | null = node;
        let background = "rgb(255, 255, 255)";
        while (cursor) {
          const candidate = getComputedStyle(cursor).backgroundColor;
          if (candidate && candidate !== "rgba(0, 0, 0, 0)" && candidate !== "transparent") {
            background = candidate;
            break;
          }
          cursor = cursor.parentElement;
        }
        return { fg: colour, bg: background };
      });

      const ratio = contrastRatio(parseRgb(fg), parseRgb(bg));
      expect(ratio, `${name} contrast is ${ratio.toFixed(2)}:1 (${fg} on ${bg})`).toBeGreaterThanOrEqual(4.5);
    });
  }

  test("the disclosure survives a mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    await dismissConsent(page);

    const bar = page.locator(".notice-bar-inner p").first();
    await expect(bar, "the top notice bar disappears on mobile").toBeVisible();

    const covered = await bar.evaluate((node: Element) => {
      const rect = node.getBoundingClientRect();
      const top = document.elementFromPoint(
        Math.round(rect.left + rect.width / 2),
        Math.round(rect.top + rect.height / 2),
      );
      return top && !node.contains(top) && top !== node ? top.tagName : null;
    });
    expect(covered, "the mobile notice bar is painted over").toBeNull();
  });
});

test.describe("required and forbidden content", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TARGET);
    await dismissConsent(page);
  });

  for (const needle of REQUIRED_TEXT) {
    test(`page states "${needle}"`, async ({ page }) => {
      const body = await page.locator("body").innerText();
      expect(body, `"${needle}" is missing from the rendered page`).toContain(needle);
    });
  }

  for (const needle of FORBIDDEN_TEXT) {
    test(`page does not claim "${needle}"`, async ({ page }) => {
      const body = (await page.locator("body").innerText()).toLowerCase();
      expect(body, `page contains the unsupported claim "${needle}"`).not.toContain(needle);
    });
  }

  test("the CEA verification link is present and points at the public register", async ({ page }) => {
    const link = page.locator('a[href*="cea.gov.sg"]').first();
    await expect(link, "no link to the CEA Public Register").toHaveCount(1);
    const href = await link.getAttribute("href");
    expect(href).toContain("cea.gov.sg");
  });

  test("the page title names the project and carries the CEA registration", async ({ page }) => {
    const title = await page.title();
    expect(title, "title is missing the CEA registration number").toContain("R072094A");
    expect(title, "title is missing the registered name").toContain("Amelia Lek Kai Yi");
    // Google truncates the search headline near 60 characters; the project name must survive.
    expect(title.length, `title is ${title.length} chars and will be truncated`).toBeLessThanOrEqual(60);
  });
});
