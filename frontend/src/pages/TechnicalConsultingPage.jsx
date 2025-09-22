// /frontend/src/pages/TechnicalConsultingPage.jsx
import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import PageLayout from "../components/PageLayout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CalButton from "../components/CalButton";

/**
 * Technical Consulting — Static Service Page
 * All non-subscription CTAs link out (ctaHref or ctaTo).
 * Month-to-month subscriptions keep embedded Stripe Buy Buttons.
 */
const CAL_HANDLE = "cedrick-carter-ndeqh2";

// Map retainer plan → Stripe Buy Button ID you provided (unchanged)
const BUY_BUTTONS = {
  Essential: "buy_btn_1SA1amL0N7h4wfoOwOS5ms4p",
  Growth: "buy_btn_1SA1cBL0N7h4wfoO6HavkWo2",
  Pro: "buy_btn_1SA1e3L0N7h4wfoOjSXF6vCj",
};

// Your live publishable key (used only by Buy Button)
const STRIPE_PUBLISHABLE_KEY =
  "pk_live_51S8EMLL0N7h4wfoOGx5JZIgDmgzeR49PKYbtDKfN7eCbAf94R9wSWmYS4drYMLaBVUnAYJRvqHJFp68HgGqEcXu700mfwIlTg8";

// ---------- CONTENT (added ctaHref consistently for one-time) ----------
const content = {
  hero: {
    title: "Technical Consulting",
    subtitle:
      "Tighten code quality, architecture, CI/CD, and cloud delivery. I apply pragmatic practices (clean code reviews, DORA metrics, DevOps) so you ship faster and safer.",
    ctas: [
      { label: "Book a Consult", cal: true },
      
    ],
    bullets: [
      "Code Reviews & Best Practices",
      "Project Architecture & Scalability",
      "DevOps Support (Git, Docker, CI/CD)",
      "Cloud Deployment (Cloud Run, Render, AWS, Cloudflare)",
    ],
  },

  // ONE-TIME (each has external CTA)
  reviews: [
    {
      tier: "Code Review Lite",
      price: "$79 flat",
      timeline: "≤1 PR / ≤500 LOC",
      items: [
        "Written notes with clear, actionable findings",
        "Best-practice checklist tailored to your stack",
        "Focus: design, tests, readability, maintainability",
      ],
      // CHANGED: use external checkout
      ctaHref: "https://buy.stripe.com/5kQ8wQbakctx57u5fNawo0v",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      tier: "Deep Review",
      price: "$199",
      timeline: "up to 4 hrs",
      badge: "Most popular",
      items: [
        "Multiple PRs or one critical module",
        "Recorded walkthrough + action plan",
        "Follow-up Q&A async",
      ],
      // CHANGED: use external checkout
      ctaHref: "https://buy.stripe.com/aFaaEY6U46598jG6jRawo0w",
      gradient: "from-indigo-600 to-fuchsia-600",
      emphasized: true,
    },
  ],

  // ONE-TIME (each has external CTA)
  architecture: [
    {
      tier: "Architecture Blueprint",
      price: "$325",
      timeline: "1 day",
      items: [
        "System diagram & boundaries",
        "Scaling/caching plan & risks",
        "Backlog of next steps",
      ],
      // CHANGED: use external checkout
      ctaHref: "https://buy.stripe.com/9B614o5Q0bptbvS7nVawo0x",
      gradient: "from-emerald-600 to-teal-600",
    },
    {
      tier: "Blueprint+",
      price: "$600",
      timeline: "2–3 days",
      items: [
        "Capacity estimates & failure modes",
        "Observability plan (logs/metrics)",
        "Rollout strategy",
      ],
      // CHANGED: use external checkout
      ctaHref: "https://buy.stripe.com/4gMcN65Q02SXdE04bJawo0y",
      gradient: "from-teal-600 to-cyan-600",
      emphasized: true,
    },
  ],

  // ONE-TIME (chip cards). If you later get Stripe links, drop them into ctaHref.
  devops: [
    { name: "Git & PR Workflow", price: "$120", desc: "Branch model, PR templates, protection rules", pkg: "gitPr", ctaTo: "https://buy.stripe.com/aFa3cwdisdxB8jG4bJawo0z" },
    { name: "Dockerize App", price: "$180", desc: "Dev & prod images, compose file", pkg: "dockerize", ctaTo: "https://buy.stripe.com/4gM28sbak3X11Vi23Bawo0A" },
    { name: "CI/CD Pipeline", price: "$250", desc: "Tests, build, deploy (GH Actions/GitLab/etc.)", pkg: "cicd", ctaTo: "https://buy.stripe.com/8x2eVe0vGdxB8jG23Bawo0B" },
    { name: "Observability Starter", price: "$150", desc: "Basic logs/alerts + runbook", pkg: "obs", ctaTo: "https://buy.stripe.com/5kQbJ2ceo9hl7fC37Fawo0C" },
    { name: "DevOps Starter Bundle", price: "$500", desc: "Git/PR + Docker + CI/CD + Observability", pkg: "devopsBundle", ctaTo: "https://buy.stripe.com/fZu5kE4LWeBF57uaA7awo0D", highlight: true },
  ],

  // ONE-TIME (chip cards)
  cloud: [
    { name: "Google Cloud Run", price: "$200", desc: "Containerize, service, domain/SSL, rollout", pkg: "cloudrun", gradient: "from-sky-600 to-blue-600", ctaTo: "https://buy.stripe.com/8x2fZidis2SX6by6jRawo0H" },
    { name: "Render", price: "$180", desc: "PaaS deploy, autoscaling config (per plan)", pkg: "render", gradient: "from-indigo-600 to-violet-600", ctaTo: "https://buy.stripe.com/bJecN6a6g9hl57u23Bawo0I" },
    { name: "AWS Fargate (ECS)", price: "$350", desc: "Task/service, IAM, rollout", pkg: "fargate", gradient: "from-amber-600 to-orange-600", ctaTo: "https://buy.stripe.com/14A5kEdisalparOeQnawo0J" },
    { name: "Cloudflare Workers", price: "$180", desc: "Edge function, routing, KV if needed", pkg: "workers", gradient: "from-rose-600 to-pink-600", ctaTo: "https://buy.stripe.com/5kQ00k4LW79dbvS7nVawo0K" },
  ],

  // Retainers (month-to-month) — keep Stripe Buy Buttons
  retainers: [
    {
      name: "Essential",
      price: "$89/mo",
      response: "72-hr business",
      features: [
        "2 hrs consulting/month",
        "Light triage & async support",
        "Monthly dependency review",
      ],
      pkg: "starter",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      name: "Growth",
      price: "$199/mo",
      response: "24–48 hr",
      badge: "Most popular",
      features: [
        "5 hrs consulting/month",
        "Roadmap nudges & check-ins",
        "Perf/quality monthly report",
      ],
      pkg: "growth",
      gradient: "from-indigo-600 to-fuchsia-600",
      emphasized: true,
    },
    {
      name: "Pro",
      price: "$399/mo",
      response: "Same-day (business)",
      features: [
        "12 hrs consulting/month",
        "Priority queue & incident help",
        "Runbook updates & training",
      ],
      pkg: "pro",
      gradient: "from-emerald-600 to-teal-600",
    },
  ],

  notes: [
    "Overages billed at $60/hr (rounded to 30 min).",
    "Project work typically 50% to start, 50% on delivery.",
  ],

  process: [
    { name: "Discovery", desc: "Goals, constraints, success metrics (free; extended $95 if needed)." },
    { name: "SOW & Quote", desc: "Scope, timeline, outcomes, clear pricing." },
    { name: "Working Sprint(s)", desc: "Async work + weekly touchpoints; tight feedback loops." },
    { name: "Demo & Handoff", desc: "Docs, runbooks, recordings, next steps." },
    { name: "Measure & Iterate", desc: "Optional retainer to improve DORA metrics." },
  ],

  slas: [
    "Response — Essential: 72h, Growth: 24–48h, Pro: same-day (business).",
    "Incidents — Pro start ≤4 business hrs; Growth ≤8; Essential best effort.",
    "Comms — Slack/email + weekly sync when active; change windows agreed.",
  ],

  faq: [
    { q: "How do payments work?", a: "We scope via a quick call, then send a proposal. One-time items are invoiced; retainers are monthly. You can manage billing via email link or portal." },
    { q: "Do you sign NDAs?", a: "Yes—happy to sign a mutual NDA before reviewing repositories or cloud resources." },
    { q: "Which stacks do you support?", a: "React/Vite, Node/Express, MongoDB/Postgres, Docker, GitHub Actions, GCP Cloud Run, Render, AWS (ECS/Fargate), Cloudflare Workers." },
  ],

  seo: {
    title: "Technical Consulting | CodeByCed",
    description:
      "Affordable code reviews, architecture & scalability guidance, DevOps (Git, Docker, CI/CD), and cloud deployments (Cloud Run, Render, AWS, Cloudflare).",
    url: "https://codebyced.com/services/technical-consulting",
  },
};

// ---- Motion variants
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

// ---------- CARDS (now support ctaHref OR ctaTo) ----------
const CTAButton = ({ ctaHref, ctaTo, label }) => {
  if (ctaHref) {
    return (
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
      >
        {label ?? "Choose"} <span className="ml-1">→</span>
      </a>
    );
  }
  if (ctaTo) {
    return (
      <Link
        to={ctaTo}
        className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
      >
        {label ?? "Choose"} <span className="ml-1">→</span>
      </Link>
    );
  }
  return null;
};

// Generic card for one-time packages
const PriceCard = ({ tier, price, timeline, items, badge, gradient, emphasized, ctaHref, ctaTo }) => (
  <motion.div
    variants={variants.fadeInUp}
    className={`relative overflow-hidden rounded-xl border border-gray-800 backdrop-blur-md bg-gray-900/70 p-6 shadow-md hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 ${
      emphasized ? "ring-1 ring-indigo-500/40" : ""
    }`}
  >
    <div className={`absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br ${gradient ?? ""} opacity-20 rounded-full blur-3xl`} />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-semibold text-gray-100">{tier}</h3>
        {badge ? <Pill>{badge}</Pill> : null}
      </div>
      <div className="text-3xl font-bold text-gray-100">{price}</div>
      {timeline && <div className="text-sm text-gray-400 mb-4">Timeline: {timeline}</div>}
      <ul className="space-y-2 mb-5">
        {(items ?? []).map((it, i) => (
          <li key={i} className="text-gray-300 flex">
            <span className="mr-2 text-blue-400">•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
      {/* CHANGED: unified CTA */}
      <CTAButton ctaHref={ctaHref} ctaTo={ctaTo} label={`Choose ${tier}`} />
    </div>
  </motion.div>
);

// Small chip-style card for à la carte items
const ChipCard = ({ name, price, desc, gradient, ctaHref, ctaTo, highlight }) => (
  <div
    className={`relative overflow-hidden rounded-xl border border-gray-800 backdrop-blur-md bg-gray-900/70 p-6 ${
      highlight ? "ring-1 ring-indigo-500/40" : ""
    }`}
  >
    {gradient ? (
      <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-3xl`} />
    ) : null}
    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <h3 className="text-gray-100 font-semibold">{name}</h3>
        <div className="text-gray-300">{price}</div>
      </div>
      {desc && <p className="text-gray-400 mt-1">{desc}</p>}
      {/* CHANGED: unified CTA */}
      <div className="mt-4">
        <CTAButton ctaHref={ctaHref} ctaTo={ctaTo} label={`Choose ${name}`} />
      </div>
    </div>
  </div>
);

// Retainer card with embedded Stripe Buy Button (unchanged behavior)
const RetainerCard = ({ name, price, response, features, gradient, emphasized, badge, buyButtonId }) => (
  <motion.div
    variants={variants.fadeInUp}
    className={`relative overflow-hidden rounded-xl border border-gray-800 backdrop-blur-md bg-gray-900/70 p-6 shadow-md hover:shadow-xl transition ${
      emphasized ? "ring-1 ring-indigo-500/40" : ""
    }`}
  >
    <div className={`absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-3xl`} />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-semibold text-gray-100">{name}</h3>
        {badge ? <Pill>{badge}</Pill> : null}
      </div>
      <div className="text-3xl font-bold text-gray-100">{price}</div>
      <div className="text-sm text-gray-400 mb-4">Response: {response}</div>
      <ul className="space-y-2 mb-5">
        {features.map((f, i) => (
          <li key={i} className="text-gray-300 flex">
            <span className="mr-2 text-blue-400">•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* KEEP: Embedded Stripe Buy Button for month-to-month */}
      {buyButtonId ? (
        <div className="mt-1">
          <stripe-buy-button
            buy-button-id={buyButtonId}
            publishable-key={STRIPE_PUBLISHABLE_KEY}
          ></stripe-buy-button>
        </div>
      ) : null}
    </div>
  </motion.div>
);

const TechnicalConsultingPage = () => {
  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Technical Consulting",
      serviceType: "Code reviews, architecture & scalability, DevOps, cloud deployment",
      provider: { "@type": "Person", name: "Cedrick Carter" },
      areaServed: "US (remote available)",
      url: content.seo.url,
      description: content.seo.description,
      offers: [
        { "@type": "Offer", name: "Code Review Lite", priceCurrency: "USD", price: "79" },
        { "@type": "Offer", name: "Deep Review", priceCurrency: "USD", price: "199" },
        { "@type": "Offer", name: "Architecture Blueprint", priceCurrency: "USD", price: "325" },
        { "@type": "Offer", name: "Blueprint+", priceCurrency: "USD", price: "600" },
        { "@type": "Offer", name: "DevOps Starter Bundle", priceCurrency: "USD", price: "500" },
        { "@type": "Offer", name: "Cloud Run Deploy", priceCurrency: "USD", price: "200" },
        { "@type": "Offer", name: "Render Deploy", priceCurrency: "USD", price: "180" },
        { "@type": "Offer", name: "AWS Fargate Deploy", priceCurrency: "USD", price: "350" },
        { "@type": "Offer", name: "Cloudflare Workers Deploy", priceCurrency: "USD", price: "180" },
        { "@type": "Offer", name: "Essential Retainer", priceCurrency: "USD", price: "89" },
        { "@type": "Offer", name: "Growth Retainer", priceCurrency: "USD", price: "199" },
        { "@type": "Offer", name: "Pro Retainer", priceCurrency: "USD", price: "399" },
      ],
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
        {/* Load Stripe Buy Button script once in <head> */}
        <script async src="https://js.stripe.com/v3/buy-button.js" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10 relative">
        {/* background blobs */}
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
                c.cal ? (
                  <CalButton
                    key={c.label}
                    handle={CAL_HANDLE}
                    event="secret"
                    label={c.label}
                    className="bg-blue-700 hover:bg-blue-600 hover:shadow-cyan-900/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg"
                    metadata={{ page: "technical-consulting", section: "hero" }}
                  />
                ) : (
                  <Link
                    key={c.label}
                    to={c.to}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-100 px-5 py-2.5 rounded-lg border border-gray-700 transition-all duration-300"
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

        {/* Reviews (one-time) */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Code Reviews & Best Practices</h2>
            <div className="absolute bottom-0 left-0 w-28 h-1 bg-blue-500 rounded-full" />
          </div>
          <motion.div variants={variants.stagger} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-6">
            {content.reviews.map((p) => (
              <PriceCard
                key={p.tier}
                {...p}
                // CHANGED: pass through external CTA
                ctaHref={p.ctaHref}
                ctaTo={p.ctaTo}
              />
            ))}
          </motion.div>
        </section>

        {/* Architecture (one-time) */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Project Architecture & Scalability</h2>
            <div className="absolute bottom-0 left-0 w-28 h-1 bg-emerald-500 rounded-full" />
          </div>
          <motion.div variants={variants.stagger} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-6">
            {content.architecture.map((p) => (
              <PriceCard
                key={p.tier}
                {...p}
                // CHANGED: pass through external CTA
                ctaHref={p.ctaHref}
                ctaTo={p.ctaTo}
              />
            ))}
          </motion.div>
        </section>

        {/* DevOps pick-and-play (one-time) */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">DevOps Support (Pick & Play)</h2>
            <div className="absolute bottom-0 left-0 w-28 h-1 bg-cyan-500 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.devops.map((d) => (
              <ChipCard
                key={d.name}
                name={d.name}
                price={d.price}
                desc={d.desc}
                gradient={d.gradient}
                // CHANGED: CTA link (external if provided, else internal)
                ctaHref={d.ctaHref}
                ctaTo={d.ctaTo}
                highlight={d.highlight}
              />
            ))}
          </div>
        </section>

        {/* Cloud deployment (one-time) */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Cloud Deployment (One-time Setup)</h2>
            <div className="absolute bottom-0 left-0 w-28 h-1 bg-fuchsia-500 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.cloud.map((c) => (
              <ChipCard
                key={c.name}
                name={c.name}
                price={c.price}
                desc={c.desc}
                gradient={c.gradient}
                // CHANGED: CTA link (external if provided, else internal)
                ctaHref={c.ctaHref}
                ctaTo={c.ctaTo}
              />
            ))}
          </div>
        </section>

        {/* Retainers with Stripe Buy Buttons (unchanged) */}
        <section className="mb-4">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Retainers (Month-to-Month)</h2>
            <div className="absolute bottom-0 left-0 w-28 h-1 bg-violet-500 rounded-full" />
          </div>
          <motion.div variants={variants.stagger} initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-6">
            {content.retainers.map((m) => (
              <RetainerCard
                key={m.name}
                name={m.name}
                price={m.price}
                response={m.response}
                features={m.features}
                gradient={m.gradient}
                emphasized={m.emphasized}
                badge={m.badge}
                buyButtonId={BUY_BUTTONS[m.name]}
              />
            ))}
          </motion.div>
          <ul className="text-sm text-gray-400 mt-3 space-y-1">
            {content.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </section>

        {/* Process */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Process</h2>
            <div className="absolute bottom-0 left-0 w-20 h-1 bg-blue-500 rounded-full" />
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
            <div className="absolute bottom-0 left-0 w-16 h-1 bg-emerald-500 rounded-full" />
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
        {Array.isArray(content.faq) && content.faq.length > 0 && (
          <section className="mb-12">
            <div className="relative pb-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
              <div className="absolute bottom-0 left-0 w-14 h-1 bg-indigo-500 rounded-full" />
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
        )}

        {/* CTA */}
        <section className="mb-6 text-center">
          <div className="inline-flex items-center gap-3">
            <CalButton
              handle={CAL_HANDLE}
              event="secret"
              label="Book a Consult"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
              metadata={{ page: "technical-consulting", section: "bottom-cta" }}
            />
         
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default TechnicalConsultingPage;

