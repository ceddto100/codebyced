// /frontend/src/utils/stripeCheckout.js
import { loadStripe } from "@stripe/stripe-js";

const PUBLISHABLE_KEY = import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || "";

// Accept "/api", "https://api.codebyced.com/api", etc.; also support either var name
const RAW_API_BASE =
  import.meta.env?.VITE_API_BASE_URL ||
  import.meta.env?.VITE_API_BASE ||
  "/api";
const API_BASE = RAW_API_BASE.replace(/\/+$/, ""); // strip trailing '/'

let stripePromise = null;
function getStripe() {
  if (!PUBLISHABLE_KEY) {
    console.warn("Missing VITE_STRIPE_PUBLISHABLE_KEY. Set it and redeploy.");
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
    // Remove this if your API doesn't set Access-Control-Allow-Credentials: true
    credentials: "include",
    body: JSON.stringify(body),
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

// NEW: handle either {url} or {id}
async function goToCheckout(result) {
  if (result?.url) {
    window.location.assign(result.url);
    return;
  }
  if (result?.id) {
    await redirectToCheckout(result.id);
    return;
  }
  throw new Error("Checkout response missing url/id.");
}

/** Deposits: percentage of totals (pkg: 'starter'|'growth'|'pro') */
export async function startDepositCheckout({ context, pkg, email }) {
  // Your backend must implement this route.
  const res = await post("create-session", {
    planType: "deposit",
    context,
    pkg,
    customerEmail: email || undefined,
  });
  await goToCheckout(res);
}

/** One-time amounts (or backend fixed amounts per context/pkg) */
export async function startOneTimeCheckout({ context, pkg, amountCents, email, priceId }) {
  // Try your single create endpoint first; if your backend uses split routes, use those instead.
  try {
    const res = await post("create-session", {
      planType: "one_time",
      context,
      pkg,
      amountCents,
      priceId, // optional if backend maps via pricing.js
      customerEmail: email || undefined,
    });
    await goToCheckout(res);
  } catch (e) {
    // Fallback to split route shape if create-session doesn't exist
    const res = await post("checkout/one-time", {
      priceId: priceId, // required for the split-route style
      // successUrl/cancelUrl can be set server-side; omit here
    });
    await goToCheckout(res);
  }
}

/** Subscriptions (monthly). 'pkg' like 'starter'|'growth'|'pro' */
export async function startSubscriptionCheckout({ context, pkg, priceId, email }) {
  try {
    const res = await post("create-session", {
      planType: "subscription",
      context,
      pkg,
      priceId,
      customerEmail: email || undefined,
    });
    await goToCheckout(res);
  } catch (e) {
    const res = await post("checkout/subscription", {
      priceId: priceId, // required for split-route style
    });
    await goToCheckout(res);
  }
}

/** Milestones (midway/final) for deposit projects */
export async function startMilestoneCheckout({ context, pkg, phase, email }) {
  const res = await post("create-milestone-session", {
    context,
    pkg,
    phase, // 'midway' | 'final'
    customerEmail: email || undefined,
  });
  await goToCheckout(res);
}
