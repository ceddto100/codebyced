// /frontend/src/pages/AppSoftwareDevPage.jsx
import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import CalButton from "../components/CalButton";

/**
 * App & Software Development — Static Service Page
 * CTAs use /services/apps&plan=<starter|growth|pro>
 */
const CONTEXT = "app";
const CAL_HANDLE = "cedrick-carter-ndeqh2";
const content = {
  hero: {
    title: "App & Software Development",
    subtitle:
      "Ship MVPs, mobile prototypes, and custom internal tools fast — clean architecture, great UX, and smooth deployments.",
    bullets: [
      "MVP Builds for startups",
      "Mobile App Prototypes (React Native / Flutter-style approach)",
      "Custom Tools & Dashboards (auth, reports)",
      "APIs & Integrations (REST/GraphQL, webhooks)"
    ],
    ctas: [
      { label: "Book a 15-min discovery", useCal: true },
      { label: "See Past Work", to: "/projects", variant: "secondary" }
    ]
  },

  // Packages (budget-friendly)
  packages: [
  {
    tier: "Starter MVP",
    price: "Deposit: (30%) · Full: $750–$1,800",
    timeline: "1–2 weeks",
    badge: "Great for validation",
    items: [
      "3–6 screens, responsive UI",
      "Email/password auth (basic)",
      "CRUD + 1 integration (e.g., email or payments sandbox)",
      "Staging & production deploy + Loom walkthrough",
      "⚡ Only a deposit required to kick off — balance due at delivery"
    ],
    ctaTo: "https://buy.stripe.com/fZufZi4LWeBFbvScIfawo06",
    gradient: "from-blue-600 to-indigo-600"
  },
  {
    tier: "Growth App",
    price: "Deposit: (25%) · Full: $2,000–$4,250",
    timeline: "3–6 weeks",
    badge: "Most popular",
    items: [
      "6–12 screens with design tokens",
      "RBAC (roles/permissions)",
      "2–3 integrations (Stripe, Zapier, SendGrid, Notion, etc.)",
      "Dashboard + reports + basic E2E tests",
      "⚡ Pay a deposit now — finish payment at milestones/delivery"
    ],
    ctaTo: "https://buy.stripe.com/eVqaEY4LW0KPdE0eQnawo05",
    gradient: "from-indigo-600 to-fuchsia-600",
    emphasized: true
  },
  {
    tier: "Pro Product",
    price: "Deposit: (20%) · Full: $4,800–$10,000+",
    timeline: "6–12+ weeks",
    items: [
      "React Native/Expo prototype → TestFlight/Play Internal",
      "Custom API (Node/Express), queues & webhooks",
      "File storage, CI/CD, observability",
      "Admin panel with role-based access",
      "⚡ Start with a deposit — remaining balance tied to project phases"
    ],
    ctaTo: "https://buy.stripe.com/aFaeVefqA1OTeI45fNawo04",
    gradient: "from-emerald-600 to-teal-600"
  }
],


  maintenance: [
    {
      name: "Essential",
      price: "$59/mo",
      response: "72-hr (business)",
      features: [
        "Uptime ping & weekly backups",
        "Monthly dependency review",
        "Security checks/patches",
        "Issue triage email"
      ],
      ctaTo: "/services/apps&plan=essential",
      gradient: "from-sky-600 to-blue-600"
    },
    {
      name: "Growth",
      price: "$149/mo",
      response: "24–48 hr",
      badge: "Most popular",
      features: [
        "Everything in Essential",
        "2h changes/mo (small features, fixes)",
        "Staging & deploy review",
        "Monthly perf/analytics report"
      ],
      // NOTE: "Growth" will render a Stripe Buy Button below.
      ctaTo: "/services/apps&plan=growth-maint",
      gradient: "from-indigo-600 to-violet-600",
      emphasized: true
    },
    {
      name: "Pro",
      price: "$299/mo",
      response: "Same-day (business)",
      features: [
        "Everything in Growth",
        "6h changes/mo + priority queue",
        "Incident response window",
        "Runbook updates & training"
      ],
      ctaTo: "https://buy.stripe.com/aFa4gA0vG5158jG9w3awo00",
      gradient: "from-rose-600 to-pink-600"
    }
  ],

  alacarte: [
    { name: "Quick Fix (≤1 hr, 1 issue)", price: "$90 flat" },
    { name: "Diagnostic & Triage (up to 2 hrs)", price: "$75 (credited if we proceed)" },
    { name: "Feature Sprint (1 week)", price: "$600–$1,200" },
    { name: "App Store Prep (assets, listings, builds)", price: "$200–$450" },
    { name: "Analytics Setup (events, dashboards)", price: "$150–$350" },
    { name: "Deployment Hardening (CI/CD, envs, alerts)", price: "$180–$400" }
  ],

  outcomes: [
    "Ship a clean, modular MVP fast",
    "Validate with real users on real devices",
    "Clear analytics, logging, error tracking",
    "A roadmap and runbook your team owns"
  ],

  useCases: [
    "Customer-facing MVP (web/mobile) with auth & payments",
    "Internal dashboards (ops, finance, marketing) with exports",
    "Partner/API portals with RBAC & audit trails",
    "Field tools: offline-first RN/Expo prototype with sync"
  ],

  process: [
    { name: "Discovery", desc: "Goals, users, success metrics (free; extended $95 if needed)." },
    { name: "Proposal & SOW", desc: "Scope, timeline, price, assumptions, milestones." },
    { name: "Design / Architecture", desc: "Screen map, data model, integrations, component tokens." },
    { name: "Build", desc: "Weekly check-ins; staging links for review; tight feedback loops." },
    { name: "QA & Launch", desc: "Cross-browser/device tests, performance, security basics." },
    { name: "Handoff & Docs", desc: "Runbook, credentials, API docs, Loom training videos." },
    { name: "Maintenance", desc: "Proactive updates & improvements (optional plans)." }
  ],

  slas: [
    "Response time — Essential: 72h, Growth: 24–48h, Pro: same-day (business).",
    "Critical incidents — Pro: start ≤4 business hrs; Growth: ≤8; Essential: best effort.",
    "Uptime monitoring — 24/7 pings with email/Slack alerts."
  ],

  faq: [
    { q: "Can you reuse our backend or data?", a: "Yes—happy to integrate or migrate incrementally." },
    { q: "React Native vs. native?", a: "RN/Expo is great for MVPs: fast iteration and single codebase." },
    { q: "Who owns what?", a: "You own repos, infra, and accounts. I use least-privilege access." },
    { q: "How do you handle scope changes?", a: "Small tweaks included; larger changes get a quick estimate + mini-SOW." },
    { q: "Payment terms?", a: "50% to start, 50% at delivery; milestones for longer projects." }
  ],

  seo: {
    title: "App & Software Development | CodeByCed",
    description:
      "Affordable MVP builds, React Native prototypes, and custom internal tools with auth, reports, and solid deployments. Startup-friendly packages.",
    url: "https://codebyced.com/services/app-development"
  }
};

const variants = {
  fadeInUp: { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } },
  reveal: { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } },
  stagger: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } }
};

const Pill = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/60 text-indigo-200 border border-indigo-700">
    {children}
  </span>
);

const PriceCard = ({ tier, price, timeline, items, badge, ctaTo, gradient, emphasized, highlight }) => (
  <motion.div
    variants={variants.fadeInUp}
    className={`relative overflow-hidden rounded-xl border border-gray-800 backdrop-blur-md bg-gray-900/70 p-6 shadow-md hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 ${
      emphasized ? "ring-1 ring-indigo-500/40" : ""
    } ${highlight ? "outline outline-2 outline-indigo-400/60" : ""}`}
  >
    <div className={`absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-3xl`} />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-semibold text-gray-100">{tier}</h3>
        {badge ? <Pill>{badge}</Pill> : null}
      </div>
      <div className="text-3xl font-bold text-gray-100">{price}</div>
      {timeline && <div className="text-sm text-gray-400 mb-4">Timeline: {timeline}</div>}
      <ul className="space-y-2 mb-5">
        {items.map((it, i) => (
          <li key={i} className="text-gray-300 flex">
            <span className="mr-2 text-blue-400">•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
      <Link
        to={ctaTo}
        className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
      >
        Choose {tier}
        <span className="ml-1">→</span>
      </Link>
    </div>
  </motion.div>
);

const AppSoftwareDevPage = () => {
  // Optional: highlight a card if the route includes &plan=...
  const { plan } = useParams(); // works for route /services/apps&plan=:plan

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "App & Software Development",
      serviceType: "MVP builds, mobile prototypes, custom tools & dashboards",
      provider: { "@type": "Person", name: "Cedrick Carter" },
      areaServed: "US (remote available)",
      offers: [
        { "@type": "Offer", name: "Starter MVP", priceCurrency: "USD", price: "750-1800" },
        { "@type": "Offer", name: "Growth App", priceCurrency: "USD", price: "2000-4250" },
        { "@type": "Offer", name: "Pro Product", priceCurrency: "USD", price: "4800-10000" },
        { "@type": "Offer", name: "Maintenance Essential", priceCurrency: "USD", price: "59" },
        { "@type": "Offer", name: "Maintenance Growth", priceCurrency: "USD", price: "149" },
        { "@type": "Offer", name: "Maintenance Pro", priceCurrency: "USD", price: "299" }
      ],
      url: content.seo.url,
      description: content.seo.description
    }),
    []
  );

  const pickHighlight = (tier) => {
    if (!plan) return false;
    const p = String(plan).toLowerCase();
    if (tier === "Starter MVP") return ["starter"].includes(p);
    if (tier === "Growth App") return ["growth", "growth-maint"].includes(p);
    if (tier === "Pro Product") return ["pro", "pro-maint"].includes(p);
    return false;
  };

  return (
    <PageLayout>
      <Helmet>
        <title>{content.seo.title}</title>
        <meta name="description" content={content.seo.description} />
        <link rel="canonical" href={content.seo.url} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>

        {/* [STRIPE BUY BUTTON] Load once in <head>. Do not duplicate. */}
        <script async src="https://js.stripe.com/v3/buy-button.js" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10 relative">
        {/* subtle background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
        </div>

        {/* Hero */}
        <motion.section
          variants={variants.reveal}
          initial="hidden"
          animate="visible"
          className="mb-10 backdrop-blur-sm bg-gray-900/80 p-8 rounded-xl border border-gray-800 shadow-lg relative overflow-hidden"
        >
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-3">
              {content.hero.title}
            </h1>
            <p className="text-gray-300 mb-6">{content.hero.subtitle}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              {content.hero.ctas.map((c) =>
                c.useCal ? (
                  <CalButton
                    key={c.label}
                    handle={CAL_HANDLE}
                    event="secret"
                    label={c.label}
                    className="bg-blue-700 hover:bg-blue-600 hover:shadow-cyan-900/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg"
                  />
                ) : (
                  <Link
                    key={c.label}
                    to={c.to}
                    className={
                      c.variant === "secondary"
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-100 px-5 py-2.5 rounded-lg border border-gray-700 transition-all duration-300"
                        : "bg-blue-700 hover:bg-blue-600 hover:shadow-cyan-900/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg"
                    }
                  >
                    {c.label}
                  </Link>
                )
              )}
            </div>

            <ul className="grid md:grid-cols-2 gap-2">
              {content.hero.bullets.map((b, i) => (
                <li key={i} className="text-gray-300 flex">
                  <span className="mr-2 text-indigo-400">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Outcomes */}
        <section className="mb-12">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Outcomes You Get</h2>
            <div className="absolute bottom-0 left-0 w-28 h-1 bg-emerald-500 rounded-full"></div>
          </div>
          <ul className="grid md:grid-cols-2 gap-4">
            {content.outcomes.map((o, i) => (
              <li key={i} className="backdrop-blur-sm bg-gray-900/70 border border-gray-800 rounded-xl p-5 text-gray-300">
                {o}
              </li>
            ))}
          </ul>
        </section>

        {/* Packages */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Project Packages</h2>
            <div className="absolute bottom-0 left-0 w-24 h-1 bg-blue-500 rounded-full"></div>
          </div>
          <motion.div variants={variants.stagger} initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-6">
            {content.packages.map((p) => (
              <PriceCard key={p.tier} {...p} highlight={pickHighlight(p.tier)} />
            ))}
          </motion.div>
          <p className="text-sm text-gray-400 mt-3">
            Hourly for extras/overages: <span className="font-medium text-gray-300">$35–$55/hr</span> (pre-approved).
            Payment terms: 50% to start, 50% at delivery (milestones for longer projects).
          </p>
        </section>

        {/* À-la-carte */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">À-la-carte / One-off Work</h2>
            <div className="absolute bottom-0 left-0 w-32 h-1 bg-cyan-500 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {content.alacarte.map((a) => (
              <div key={a.name} className="backdrop-blur-sm bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                <div className="text-gray-100 font-semibold">{a.name}</div>
                <div className="text-gray-300 mt-2">{a.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Maintenance */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Maintenance & Support (Month-to-Month)</h2>
            <div className="absolute bottom-0 left-0 w-28 h-1 bg-fuchsia-500 rounded-full"></div>
          </div>
          <motion.div variants={variants.stagger} initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-6">
            {content.maintenance.map((m) => (
              <motion.div
                key={m.name}
                variants={variants.fadeInUp}
                className={`relative overflow-hidden rounded-xl border border-gray-800 backdrop-blur-md bg-gray-900/70 p-6 shadow-md hover:shadow-xl transition ${
                  m.emphasized ? "ring-1 ring-indigo-500/40" : ""
                }`}
              >
                <div className={`absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br ${m.gradient} opacity-20 rounded-full blur-3xl`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-100">{m.name}</h3>
                    {m.badge ? <Pill>{m.badge}</Pill> : null}
                  </div>
                  <div className="text-3xl font-bold text-gray-100">{m.price}</div>
                  <div className="text-sm text-gray-400 mb-4">Response: {m.response}</div>
                  <ul className="space-y-2 mb-5">
                    {m.features.map((f, i) => (
                      <li key={i} className="text-gray-300 flex">
                        <span className="mr-2 text-blue-400">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

{/* [STRIPE BUY BUTTONS] Replace CTA with embedded buttons where provided */}
{m.name === "Pro" ? (
  <div className="mt-2">
    <stripe-buy-button
      buy-button-id="buy_btn_1S9vqeL0N7h4wfoOMB7Obd44"
      publishable-key="pk_live_51S8EMLL0N7h4wfoOGx5JZIgDmgzeR49PKYbtDKfN7eCbAf94R9wSWmYS4drYMLaBVUnAYJRvqHJFp68HgGqEcXu700mfwIlTg8"
    ></stripe-buy-button>
  </div>
) : m.name === "Growth" ? (
  <div className="mt-2">
    <stripe-buy-button
      buy-button-id="buy_btn_1S9vulL0N7h4wfoORXYydrNC"
      publishable-key="pk_live_51S8EMLL0N7h4wfoOGx5JZIgDmgzeR49PKYbtDKfN7eCbAf94R9wSWmYS4drYMLaBVUnAYJRvqHJFp68HgGqEcXu700mfwIlTg8"
    ></stripe-buy-button>
  </div>
) : m.name === "Essential" ? (
  <div className="mt-2">
    <stripe-buy-button
      buy-button-id="buy_btn_1S9vqeL0N7h4wfoOMB7Obd44"
      publishable-key="pk_live_51S8EMLL0N7h4wfoOGx5JZIgDmgzeR49PKYbtDKfN7eCbAf94R9wSWmYS4drYMLaBVUnAYJRvqHJFp68HgGqEcXu700mfwIlTg8"
    ></stripe-buy-button>
  </div>
) : (
  <Link
    to={m.ctaTo}
    className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
  >
    Choose {m.name}
    <span className="ml-1">→</span>
  </Link>
)}

                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Use cases */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Typical Use Cases</h2>
            <div className="absolute bottom-0 left-0 w-24 h-1 bg-emerald-500 rounded-full"></div>
          </div>
          <ul className="grid md:grid-cols-2 gap-4">
            {content.useCases.map((u, i) => (
              <li key={i} className="backdrop-blur-sm bg-gray-900/70 border border-gray-800 rounded-xl p-5 text-gray-300">
                {u}
              </li>
            ))}
          </ul>
        </section>

        {/* Process */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Process</h2>
            <div className="absolute bottom-0 left-0 w-20 h-1 bg-blue-500 rounded-full"></div>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200/20 via-blue-300/30 to-blue-200/20" />
            <div className="space-y-6">
              {content.process.map((step, idx) => (
                <div key={step.name} className="relative pl-10">
                  <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-white/10 border border-blue-500/40 flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  </div>
                  <div className="backdrop-blur-sm bg-gray-900/70 border border-gray-800 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-100 font-semibold">
                        {idx + 1}. {step.name}
                      </h3>
                    </div>
                    <p className="text-gray-300 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLAs */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">SLAs & Terms</h2>
            <div className="absolute bottom-0 left-0 w-16 h-1 bg-cyan-500 rounded-full"></div>
          </div>
          <ul className="grid md:grid-cols-3 gap-4">
            {content.slas.map((s, i) => (
              <li key={i} className="backdrop-blur-sm bg-gray-900/70 border border-gray-800 rounded-xl p-5 text-gray-300">
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          <div className="absolute bottom-0 left-0 w-14 h-1 bg-indigo-500 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {content.faq.map((f) => (
              <div key={f.q} className="backdrop-blur-sm bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                <h3 className="text-gray-100 font-semibold">{f.q}</h3>
                <p className="text-gray-300 mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-6 text-center">
          <div className="inline-flex items-center gap-3">
            <CalButton
              handle={CAL_HANDLE}
              event="secret"
              label="Book a 15-min Discovery"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
              metadata={{ page: "app-development", section: "bottom-cta" }}
            />
            <Link
              to="/services/apps"
              className="px-5 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 hover:bg-gray-700 transition"
            >
              Talk through scope
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AppSoftwareDevPage;

