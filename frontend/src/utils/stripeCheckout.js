// /frontend/src/utils/stripeCheckout.js
import { loadStripe } from "@stripe/stripe-js";

// Get publishable key from env (Vite uses VITE_ prefix)
const PUBLISHABLE_KEY = import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || "";

// API base URL - should end with /api
const RAW_API_BASE =
  import.meta.env?.VITE_API_BASE_URL ||
  import.meta.env?.VITE_API_BASE ||
  "/api";
const API_BASE = RAW_API_BASE.replace(/\/+$/, ""); // strip trailing '/'

console.log("Stripe Config:", { 
  hasKey: !!PUBLISHABLE_KEY, 
  apiBase: API_BASE,
  keyPrefix: PUBLISHABLE_KEY.slice(0, 8) + "..." 
});

let stripePromise = null;
function getStripe() {
  if (!PUBLISHABLE_KEY) {
    console.warn("Missing VITE_STRIPE_PUBLISHABLE_KEY. Set it and redeploy.");
    throw new Error("Stripe is not configured - missing publishable key");
  }
  if (!stripePromise) {
    stripePromise = loadStripe(PUBLISHABLE_KEY);
  }
  return stripePromise;
}

// Helper to make POST requests to our backend
async function post(path, body) {
  const url = `${API_BASE}/stripe/${path}`;
  console.log("Making Stripe request to:", url, body);
  
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Only if your backend sets CORS credentials: true
    body: JSON.stringify(body),
  });
  
  if (!resp.ok) {
    const text = await resp.text();
    console.error("Stripe API error:", { status: resp.status, response: text });
    throw new Error(text || `Stripe request failed: ${resp.status}`);
  }
  
  const result = await resp.json();
  console.log("Stripe response:", result);
  return result;
}

// Helper to redirect to checkout
async function goToCheckout(result) {
  if (result?.url) {
    console.log("Redirecting to checkout:", result.url);
    window.location.assign(result.url);
    return;
  }
  throw new Error("Checkout response missing URL");
}

// Mapping from your pricing config to actual LIVE price IDs
const PRICE_ID_MAP = {
  // Consulting one-time services (these would need custom price creation or use amount)
  consulting: {
    fixed: {
      reviewLite: null,     // $79 - you'll need to create a price for this
      reviewDeep: null,     // $199 - you'll need to create a price for this  
      blueprint: null,      // $325 - you'll need to create a price for this
      blueprintPlus: null,  // $600 - you'll need to create a price for this
      gitPr: null,          // $120 - you'll need to create a price for this
      dockerize: null,      // $180 - you'll need to create a price for this
      cicd: null,           // $250 - you'll need to create a price for this
      obs: null,            // $150 - you'll need to create a price for this
      devopsBundle: null,   // $500 - you'll need to create a price for this
      cloudrun: null,       // $200 - you'll need to create a price for this
      render: null,         // $180 - you'll need to create a price for this
      fargate: null,        // $350 - you'll need to create a price for this
      workers: null,        // $180 - you'll need to create a price for this
    },
    subs: {
      starter: "price_1S8pZYL0N7h4wfoOzE0cO15v", // Essential $89/mo
      growth: "price_1S8pbBL0N7h4wfoOK2qu8Y1g",  // Growth $199/mo  
      pro: "price_1S8pcDL0N7h4wfoO2UDEWE8n",     // Pro $399/mo
    },
  },
  maintenance: {
    subs: {
      starter: "price_1S8pjyL0N7h4wfoOPIYVVfLw",
      growth: "price_1S8pl8L0N7h4wfoONdDz50CR", 
      pro: "price_1S8pmFL0N7h4wfoO4uznwYse",
    },
  },
};

/**
 * Start one-time checkout
 * @param {Object} params
 * @param {string} params.context - 'consulting', 'maintenance', etc.
 * @param {string} params.pkg - package name like 'reviewLite', 'blueprint', etc.
 * @param {string} params.priceId - direct price ID (optional, overrides context/pkg lookup)
 * @param {number} params.amountCents - amount in cents (for custom amounts)
 */
export async function startOneTimeCheckout({ context, pkg, priceId, amountCents }) {
  try {
    // If direct priceId provided, use it
    if (priceId) {
      const res = await post("checkout/one-time", { priceId });
      await goToCheckout(res);
      return;
    }

    // Look up price ID from context/pkg
    const contextPrices = PRICE_ID_MAP[context];
    if (!contextPrices) {
      throw new Error(`Unknown context: ${context}`);
    }

    const lookupPriceId = contextPrices.fixed?.[pkg];
    if (lookupPriceId) {
      const res = await post("checkout/one-time", { priceId: lookupPriceId });
      await goToCheckout(res);
      return;
    }

    // For consulting one-time items without pre-created prices, 
    // you'll need to either:
    // 1. Create Stripe prices for each service, OR
    // 2. Use a backend endpoint that creates checkout sessions with custom amounts
    
    // For now, throw an error to indicate missing price setup
    throw new Error(`No price ID found for ${context}.${pkg}. Please create a Stripe price or use amountCents parameter.`);
    
  } catch (error) {
    console.error("One-time checkout failed:", error);
    throw error;
  }
}

/**
 * Start subscription checkout
 * @param {Object} params  
 * @param {string} params.context - 'consulting', 'maintenance', etc.
 * @param {string} params.pkg - 'starter', 'growth', 'pro'
 * @param {string} params.priceId - direct price ID (optional, overrides context/pkg lookup)
 */
export async function startSubscriptionCheckout({ context, pkg, priceId }) {
  try {
    // If direct priceId provided, use it
    if (priceId) {
      const res = await post("checkout/subscription", { priceId });
      await goToCheckout(res);
      return;
    }

    // Look up price ID from context/pkg
    const contextPrices = PRICE_ID_MAP[context];
    if (!contextPrices) {
      throw new Error(`Unknown context: ${context}`);
    }

    const lookupPriceId = contextPrices.subs?.[pkg];
    if (!lookupPriceId) {
      throw new Error(`No subscription price found for ${context}.${pkg}`);
    }

    const res = await post("checkout/subscription", { priceId: lookupPriceId });
    await goToCheckout(res);
    
  } catch (error) {
    console.error("Subscription checkout failed:", error);
    throw error;
  }
}

/**
 * Legacy functions for compatibility (if used elsewhere)
 */
export async function startDepositCheckout({ context, pkg, email }) {
  console.warn("startDepositCheckout not implemented - use startOneTimeCheckout instead");
  throw new Error("Deposit checkout not implemented");
}

export async function startMilestoneCheckout({ context, pkg, phase, email }) {
  console.warn("startMilestoneCheckout not implemented - use startOneTimeCheckout instead"); 
  throw new Error("Milestone checkout not implemented");
}
