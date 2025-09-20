// /backend/routes/stripeWebhook.js
const express = require("express");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

// Export shape supported by mountStripeWebhook()
module.exports = {
  raw: express.raw({ type: "application/json" }),

  handler: async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // LIVE whsec_...
    
    if (!endpointSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
      return res.status(400).send("Webhook configuration error");
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`Received event: ${event.type} [${event.id}]`);

    try {
      // Handle the events you care about
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          console.log("Checkout completed:", {
            sessionId: session.id,
            customerId: session.customer,
            subscriptionId: session.subscription,
            mode: session.mode,
            paymentStatus: session.payment_status
          });
          
          // TODO: Mark order as paid, provision access, send confirmation email
          // if (session.mode === "payment") {
          //   // One-time payment completed
          // } else if (session.mode === "subscription") {
          //   // Subscription started
          // }
          break;
        }
        
        case "invoice.paid": {
          const invoice = event.data.object;
          console.log("Invoice paid:", {
            invoiceId: invoice.id,
            customerId: invoice.customer,
            subscriptionId: invoice.subscription,
            amountPaid: invoice.amount_paid
          });
          
          // TODO: Extend subscription access, send receipt
          break;
        }
        
        case "invoice.payment_failed": {
          const invoice = event.data.object;
          console.log("Payment failed:", {
            invoiceId: invoice.id,
            customerId: invoice.customer,
            subscriptionId: invoice.subscription
          });
          
          // TODO: Notify customer, suspend access if needed
          break;
        }
        
        case "customer.subscription.created": {
          const subscription = event.data.object;
          console.log("Subscription created:", {
            subscriptionId: subscription.id,
            customerId: subscription.customer,
            status: subscription.status,
            priceId: subscription.items.data[0]?.price.id
          });
          
          // TODO: Provision access, update database
          break;
        }
        
        case "customer.subscription.updated": {
          const subscription = event.data.object;
          console.log("Subscription updated:", {
            subscriptionId: subscription.id,
            customerId: subscription.customer,
            status: subscription.status,
            priceId: subscription.items.data[0]?.price.id
          });
          
          // TODO: Update access level, sync database
          break;
        }
        
        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          console.log("Subscription cancelled:", {
            subscriptionId: subscription.id,
            customerId: subscription.customer,
            canceledAt: subscription.canceled_at
          });
          
          // TODO: Revoke access, send cancellation confirmation
          break;
        }
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
          break;
      }
      
      res.json({ received: true });
    } catch (err) {
      console.error("Error processing webhook:", err.message);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  },
};
