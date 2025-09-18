// /backend/config/pricing.js

// Default deposit percentages if a context doesn't override them
export const DEFAULT_DEPOSIT_PCT = {
  starter: 0.30, // 30%
  growth: 0.25, // 25%
  pro: 0.20,    // 20%,
};

// Default milestone split (percent of TOTAL) by tier so deposit + midway + final = 100%
export const DEFAULT_MILESTONE_PCT = {
  starter: { midway: 0.40, final: 0.30 }, // 30% + 40% + 30% = 100%
  growth:  { midway: 0.45, final: 0.30 }, // 25% + 45% + 30% = 100%
  pro:     { midway: 0.50, final: 0.30 }, // 20% + 50% + 30% = 100%
};

// Pricing registry per context
export const pricing = {
  // Conversational AI tools page
  aiconv: {
    totals: { starter: 30000, growth: 90000, pro: 230000 }, // $300, $900, $2300
    depositPct: { starter: 0.30, growth: 0.25, pro: 0.20 },
    milestonePct: DEFAULT_MILESTONE_PCT, // use defaults
    subs: {
      starter: "price_1S8TbkLqm1z2fUKBfAq1tTAk",
      growth: "price_1S8ThgLqm1z2fUKBYF1cQ3Tm",
      pro: "price_1S8TldLqm1z2fUKBBkRfFW4X",
    },
  },

  // App development page
  app: {
    totals: { starter: 75000, growth: 200000, pro: 480000 }, // cents
    depositPct: { starter: 0.30, growth: 0.25, pro: 0.20 },
    milestonePct: DEFAULT_MILESTONE_PCT,
    subs: {
      starter: "price_1S8WPALqm1z2fUKBq38L6RHr",
      growth: "price_1S8WWwLqm1z2fUKBD7qjT1fp",
      pro: "price_1S8WZqLqm1z2fUKBxpjEzWWr",
    },
  },

  // SEO services page
  seo: {
    totals: { starter: 9900, growth: 29900, pro: 69900 }, // cents
    depositPct: { starter: 0.30, growth: 0.25, pro: 0.20 },
    milestonePct: DEFAULT_MILESTONE_PCT,

    // NEW: Flat-rate focused tasks (one-time)
    fixed: {
      onPageBundle: 19900,    // $199
      schemaSetup: 24900,     // $249
      imagePerf: 14900,       // $149
    },

    subs: {
      starter: "price_1S8WmMLqm1z2fUKBBwiucupz",
      growth: "price_1S8WnnLqm1z2fUKBleNPjxCB",
      pro: "price_1S8WptLqm1z2fUKBzlQVbpQV",
    },
  },

  // Technical consulting page — ONE-TIME fees + retainers (subscriptions)
  consulting: {
    // These totals support deposit-based flows for starter/growth/pro (if you use them)
    totals: { starter: 120000, growth: 350000, pro: 800000 }, // cents
    depositPct: { starter: 0.30, growth: 0.25, pro: 0.20 },
    milestonePct: DEFAULT_MILESTONE_PCT,

    // NEW: Fixed one-time amounts for all the card fees on this page
    // Use with planType = "one_time" and pkg = one of these keys
    fixed: {
      // Reviews
      reviewLite: 7900,        // $79 flat
      reviewDeep: 19900,       // $199

      // Architecture
      blueprint: 32500,        // $325
      blueprintPlus: 60000,    // $600

      // DevOps pick-and-play
      gitPr: 12000,            // $120
      dockerize: 18000,        // $180
      cicd: 25000,             // $250
      obs: 15000,              // $150
      devopsBundle: 50000,     // $500

      // Cloud deployment setups
      cloudrun: 20000,         // $200
      render: 18000,           // $180
      fargate: 35000,          // $350
      workers: 18000,          // $180
    },

    // Monthly retainers → subscriptions (use Stripe PRICE IDs here)
    subs: {
      starter: "price_1S8awNLqm1z2fUKBfqyBXUxU", // Essential $89/mo
      growth: "price_1S8ayYLqm1z2fUKBOCHOcxvM",   // Growth $199/mo
      pro: "price_1S8b09Lqm1z2fUKBUlEdtQgm",         // Pro $399/mo
    },
  },

  // Maintenance plans page
  maintenance: {
    totals: { starter: 70000, growth: 200000, pro: 600000 }, // cents
    depositPct: { starter: 0.30, growth: 0.25, pro: 0.20 },
    milestonePct: DEFAULT_MILESTONE_PCT,
    subs: {
      starter: "price_1S8WPALqm1z2fUKBq38L6RHr",
      growth: "price_1S8WWwLqm1z2fUKBD7qjT1fp",
      pro: "price_1S8WZqLqm1z2fUKBxpjEzWWr",
    },
  },

  // Workflow automation page
  automation: {
    totals: { starter: 30000, growth: 80000, pro: 190000 }, // cents
    depositPct: { starter: 0.30, growth: 0.25, pro: 0.20 },
    milestonePct: DEFAULT_MILESTONE_PCT,
    subs: {
      starter: "price_1S8TbkLqm1z2fUKBfAq1tTAk",
      growth: "price_1S8ThgLqm1z2fUKBYF1cQ3Tm",
      pro: "price_1S8TldLqm1z2fUKBBkRfFW4X",
    },
  },
};
