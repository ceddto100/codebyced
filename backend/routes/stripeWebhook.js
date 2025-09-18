// /backend/routes/stripeWebhook.js
const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Export an array: [express.raw middleware, handler]
// This is why app.js mounts it like: app.post("/api/stripe/webhook", ...stripeWebhook)
module.exports = [
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle event types you care about
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("Checkout completed:", session.metadata);
        break;
      }
      case "invoice.paid": {
        console.log("Invoice paid:", event.data.object.id);
        break;
      }
      case "customer.subscription.deleted": {
        console.log("Subscription cancelled:", event.data.object.id);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  },
];
