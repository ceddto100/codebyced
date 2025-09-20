// /backend/routes/stripeRoutes.js
const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();

// IMPORTANT: pricing.js must be CommonJS or this require will fail.
// If your pricing.js is ESM, either convert it to CJS or convert this file to ESM.
const {
  pricing,
  DEFAULT_DEPOSIT_PCT,
  DEFAULT_MILESTONE_PCT,
} = require("../config/pricing");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

/* ---------------------- helpers ---------------------- */
const cents = (n) => Math.round(Number(n));

const normalizeTier = (pkg) => {
  const key = String(pkg || "").toLowerCase();
  // Allow either naming scheme; map Essential -> starter
  if (key === "essential") return "starter";
  return key;
};

const pickFrontendBase = (req) => {
  const env = process.env.ALLOWED_ORIGINS || "";
  const list = env.split(",").map((s) => s.trim()).filter(Boolean);
  const origin = req.headers.origin;
  if (origin && list.includes(origin)) return origin;
  if (process.env.FRONTEND_PUBLIC_URL) return process.env.FRONTEND_PUBLIC_URL;
  return list[0] || "http://localhost:3000";
};

/* ------------------ create-session ------------------- */
// POST /api/stripe/create-session
router.post("/create-session", async (req, res) => {
  try {
    let {
      planType = "deposit", // "deposit" | "one_time" | "subscription"
      context = "default",
      pkg,
      amountCents,
      priceId,
      customerEmail,
    } = req.body || {};

    pkg = normalizeTier(pkg);

    const cfg = pricing[context] || pricing.default;
    if (!cfg) return res.status(400).json({ error: "Unknown context" });

    let line_items = [];
    let mode = "payment";

    if (planType === "subscription") {
      const price = priceId || cfg.subs?.[pkg];
      if (!price) return res.status(400).json({ error: "Missing subscription priceId" });
      mode = "subscription";
      line_items = [{ price, quantity: 1 }];

    } else if (planType === "one_time") {
      const amount = typeof amountCents === "number" ? amountCents : cfg.fixed?.[pkg];
      if (!amount) return res.status(400).json({ error: "Missing one-time amount" });
      if (amount < 50) return res.status(400).json({ error: "Amount must be >= 50 cents" });

      line_items = [{
        price_data: {
          currency: "usd",
          unit_amount: cents(amount),
          product_data: { name: `${context} ${pkg} (One-time)` },
        },
        quantity: 1,
      }];

    } else {
      // deposit
      const total = cfg.totals?.[pkg];
      if (!total) return res.status(400).json({ error: "No total for this tier" });

      const pct = (cfg.depositPct?.[pkg] ?? DEFAULT_DEPOSIT_PCT?.[pkg]);
      if (!pct) return res.status(400).json({ error: "No deposit percentage for this tier" });

      const deposit = cents(total * pct);
      if (deposit < 50) return res.status(400).json({ error: "Deposit must be >= 50 cents" });

      line_items = [{
        price_data: {
          currency: "usd",
          unit_amount: deposit,
          product_data: {
            name: `${context} ${pkg} deposit`,
            description: "Non-refundable deposit credited toward final balance.",
          },
        },
        quantity: 1,
      }];
    }

    const base = pickFrontendBase(req);

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items,
      customer_email: customerEmail || undefined,
      success_url: `${base}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/cancelled`,
      metadata: { planType, context, pkg },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("create-session error:", err);
    res.status(500).json({ error: "Unable to create session" });
  }
});

/* --------------- create-milestone-session ------------ */
// POST /api/stripe/create-milestone-session
router.post("/create-milestone-session", async (req, res) => {
  try {
    let { context = "default", pkg, phase, customerEmail } = req.body || {};
    pkg = normalizeTier(pkg);

    const cfg = pricing[context] || pricing.default;
    if (!cfg) return res.status(400).json({ error: "Unknown context" });

    const total = cfg.totals?.[pkg];
    if (!total) return res.status(400).json({ error: "No total for this tier" });

    const pct =
      cfg.milestonePct?.[pkg]?.[phase] ??
      DEFAULT_MILESTONE_PCT?.[pkg]?.[phase];

    if (!pct) return res.status(400).json({ error: "No milestone percentage" });

    const amount = cents(total * pct);
    if (amount < 50) return res.status(400).json({ error: "Amount must be >= 50 cents" });

    const base = pickFrontendBase(req);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: { name: `${context} ${pkg} ${phase} payment` },
        },
        quantity: 1,
      }],
      customer_email: customerEmail || undefined,
      success_url: `${base}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/cancelled`,
      metadata: { planType: "milestone", context, pkg, phase },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("create-milestone-session error:", err);
    res.status(500).json({ error: "Unable to create milestone session" });
  }
});

module.exports = router;
