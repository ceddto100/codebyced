// Reads your React Router file, extracts <Route path="...">, skips redirects,
// expands optional blog slugs, and writes /frontend/public/sitemap.xml

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { SitemapStream, streamToPromise } from "sitemap";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---- CONFIG ----
const SITE_URL = process.env.SITE_URL || "https://codebyced.com"; // no trailing slash

// Try multiple potential router files and pick the first that exists
const ROUTE_FILE_CANDIDATES = [
  "../src/App.jsx",
  "../src/App.js",
  "../src/app/App.jsx",
  "../src/app/App.js",
  "../src/routes/AppRoutes.jsx",
  "../src/routes/AppRoutes.js"
].map(p => resolve(__dirname, p));

const APP_PATH = ROUTE_FILE_CANDIDATES.find(p => existsSync(p));
if (!APP_PATH) {
  console.error("❌ Could not locate your router file. Looked for:\n" + ROUTE_FILE_CANDIDATES.join("\n"));
  process.exit(1);
}

const OUTPUT_PATH = resolve(__dirname, "../public/sitemap.xml");

// Optional blog slug sources
const LOCAL_BLOG_SLUGS = resolve(__dirname, "../src/data/blogSlugs.json");
const BLOG_SLUGS_API = process.env.BLOG_SLUGS_API || "";

// Hints per path
function routeHints(path) {
  if (path === "/") return { changefreq: "daily", priority: 1.0 };
  if (path.startsWith("/blog")) return { changefreq: "weekly", priority: 0.8 };
  return { changefreq: "monthly", priority: 0.6 };
}

// ---- LOAD ROUTES ----
const appSrc = readFileSync(APP_PATH, "utf8");

// Grab all <Route ... path="..."> (handles single/double quotes)
const routeRegex = /<Route\s+[^>]*path\s*=\s*["']([^"']+)["'][^>]*>/g;
let m;
const rawPaths = [];
while ((m = routeRegex.exec(appSrc)) !== null) rawPaths.push(m[1]);

// Filter out redirects (<Navigate ...>)
const redirectRegex = /<Route\s+[^>]*path\s*=\s*["'][^"']+["'][^>]*element\s*=\s*{?<\s*Navigate\b/;
const lines = appSrc.split(/\n/);
const pathIsRedirect = new Map();
for (const line of lines) {
  const pm = line.match(/<Route\s+[^>]*path\s*=\s*["']([^"']+)["']/);
  if (pm) pathIsRedirect.set(pm[1], redirectRegex.test(line));
}
let paths = rawPaths.filter(p => !pathIsRedirect.get(p));

// Handle dynamic params like /blog/:id — keep base /blog but expand slugs if available
const dynamicParamRegex = /:\w+/;
const staticPaths = paths.filter(p => !dynamicParamRegex.test(p));
const dynamicPaths = paths.filter(p => dynamicParamRegex.test(p));

let expanded = [...staticPaths];

async function getBlogSlugs() {
  if (BLOG_SLUGS_API) {
    try {
      const res = await fetch(BLOG_SLUGS_API);
      if (res.ok) {
        const arr = await res.json();
        if (Array.isArray(arr)) return arr;
      }
    } catch {}
  }
  if (existsSync(LOCAL_BLOG_SLUGS)) {
    try {
      const data = JSON.parse(readFileSync(LOCAL_BLOG_SLUGS, "utf8"));
      if (Array.isArray(data)) return data;
    } catch {}
  }
  return [];
}

const blogParamRoute = dynamicPaths.find(p => p.startsWith("/blog/") && dynamicParamRegex.test(p));
if (blogParamRoute) {
  const slugs = await getBlogSlugs();
  if (slugs.length) {
    expanded.push(...slugs.map(slug => `/blog/${slug}`));
  }
}

// Dedupe & sort
expanded = Array.from(new Set(expanded)).sort();

// Write sitemap.xml
mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
const smStream = new SitemapStream({ hostname: SITE_URL });
for (const urlPath of expanded) {
  const hints = routeHints(urlPath);
  smStream.write({ url: urlPath, changefreq: hints.changefreq, priority: hints.priority });
}
smStream.end();

const xml = await streamToPromise(smStream).then(d => d.toString());
writeFileSync(OUTPUT_PATH, xml, "utf8");

console.log(`✅ sitemap.xml written: ${OUTPUT_PATH}`);
console.log(`   Using routes from: ${APP_PATH}`);
console.log(`   Base: ${SITE_URL}`);
console.log(`   Routes: ${expanded.length} (${expanded.join(", ")})`);

