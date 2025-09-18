// /backend/routes/stripeRoutes.js
const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");
const {
  pricing,
  DEFAULT_DEPOSIT_PCT,
  DEFAULT_MILESTONE_PCT,
} = require("../config/pricing.js");

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const toCents = (n) => Math.round(n);

// POST /api/stripe/create-session
router.post("/create-session", async (req, res) => {
  try {
    const {
      planType = "deposit",
      context,
      pkg,
      amountCents,
      priceId,
      customerEmail,
    } = req.body || {};

    const cfg = pricing[context];
    if (!cfg) return res.status(400).json({ error: "Unknown context" });

    let line_items = [];
    let mode = "payment";

    if (planType === "subscription") {
      const price = priceId || cfg.subs?.[pkg];
      if (!price)
        return res.status(400).json({ error: "Missing subscription priceId" });
      mode = "subscription";
      line_items = [{ price, quantity: 1 }];
    } else if (planType === "one_time") {
      const cents =
        typeof amountCents === "number" ? amountCents : cfg.fixed?.[pkg];
      if (!cents)
        return res.status(400).json({ error: "Missing one-time amount" });
      line_items = [
        {
          price_data: {
            currency: "usd",
            unit_amount: toCents(cents),
            product_data: { name: `${context} ${pkg} (One-time)` },
          },
          quantity: 1,
        },
      ];
    } else {
      // deposit
      if (!["starter", "growth", "pro"].includes(pkg))
        return res.status(400).json({ error: "Invalid pkg for deposit" });

      const total = cfg.totals?.[pkg];
      const pct =
        (cfg.depositPct || DEFAULT_DEPOSIT_PCT)[pkg] ||
        DEFAULT_DEPOSIT_PCT[pkg];
      const depositCents = toCents(total * pct);

      line_items = [
        {
          price_data: {
            currency: "usd",
            unit_amount: depositCents,
            product_data: {
              name: `${context} ${pkg} deposit`,
              description: "Non-refundable deposit credited toward final balance.",
            },
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items,
      customer_email: customerEmail || undefined,
      success_url: `${process.env.ALLOWED_ORIGINS?.split(",")[0] || "http://localhost:3000"}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.ALLOWED_ORIGINS?.split(",")[0] || "http://localhost:3000"}/cancelled`,
      metadata: { planType, context, pkg },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create session" });
  }
});

// Milestone payments (midway/final)
router.post("/create-milestone-session", async (req, res) => {
  try {
    const { context, pkg, phase, customerEmail } = req.body || {};
    const cfg = pricing[context];
    if (!cfg) return res.status(400).json({ error: "Unknown context" });

    const total = cfg.totals?.[pkg];
    if (!total) return res.status(400).json({ error: "No total for this tier" });

    const pct = (cfg.milestonePct || DEFAULT_MILESTONE_PCT)[pkg]?.[phase];
    if (!pct) return res.status(400).json({ error: "No milestone percentage" });

    const amount = Math.round(total * pct);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount,
            product_data: { name: `${context} ${pkg} ${phase} payment` },
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail || undefined,
      success_url: `${process.env.ALLOWED_ORIGINS?.split(",")[0] || "http://localhost:3000"}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.ALLOWED_ORIGINS?.split(",")[0] || "http://localhost:3000"}/cancelled`,
      metadata: { planType: "milestone", context, pkg, phase },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create milestone session" });
  }
});

module.exports = router;
