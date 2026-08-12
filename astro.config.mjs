import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

// Update `site` to the production domain before deploying (used for canonical URLs, sitemap, OG tags).
// output: "hybrid" pre-renders every page (fast, crawlable, static-by-default) except
// src/pages/api/enquiry.ts, which opts into on-demand rendering via `export const prerender = false`
// so it can run server-side validation and lead delivery as a Cloudflare Pages Function.
export default defineConfig({
  site: "https://example-new-launch.pages.dev",
  integrations: [sitemap()],
  output: "hybrid",
  adapter: cloudflare({ imageService: "compile" }),
  build: {
    inlineStylesheets: "auto",
  },
});
