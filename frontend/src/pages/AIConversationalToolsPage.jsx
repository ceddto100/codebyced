import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";

/**
 * AI & Conversational Tools — Static Service Page
 * Budget-friendly pricing. CTAs use /services/ai&plan=<tier>.
 */

const content = {
  hero: {
    title: "AI & Conversational Tools",
    subtitle:
      "Launch brand-safe assistants and content systems: chatbots, voice, RAG knowledge bots with citations, predictive models, and production-ready workflows.",
    bullets: [
      "Conversational AI Setup (chatbots, voice assistants)",
      "AI-Powered Content Generation (posts, ads, blogs)",
      "Predictive Models (analytics, forecasting)",
      "Knowledge Base Bots (PDF ingestion + QA assistant)",
    ],
    ctas: [
      { label: "Set up my AI assistant", to: "/services/ai&plan=growth" },
      { label: "Book a 15-min discovery", to: "/services/ai", variant: "secondary" },
    ],
  },

  outcomes: [
    "24/7 responses with brand-safe answers",
    "Lower support volume through accurate deflection",
    "Faster content production with consistent tone",
    "Searchable institutional knowledge with citations",
    "Practical analytics that drive decisions",
  ],

  // Budget pricing you approved
  packages: [
    {
      tier: "Starter Bot",
      price: "$600–$1,200",
      timeline: "1–2 weeks",
      badge: "Great for one channel",
      items: [
        "1 channel (web or Slack)",
        "1 knowledge base (~≤50 pages/PDFs)",
        "Brand prompts + guardrails",
        "Basic analytics + Loom walkthrough",
      ],
      ctaTo: "/services/ai&plan=starter",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      tier: "Growth Assistant",
      price: "$1,800–$3,500",
      timeline: "2–4 weeks",
      badge: "Most popular",
      items: [
        "Multi-channel (2–3)",
        "RAG over ~200 docs with citations",
        "Action tools (tickets, CRM notes)",
        "Analytics dashboard + 2-week hypercare",
      ],
      ctaTo: "/services/ai&plan=growth",
      gradient: "from-indigo-600 to-fuchsia-600",
      emphasized: true,
    },
    {
      tier: "Pro Conversational Platform",
      price: "$4,500–$9,500+",
      timeline: "4–8+ weeks",
      items: [
        "3–5 tools (CRM, ticketing, email/SMS)",
        "Vector DB + role-based access",
        "Voice IVR/assistant + custom tools",
        "Tests, evals, observability, training",
      ],
      ctaTo: "/services/ai&plan=pro",
      gradient: "from-emerald-600 to-teal-600",
    },
  ],

  maintenance: [
    {
      name: "Essential",
      price: "$99/mo",
      response: "72-hr (business)",
      features: [
        "Prompt/KB tweaks (0.5h/mo)",
        "Monthly model & dependency review",
        "Error/latency monitoring",
        "Incident email notifications",
      ],
      gradient: "from-sky-600 to-blue-600",
      ctaTo: "/services/ai&plan=essential",
    },
    {
      name: "Growth",
      price: "$249/mo",
      response: "24–48 hr",
      badge: "Most popular",
      features: [
        "Everything in Essential",
        "2h changes/mo (new intents, doc refresh)",
        "A/B prompt experiments + eval reports",
        "Incident notes",
      ],
      gradient: "from-indigo-600 to-violet-600",
      emphasized: true,
      ctaTo: "/services/ai&plan=growth-maint",
    },
    {
      name: "Pro",
      price: "$499/mo",
      response: "Same-day (business)",
      features: [
        "Everything in Growth",
        "6h changes/mo (tools/workflows)",
        "Priority queue + on-call window",
        "Runbook updates",
      ],
      gradient: "from-rose-600 to-pink-600",
      ctaTo: "/services/ai&plan=pro-maint",
    },
  ],

  alacarte: [
    { name: "Discovery & Fit Check (≤90 min)", price: "$95" },
    { name: "Prompt/Guardrail Tune-up (≤2h)", price: "$180" },
    { name: "RAG Setup (simple corpus)", price: "$400–$900" },
    { name: "Voice Assistant Add-on (web/phone)", price: "$600–$1,200" },
    { name: "Predictive Model Mini (baseline)", price: "$600–$1,200" },
    { name: "Content Template Pack (5–8)", price: "$250–$500" },
    { name: "Eval Harness & Safety Tests", price: "$350–$900" },
  ],

  useCases: [
    "Support bot with citations + ticket deflection",
    "Website concierge: FAQ + lead capture + scheduling",
    "Sales assistant: lead research, email drafts, CRM notes",
    "Internal docs copilot: SOPs/Notion/Confluence with page links",
    "Voice receptionist: route calls, collect details, create tickets",
    "Forecasting: churn/propensity, simple demand predictions",
  ],

  process: [
    { name: "Discovery", desc: "Goals, channels, guardrails, success metrics (free or $95 extended)." },
    { name: "Scope & Proposal", desc: "Diagram, timeline, fixed price or not-to-exceed cap." },
    { name: "Build", desc: "Ingestion/RAG, prompts/tools, channels; weekly check-ins." },
    { name: "QA & Evals", desc: "Safety tests, citation checks, fallback behavior." },
    { name: "Launch", desc: "Staging → production checklist, observability wired up." },
    { name: "Handoff", desc: "Runbook, Loom videos, admin training." },
    { name: "Hypercare", desc: "1–2 weeks for Growth/Pro packages." },
  ],

  slas: [
    "Essential: 72-hr response | Growth: 24–48 hr | Pro: same-day (business).",
    "24/7 checks on requests & webhooks; alerts to email/Slack.",
    "Overages billed at $60–$85/hr or rolled into a mini-sprint.",
  ],

  faq: [
    { q: "Use our brand voice?", a: "Yes—style prompts + guardrails + examples." },
    { q: "Integrate with our stack?", a: "Yes—HubSpot, Salesforce, Zendesk, Slack, Notion, Google Workspace, custom APIs." },
    { q: "Who owns accounts?", a: "You do. I use least-privilege access; everything runs under your org." },
    { q: "Prevent hallucinations?", a: "RAG with citations, retrieval filters, refusal patterns, evals, and fallbacks." },
    { q: "Fixed price or hourly?", a: "Fixed for clear scope; otherwise not-to-exceed with weekly reporting." },
    { q: "Voice calls supported?", a: "Yes—phone or web, with routing and ticket creation." },
  ],

  seo: {
    title: "AI & Conversational Tools | CodeByCed",
    description:
      "Affordable chatbots, voice assistants, AI content, RAG knowledge bots with citations, and lightweight predictive models. Startup-friendly packages.",
    url: "https://codebyced.com/services/ai-conversational-tools",
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

const AIConversationalToolsPage = () => {
  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "AI & Conversational Tools",
      serviceType: "Conversational AI, AI content, RAG knowledge bots, predictive models",
      provider: { "@type": "Person", name: "Cedrick Carter" },
      areaServed: "US (remote available)",
      offers: [
        { "@type": "Offer", name: "Starter Bot", priceCurrency: "USD", price: "600-1200" },
        { "@type": "Offer", name: "Growth Assistant", priceCurrency: "USD", price: "1800-3500" },
        { "@type": "Offer", name: "Pro Conversational Platform", priceCurrency: "USD", price: "4500-9500" },
        { "@type": "Offer", name: "Maintenance Essential", priceCurrency: "USD", price: "99" },
        { "@type": "Offer", name: "Maintenance Growth", priceCurrency: "USD", price: "249" },
        { "@type": "Offer", name: "Maintenance Pro", priceCurrency: "USD", price: "499" },
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
              {content.hero.ctas.map((c) => (
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
              ))}
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
            Hourly for extras/overages: <span className="font-medium text-gray-300">$60–$85/hr</span> (pre-approved). Payment terms: 50% deposit, 50% at delivery (milestones for longer projects).
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
              to="/services/ai&plan=growth"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
            >
              Set up my AI assistant
            </Link>
            <Link
              to="/services/ai"
              className="px-5 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 hover:bg-gray-700 transition"
            >
              Book a 15-min discovery
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AIConversationalToolsPage;
