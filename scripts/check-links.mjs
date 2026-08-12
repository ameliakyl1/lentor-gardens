// Crawls the built static output (dist/.vercel/output/static) for internal <a href> links
// and reports any that point to a missing local file. Run `npm run build` first.
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), ".vercel", "output", "static");

async function listHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listHtmlFiles(full)));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const files = await listHtmlFiles(ROOT);
  const brokenLinks = [];

  for (const file of files) {
    const html = await readFile(file, "utf8");
    const matches = html.matchAll(/href="(\/[^"#?]*)"/g);
    for (const match of matches) {
      const href = match[1];
      if (href.startsWith("//") || href.includes(".")) {
        if (!(await exists(path.join(ROOT, href)))) brokenLinks.push({ file, href });
        continue;
      }
      const candidates = [
        path.join(ROOT, href, "index.html"),
        path.join(ROOT, `${href}.html`),
      ];
      const found = await Promise.all(candidates.map(exists));
      if (!found.some(Boolean)) brokenLinks.push({ file, href });
    }
  }

  if (brokenLinks.length > 0) {
    console.error("Broken internal links found:");
    brokenLinks.forEach(({ file, href }) => console.error(`  ${href} (referenced in ${file})`));
    process.exit(1);
  } else {
    console.log(`Checked ${files.length} HTML files — no broken internal links found.`);
  }
}

main();
