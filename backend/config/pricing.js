// /backend/config/pricing.js  (CommonJS)

// Default deposit percentages if a context doesn't override them
const DEFAULT_DEPOSIT_PCT = {
  starter: 0.30, // 30%
  growth: 0.25,  // 25%
  pro: 0.20,     // 20%
};

// Default milestone split (percent of TOTAL) by tier so deposit + midway + final = 100%
const DEFAULT_MILESTONE_PCT = {
  starter: { midway: 0.40, final: 0.30 }, // 30% + 40% + 30% = 100%
  growth:  { midway: 0.45, final: 0.30 }, // 25% + 45% + 30% = 100%
  pro:     { midway: 0.50, final: 0.30 }, // 20% + 50% + 30% = 100%
};

// Pricing registry per context (amounts in cents)
const pricing = {
  // Conversational AI tools page
  aiconv: {
    totals: { starter: 30000, growth: 90000, pro: 230000 }, // $300, $900, $2,300
    depositPct: { starter: 0.30, growth: 0.25, pro: 0.20 },
    milestonePct: DEFAULT_MILESTONE_PCT,
    subs: {
      starter: "price_1S8pzyL0N7h4wfoOB79X7w0U",
      growth:  "price_1S8q1ML0N7h4wfoOcWtKvb3w",
      pro:     "price_1S8q3mL0N7h4wfoOX0DYLXRC",
    },
  },

  // App development page (maps from “Maintenance & support”)
  app: {
    totals: { starter: 75000, growth: 200000, pro: 480000 },
    depositPct: { starter: 0.30, growth: 0.25, pro: 0.20 },
    milestonePct: DEFAULT_MILESTONE_PCT,
    subs: {
      starter: "price_1S8qAeL0N7h4wfoOUJubfWoo",
      growth:  "price_1S8qCWL0N7h4wfoOoBj5navv",
      pro:     "price_1S8qEjL0N7h4wfoOfes9Ifuc",
    },
  },

  // SEO services page
  seo: {
    totals: { starter: 9900, growth: 29900, pro: 69900 },
    depositPct: { starter: 0.30, growth: 0.25, pro: 0.20 },
    milestonePct: DEFAULT_MILESTONE_PCT,

    // Flat one-time tasks
    fixed: {
      onPageBundle: 19900, // $199
      schemaSetup:  24900, // $249
      imagePerf:    14900, // $149
    },

    subs: {
      starter: "price_1S8pr8L0N7h4wfoOZFMmGYqP",
      growth:  "price_1S8pt7L0N7h4wfoOJSu5FlHZ",
      pro:     "price_1S8ptyL0N7h4wfoOd9CYqbuA",
    },
  },

  // Technical consulting page — one-time fees + retainers
  consulting: {
    totals: { starter: 120000, growth: 350000, pro: 800000 },
    depositPct: { starter: 0.30, growth: 0.25, pro: 0.20 },
    milestonePct: DEFAULT_MILESTONE_PCT,

    fixed: {
      // Reviews
      reviewLite:     7900,  // $79
      reviewDeep:    19900,  // $199
      // Architecture
      blueprint:     32500,  // $325
      blueprintPlus: 60000,  // $600
      // DevOps pick-and-play
      gitPr:         12000,  // $120
      dockerize:     18000,  // $180
      cicd:          25000,  // $250
      obs:           15000,  // $150
      devopsBundle:  50000,  // $500
      // Cloud deployment setups
      cloudrun:      20000,  // $200
      render:        18000,  // $180
      fargate:       35000,  // $350
      workers:       18000,  // $180
    },

    // Monthly retainers (Stripe Price IDs)
    subs: {
      starter: "price_1S8pZYL0N7h4wfoOzE0cO15v", // Essential $89/mo
      growth:  "price_1S8pbBL0N7h4wfoOK2qu8Y1g", // Growth $199/mo
      pro:     "price_1S8pcDL0N7h4wfoO2UDEWE8n", // Pro $399/mo
    },
  },

  // Maintenance plans page
  maintenance: {
    totals: { starter: 70000, growth: 200000, pro: 600000 },
    depositPct: { starter: 0.30, growth: 0.25, pro: 0.20 },
    milestonePct: DEFAULT_MILESTONE_PCT,
    subs: {
      starter: "price_1S8pjyL0N7h4wfoOPIYVVfLw",
      growth:  "price_1S8pl8L0N7h4wfoONdDz50CR",
      pro:     "price_1S8pmFL0N7h4wfoO4uznwYse",
    },
  },

  // Workflow automation page
  automation: {
    totals: { starter: 30000, growth: 80000, pro: 190000 },
    depositPct: { starter: 0.30, growth: 0.25, pro: 0.20 },
    milestonePct: DEFAULT_MILESTONE_PCT,
    subs: {
      starter: "price_1S8pfCL0N7h4wfoOKRqcSRwN",
      growth:  "price_1S8pgKL0N7h4wfoO1p7Z6f3C",
      pro:     "price_1S8phUL0N7h4wfoO3WYjimL5",
    },
  },
};

module.exports = {
  DEFAULT_DEPOSIT_PCT,
  DEFAULT_MILESTONE_PCT,
  pricing,
};
