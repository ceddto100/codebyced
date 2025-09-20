// /backend/routes/stripeRoutes.js
const express = require("express");
const Stripe = require("stripe");
const { pricing } = require("../config/pricing");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

// Helper: default redirect URLs if caller doesn't send them
function defaultUrls() {
  const origin = process.env.FRONTEND_PUBLIC_ORIGIN || "https://codebyced.com";
  return {
    successUrl: `${origin}/success`,
    cancelUrl: `${origin}/pricing`,
  };
}

/**
 * POST /api/stripe/checkout/one-time
 * body: { priceId, successUrl?, cancelUrl? }
 * Uses LIVE price IDs directly from your pricing config
 */
router.post("/checkout/one-time", async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    const urls = defaultUrls();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ 
        price: priceId, 
        quantity: 1 
      }],
      success_url: successUrl || urls.successUrl,
      cancel_url: cancelUrl || urls.cancelUrl,
      allow_promotion_codes: true,
      customer_creation: "always",
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("One-time checkout error:", err.message);
    return res.status(500).json({ error: "Failed to create one-time session" });
  }
});

/**
 * POST /api/stripe/checkout/subscription
 * body: { priceId, successUrl?, cancelUrl? }
 * Uses LIVE price IDs directly from your pricing config
 */
router.post("/checkout/subscription", async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    const urls = defaultUrls();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ 
        price: priceId, 
        quantity: 1 
      }],
      success_url: successUrl || urls.successUrl,
      cancel_url: cancelUrl || urls.cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_creation: "always",
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Subscription checkout error:", err.message);
    return res.status(500).json({ error: "Failed to create subscription session" });
  }
});

/**
 * POST /api/stripe/customer-portal
 * body: { customerId }
 * For managing subscriptions
 */
router.post("/customer-portal", async (req, res) => {
  try {
    const { customerId } = req.body;
    if (!customerId) {
      return res.status(400).json({ error: "Missing customerId" });
    }

    const origin = process.env.FRONTEND_PUBLIC_ORIGIN || "https://codebyced.com";
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/account`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Customer portal error:", err.message);
    return res.status(500).json({ error: "Failed to create portal session" });
  }
});

module.exports = router;
