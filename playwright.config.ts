import { defineConfig } from "@playwright/test";

/**
 * When SITE_URL is set the suite runs against a deployed site, so no local server is needed —
 * and for the Cloudflare adapter no local preview is even possible. Otherwise fall back to the
 * project's own preview server.
 */
const SITE_URL = process.env.SITE_URL;

export default defineConfig({
  testDir: "./tests",
  ...(SITE_URL
    ? {}
    : {
        webServer: {
          command: "npm run preview",
          port: 4321,
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
      }),
  use: {
    baseURL: SITE_URL ?? "http://localhost:4321",
  },
});
