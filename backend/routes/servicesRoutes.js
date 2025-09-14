// backend/routes/servicesRoutes.js
import { Router } from "express";
const router = Router();

// Minimal sample payload (mirror what’s in the page file)
const services = [
  {
    slug: "web-development-maintenance",
    name: "Web Development & Maintenance",
    packages: [
      { tier: "Starter Site", price: "$1,500–$3,500", timeline: "1–2 weeks" },
      { tier: "Growth Site",  price: "$4,000–$9,000",  timeline: "3–6 weeks" },
      { tier: "Pro / Web App", price: "$10,000–$25,000+", timeline: "6–12+ weeks" },
    ],
    maintenance: [
      { name: "Essential", price: "$99/mo", response: "72-hr email" },
      { name: "Growth",    price: "$299/mo", response: "24–48 hr" },
      { name: "Pro",       price: "$799/mo", response: "Same-day (business)" },
    ],
    alacarte: [
      { name: "Quick Fix (≤1 hr, 1 issue)", price: "$150 flat" },
      { name: "Diagnostic & Triage (up to 2 hrs)", price: "$149 (credited if we proceed)" },
      { name: "Optimization Sprint (1 week)", price: "$1,200–$2,400" },
    ],
  },
];

// GET /api/services
router.get("/", (req, res) => {
  res.json({ success: true, data: services });
});

// GET /api/services/:slug
router.get("/:slug", (req, res) => {
  const found = services.find(s => s.slug === req.params.slug);
  if (!found) return res.status(404).json({ success: false, error: "Not found" });
  res.json({ success: true, data: found });
});

export default router;
