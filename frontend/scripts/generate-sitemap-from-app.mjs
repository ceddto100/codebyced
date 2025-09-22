// /frontend/scripts/generate-sitemap-from-app.mjs
// Reads /frontend/src/App.jsx, extracts <Route path="..."> entries,
// filters redirects (<Navigate ...>), expands optional blog slugs,
// and writes /frontend/public/sitemap.xml

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { SitemapStream, streamToPromise } from "sitemap";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---- CONFIG ----
const SITE_URL = process.env.SITE_URL || "https://codebyced.com"; // no trailing slash
const APP_PATH = resolve(__dirname, "../src/App.jsx");
const OUTPUT_PATH = resolve(__dirname, "../public/sitemap.xml");

// Optional sources to expand dynamic blog posts:
// 1) Local JSON file with array of slugs: ["my-post","another-post"]
const LOCAL_BLOG_SLUGS = resolve(__dirname, "../src/data/blogSlugs.json");
// 2) Or set BLOG_SLUGS_API to a URL that returns the same shape (array of strings)
//    Note: fetch requires Node 18+. If not set, we skip.
const BLOG_SLUGS_API = process.env.BLOG_SLUGS_API || "";

// Hints per path
function routeHints(path) {
  if (path === "/") return { changefreq: "daily", priority: 1.0 };
  if (path.startsWith("/blog")) return { changefreq: "weekly", priority: 0.8 };
  return { changefreq: "monthly", priority: 0.6 };
}

// ---- LOAD APP ----
const appSrc = readFileSync(APP_PATH, "utf8");

// 1) Grab all <Route ... path="..."> occurrences (handles single/double quotes)
const routeRegex = /<Route\s+[^>]*path\s*=\s*["']([^"']+)["'][^>]*>/g;
let m;
const rawPaths = [];
while ((m = routeRegex.exec(appSrc)) !== null) {
  rawPaths.push(m[1]);
}

// 2) Filter out anything whose element is a Navigate (redirects)
const redirectRegex = /<Route\s+[^>]*path\s*=\s*["'][^"']+["'][^>]*element\s*=\s*{?<\s*Navigate\b/;
const lines = appSrc.split(/\n/);

// Build a map path -> isRedirect
const pathIsRedirect = new Map();
for (const line of lines) {
  const pathMatch = line.match(/<Route\s+[^>]*path\s*=\s*["']([^"']+)["']/);
  if (pathMatch) {
    const path = pathMatch[1];
    pathIsRedirect.set(path, redirectRegex.test(line));
  }
}

let paths = rawPaths.filter((p) => !pathIsRedirect.get(p)); // drop redirects

// 3) Handle dynamic params like /blog/:id — keep base /blog but expand real posts if available
const dynamicParamRegex = /:\w+/;
const staticPaths = paths.filter((p) => !dynamicParamRegex.test(p));
const dynamicPaths = paths.filter((p) => dynamicParamRegex.test(p));

let expanded = [...staticPaths];

// Expand blog slugs for any /blog/:id-style routes
async function getBlogSlugs() {
  // Prefer API if defined
  if (BLOG_SLUGS_API) {
    try {
      const res = await fetch(BLOG_SLUGS_API);
      if (res.ok) {
        const arr = await res.json();
        if (Array.isArray(arr)) return arr;
      }
    } catch (_) {}
  }
  // Fallback to local JSON file if present
  if (existsSync(LOCAL_BLOG_SLUGS)) {
    try {
      const data = JSON.parse(readFileSync(LOCAL_BLOG_SLUGS, "utf8"));
      if (Array.isArray(data)) return data;
    } catch (_) {}
  }
  return [];
}

const blogParamRoute = dynamicPaths.find(
  (p) => p.startsWith("/blog/") && dynamicParamRegex.test(p)
);
let blogSlugs = [];
if (blogParamRoute) {
  blogSlugs = await getBlogSlugs();
  if (blogSlugs.length) {
    const base = "/blog";
    const expandedBlogs = blogSlugs.map((slug) => `${base}/${slug}`);
    expanded.push(...expandedBlogs);
  }
}

// Dedupe and sort (optional)
expanded = Array.from(new Set(expanded)).sort();

// 4) Write sitemap.xml
mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
const smStream = new SitemapStream({ hostname: SITE_URL });

for (const urlPath of expanded) {
  const hints = routeHints(urlPath);
  smStream.write({
    url: urlPath,
    changefreq: hints.changefreq,
    priority: hints.priority
  });
}
smStream.end();

const xml = await streamToPromise(smStream).then((d) => d.toString());
writeFileSync(OUTPUT_PATH, xml, "utf8");

console.log(`✅ sitemap.xml written: ${OUTPUT_PATH}`);
console.log(`   Base: ${SITE_URL}`);
console.log(`   Routes: ${expanded.length} (${expanded.join(", ")})`);
