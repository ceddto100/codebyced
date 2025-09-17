// frontend/src/pages/WorkflowAutomationPage.jsx
import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import CalButton from "../components/CalButton";

/**
 * Workflow & Automation — Static Service Page
 * Pricing is the 50%-reduced budget version you approved.
 * CTAs use: /services/automation&plan=<starter|growth|pro>
 */
const CAL_HANDLE = "cedrick-carter-ndeqh2";
const content = {
  hero: {
    title: "Workflow & Automation",
    subtitle:
      "Save hours every week and remove manual errors. I design reliable automations, custom APIs, and data pipelines using Make.com, Zapier, n8n, and Python.",
    bullets: [
      "Business Process Automation (Make.com, Zapier, n8n)",
      "Custom API Development (REST/GraphQL)",
      "Web Scraping & Data Pipelines (Python)",
      "CRM Integrations (HubSpot, Salesforce, custom DBs)",
    ],
    ctas: [
      { label: "Automate My Workflow", to: "/services/automation&plan=growth" },
      { label: "Book a 15-min Discovery", variant: "secondary", useCal: true },
    ],
  },

  outcomes: [
    "Hours back each week; fewer manual errors",
    "Faster lead response and deal flow",
    "Clean, centralized data ready for reporting",
    "Lower tooling costs by removing glue work",
  ],

  // 50% reduced pricing
  packages: [
    {
      tier: "Starter Automation",
      price: "$450–$900",
      timeline: "3–7 days",
      badge: "Great for one workflow",
      items: [
        "Up to 2 tools, 1 trigger, 3–5 steps",
        "Implemented scenario/automation",
        "Basic error handling + retries",
        "Loom walkthrough",
      ],
      ctaTo: "/services/automation&plan=starter",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      tier: "Growth Automation",
      price: "$1,250–$2,750",
      timeline: "2–4 weeks",
      badge: "Most popular",
      items: [
        "4–6 tools, 2–3 workflows, branching",
        "Staging + production, runbook",
        "Basic data model + analytics touchpoints",
        "Two-week hypercare included",
      ],
      ctaTo: "/services/automation&plan=growth",
      gradient: "from-indigo-600 to-fuchsia-600",
      emphasized: true,
    },
    {
      tier: "Pro / Automation System",
      price: "$3,000–$7,500+",
      timeline: "4–10+ weeks",
      items: [
        "10+ tools, authenticated API(s)",
        "Queueing, dashboards, alerts",
        "Test suite + observability",
        "Team training + handoff",
      ],
      ctaTo: "/services/automation&plan=pro",
      gradient: "from-emerald-600 to-teal-600",
    },
  ],

  maintenance: [
    {
      name: "Essential",
      price: "$79/mo",
      response: "72-hr (business)",
      features: [
        "24/7 run + webhook monitoring",
        "Monthly dependency/app review",
        "1h support/changes",
        "Incident email notifications",
      ],
      gradient: "from-sky-600 to-blue-600",
      ctaTo: "/services/automation&plan=essential",
    },
    {
      name: "Growth",
      price: "$199/mo",
      response: "24–48 hr",
      badge: "Most popular",
      features: [
        "Everything in Essential",
        "3h support/changes",
        "Staging + deploy review",
        "Incident log + RCA notes",
      ],
      gradient: "from-indigo-600 to-violet-600",
      emphasized: true,
      ctaTo: "/services/automation&plan=growth-maint",
    },
    {
      name: "Pro",
      price: "$449/mo",
      response: "Same-day (business)",
      features: [
        "Everything in Growth",
        "8h support/changes",
        "Priority queue + on-call window",
        "Runbook updates",
      ],
      gradient: "from-rose-600 to-pink-600",
      ctaTo: "/services/automation&plan=pro-maint",
    },
  ],

  alacarte: [
    { name: "Diagnostic & Triage (up to 2h)", price: "$75 (credited if we proceed)" },
    { name: "Quick Fix (≤1h, one issue)", price: "$90 flat" },
    { name: "Scraper Setup (simple site)", price: "$225–$450" },
    { name: "Custom Endpoint (typical)", price: "$150–$300 per endpoint" },
    { name: "ETL to Sheets/DB/Warehouse", price: "$300–$1,000" },
  ],

  useCases: [
    "Lead intake → enrichment → CRM → Slack/email → reporting",
    "Abandoned-cart winbacks: Stripe/Shopify → email/SMS → CRM notes",
    "Finance ops: paid invoice → ledger update → docs → Slack + reconciliation",
    "Data: scheduled scrape → clean/dedupe → BigQuery/Postgres → dashboard",
    "Support: form/chat → ticket → SLA timer → triage channel → survey",
  ],

  process: [
    { name: "Discovery", desc: "Goals, systems, success metrics (free consult)." },
    { name: "Scope & Proposal", desc: "Diagram, fixed price or not-to-exceed, timeline." },
    { name: "Build", desc: "Weekly check-ins; staging first, then production." },
    { name: "QA & Launch", desc: "Failure tests, retries, idempotency, observability." },
    { name: "Handoff", desc: "Loom videos, runbook, credentials rotation." },
    { name: "Hypercare", desc: "1–2 weeks included for Growth/Pro packages." },
  ],

  slas: [
    "Essential: 72-hr response | Growth: 24–48 hr | Pro: same-day (business).",
    "24/7 checks on scheduled runs and webhooks, alerts to email/Slack.",
    "Overages billed at $50–$65/hr or rolled into a mini-sprint.",
  ],

  faq: [
    {
      q: "Can you work with our tools?",
      a: "Yes—HubSpot, Salesforce, Airtable, Notion, Google Sheets, Slack, Stripe, and more.",
    },
    {
      q: "Who owns the accounts?",
      a: "You do. I request least-privilege access; everything runs in your org.",
    },
    {
      q: "What if a vendor changes their API?",
      a: "Covered if you’re on a maintenance plan; otherwise it’s estimated as a small change.",
    },
    {
      q: "Fixed price or hourly?",
      a: "Fixed for clear scope (see packages) or not-to-exceed caps with weekly reporting.",
    },
    {
      q: "Training provided?",
      a: "Yes—handoff call plus Loom walkthroughs. Live training available on request.",
    },
  ],

  seo: {
    title: "Workflow & Automation | CodeByCed",
    description:
      "Affordable business process automation, custom APIs, web scraping, data pipelines, and CRM integrations. Make.com, Zapier, n8n, Python.",
    url: "https://codebyced.com/services/workflow-automation",
  },
};

const variants = {
  fadeInUp: { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } },
  reveal: { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } },
  stagger: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } },
};

const Pill = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/60 text-indigo-200 border border-indigo-700">
    {children}
  </span>
);

const PriceCard = ({ tier, price, timeline, items, badge, ctaTo, gradient, emphasized }) => (
  <motion.div
    variants={variants.fadeInUp}
    className={`relative overflow-hidden rounded-xl border border-gray-800 backdrop-blur-md bg-gray-900/70 p-6 shadow-md hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 ${
      emphasized ? "ring-1 ring-indigo-500/40" : ""
    }`}
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

const WorkflowAutomationPage = () => {
  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Workflow & Automation",
      serviceType: "Business process automation, custom APIs, data pipelines, CRM integrations",
      provider: { "@type": "Person", name: "Cedrick Carter" },
      areaServed: "US (remote available)",
      offers: [
        { "@type": "Offer", name: "Starter Automation", priceCurrency: "USD", price: "450-900" },
        { "@type": "Offer", name: "Growth Automation",  priceCurrency: "USD", price: "1250-2750" },
        { "@type": "Offer", name: "Pro / Automation System", priceCurrency: "USD", price: "3000-7500" },
        { "@type": "Offer", name: "Maintenance Essential", priceCurrency: "USD", price: "79" },
        { "@type": "Offer", name: "Maintenance Growth",   priceCurrency: "USD", price: "199" },
        { "@type": "Offer", name: "Maintenance Pro",       priceCurrency: "USD", price: "449" },
      ],
      url: content.seo.url,
      description: content.seo.description,
    }),
    []
  );

  return (
    <PageLayout>
      <Helmet>
        <title>{content.seo.title}</title>
        <meta name="description" content={content.seo.description} />
        <link rel="canonical" href={content.seo.url} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10 relative">
        {/* background decorations */}
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
        event="secret"            // ← replace with your Cal event slug if not "secret"
        label={c.label}
        className={
          // style it however you want; this matches your primary button style
          "bg-blue-700 hover:bg-blue-600 hover:shadow-cyan-900/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg"
        }
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
              <PriceCard key={p.tier} {...p} />
            ))}
          </motion.div>
          <p className="text-sm text-gray-400 mt-3">
            Hourly for extras/overages: <span className="font-medium text-gray-300">$50–$65/hr</span> (pre-approved). Payment terms: 50% deposit, 50% at delivery (milestones for longer projects).
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
                className={`relative overflow-hidden rounded-xl border border-gray-800 backdrop-blur-md bg-gray-900/70 p-6 shadow-md hover:shadow-xl transition ${m.emphasized ? "ring-1 ring-indigo-500/40" : ""}`}
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
                  <Link
                    to={m.ctaTo}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
                  >
                    Choose {m.name}
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <p className="text-sm text-gray-400 mt-3">
            Extra hours billed at your plan’s effective rate or rolled into a mini-sprint.
          </p>
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
            <Link
              to="/services/automation&plan=growth"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
            >
              Automate My Workflow
            </Link>
            <CalButton
              handle={CAL_HANDLE}
              event="secret"
              label="Book a 15-min Discovery"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
              metadata={{ page: "workflow-automation", section: "bottom-cta" }}
            />
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default WorkflowAutomationPage;
