// /frontend/src/utils/stripeCheckout.js
import { loadStripe } from "@stripe/stripe-js";

const PUBLISHABLE_KEY = import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || "";
// Accept "/api" or "http://localhost:3001/api" and strip trailing slash
const RAW_API_BASE = import.meta.env?.VITE_API_BASE || "/api";
const API_BASE = RAW_API_BASE.replace(/\/+$/, ""); // no trailing '/'

let stripePromise = null;
function getStripe() {
  if (!PUBLISHABLE_KEY) {
    console.warn("Missing VITE_STRIPE_PUBLISHABLE_KEY. Set it in frontend .env and redeploy.");
    return null;
  }
  if (!stripePromise) stripePromise = loadStripe(PUBLISHABLE_KEY);
  return stripePromise;
}

async function post(path, body) {
  const url = `${API_BASE}/stripe/${path}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include", // optional if you need cookies
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `Stripe request failed: ${resp.status}`);
  }
  return resp.json();
}

async function redirectToCheckout(sessionId) {
  const stripe = await getStripe();
  if (!stripe) throw new Error("Stripe is not configured.");
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

/** One-time amounts (or backend fixed amounts per context/pkg) */
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

/** Subscriptions (monthly). 'pkg' like 'starter'|'growth'|'pro' */
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
    pkg,
    phase, // 'midway' | 'final'
    customerEmail: email || undefined,
  });
  await redirectToCheckout(id);
}

