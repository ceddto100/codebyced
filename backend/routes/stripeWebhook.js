// /backend/routes/stripeWebhook.js
const express = require("express");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

// Export shape supported by mountStripeWebhook()
module.exports = {
  raw: express.raw({ type: "application/json" }),

  handler: (req, res) => {
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

    // Handle the events you actually care about
    switch (event.type) {
      case "checkout.session.completed": {
        // If you need the line items or subscription ID:
        // const session = event.data.object; // { id, subscription, customer, ... }
        // TODO: mark order paid / provision access / send email
        break;
      }
      case "invoice.paid":
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        // TODO: sync subscription status in your DB
        break;
      }
      default:
        // no-op
        break;
    }

    res.json({ received: true });
  },
};
