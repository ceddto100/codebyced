// /frontend/src/utils/stripeCheckout.js
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const API_BASE = import.meta.env.VITE_API_BASE; // e.g. http://localhost:3001/api

async function post(path, body) {
  const resp = await fetch(`${API_BASE}/stripe/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || "Stripe request failed");
  }
  return resp.json();
}

async function redirectToCheckout(sessionId) {
  const stripe = await stripePromise;
  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) throw error;
}

/** Deposits: percentage of totals (pkg must be 'starter'|'growth'|'pro') */
export async function startDepositCheckout({ context, pkg, email }) {
  const { id } = await post("create-session", {
    planType: "deposit",
    context,
    pkg,
    customerEmail: email || undefined,
  });
  await redirectToCheckout(id);
}

/** One-time flat amounts.
 *  If amountCents is omitted, backend will use pricing[context].fixed[pkg]
 *  Example: { context: 'seo', pkg: 'onPageBundle' }
 */
export async function startOneTimeCheckout({ context, pkg, amountCents, email }) {
  const { id } = await post("create-session", {
    planType: "one_time",
    context,
    pkg,
    amountCents,
    customerEmail: email || undefined,
  });
  await redirectToCheckout(id);
}

/** Subscriptions (monthly). pkg is 'starter'|'growth'|'pro'.
 *  priceId is optional; if omitted, backend looks up pricing[context].subs[pkg]
 */
export async function startSubscriptionCheckout({ context, pkg, priceId, email }) {
  const { id } = await post("create-session", {
    planType: "subscription",
    context,
    pkg,
    priceId,
    customerEmail: email || undefined,
  });
  await redirectToCheckout(id);
}

/** Milestones (midway/final) for deposit projects */
export async function startMilestoneCheckout({ context, pkg, phase, email }) {
  const { id } = await post("create-milestone-session", {
    context,
    pkg,      // 'starter'|'growth'|'pro'
    phase,    // 'midway'|'final'
    customerEmail: email || undefined,
  });
  await redirectToCheckout(id);
}
