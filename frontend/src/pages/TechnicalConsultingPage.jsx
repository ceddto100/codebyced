import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import CalButton from "../components/CalButton";
/**
 * Technical Consulting — Static Service Page
 * CTAs use /contact?service=consulting&plan=<essential|growth|pro|...>
 * Highlights a card when URL has ?plan=<value>
 */
const CAL_HANDLE = "cedrick-carter-ndeqh2";
const content = {
  hero: {
    title: "Technical Consulting",
    subtitle:
      "Tighten code quality, architecture, CI/CD, and cloud delivery. I apply proven practices (DORA metrics, clean code reviews, pragmatic DevOps) so you ship faster and safer.",
    bullets: [
      "Code Reviews & Best Practices",
      "Project Architecture & Scalability",
      "DevOps Support (Git, Docker, CI/CD)",
      "Cloud Deployment (Cloud Run, Render, AWS, Cloudflare)"
    ],
    ctas: [
      { label: "Book a Consult", useCal: true },
    ]
  },

  // Quick help & reviews
  reviews: [
    {
      tier: "Code Review Lite",
      price: "$149 flat",
      timeline: "≤1 PR / ≤500 LOC",
      items: [
        "Written notes with clear, actionable findings",
        "Best-practice checklist tailored to your stack",
        "Focus: design, tests, readability, maintainability"
      ],
      ctaTo: "/contact?service=consulting&plan=review-lite",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      tier: "Deep Review",
      price: "$399",
      timeline: "up to 4 hrs",
      badge: "Most popular",
      items: [
        "Multiple PRs or one critical module",
        "Recorded walkthrough + action plan",
        "Follow-up Q&A async"
      ],
      ctaTo: "/contact?service=consulting&plan=review-deep",
      gradient: "from-indigo-600 to-fuchsia-600",
      emphasized: true
    }
  ],

  // Architecture packages
  architecture: [
    {
      tier: "Architecture Blueprint",
      price: "$650",
      timeline: "1 day",
      items: [
        "System diagram & boundaries",
        "Scaling/caching plan & risks",
        "Backlog of next steps"
      ],
      ctaTo: "/contact?service=consulting&plan=blueprint",
      gradient: "from-emerald-600 to-teal-600"
    },
    {
      tier: "Blueprint+",
      price: "$1,200",
      timeline: "2–3 days",
      items: [
        "Capacity estimates & failure modes",
        "Observability plan (logs/metrics)",
        "Rollout strategy"
      ],
      ctaTo: "/contact?service=consulting&plan=blueprint-plus",
      gradient: "from-teal-600 to-cyan-600",
      emphasized: true
    }
  ],

  // DevOps pick-and-play
  devops: [
    { name: "Git & PR Workflow", price: "$200", desc: "Branch model, PR templates, protection rules", ctaTo: "/contact?service=consulting&plan=git-pr" },
    { name: "Dockerize App", price: "$300", desc: "Dev & prod images, compose file", ctaTo: "/contact?service=consulting&plan=dockerize" },
    { name: "CI/CD Pipeline", price: "$450", desc: "Tests, build, deploy (GH Actions/GitLab/etc.)", ctaTo: "/contact?service=consulting&plan=cicd" },
    { name: "Observability Starter", price: "$250", desc: "Basic logs/alerts + runbook", ctaTo: "/contact?service=consulting&plan=obs" },
    { name: "DevOps Starter Bundle", price: "$900", desc: "Git/PR + Docker + CI/CD + Observability", ctaTo: "/contact?service=consulting&plan=devops-bundle", highlight: true }
  ],

  // Cloud deployment one-time setups
  cloud: [
    { name: "Google Cloud Run", price: "$350", desc: "Containerize, service, domain/SSL, rollout", ctaTo: "/contact?service=consulting&plan=cloudrun", gradient: "from-sky-600 to-blue-600" },
    { name: "Render", price: "$300", desc: "PaaS deploy, autoscaling config (per plan)", ctaTo: "/contact?service=consulting&plan=render", gradient: "from-indigo-600 to-violet-600" },
    { name: "AWS Fargate (ECS)", price: "$600", desc: "Task/service, IAM, rollout", ctaTo: "/contact?service=consulting&plan=fargate", gradient: "from-amber-600 to-orange-600" },
    { name: "Cloudflare Workers", price: "$300", desc: "Edge function, routing, KV if needed", ctaTo: "/contact?service=consulting&plan=workers", gradient: "from-rose-600 to-pink-600" }
  ],

  retainers: [
    {
      name: "Essential",
      price: "$149/mo",
      response: "72-hr business",
      features: [
        "2 hrs consulting/month",
        "Light triage & async support",
        "Monthly dependency review"
      ],
      ctaTo: "/contact?service=consulting&plan=essential",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      name: "Growth",
      price: "$349/mo",
      response: "24–48 hr",
      badge: "Most popular",
      features: [
        "5 hrs consulting/month",
        "Roadmap nudges & check-ins",
        "Perf/quality monthly report"
      ],
      ctaTo: "/contact?service=consulting&plan=growth",
      gradient: "from-indigo-600 to-fuchsia-600",
      emphasized: true
    },
    {
      name: "Pro",
      price: "$749/mo",
      response: "Same-day (business)",
      features: [
        "12 hrs consulting/month",
        "Priority queue & incident help",
        "Runbook updates & training"
      ],
      ctaTo: "/contact?service=consulting&plan=pro",
      gradient: "from-emerald-600 to-teal-600"
    }
  ],

  notes: [
    "Overages billed at $95/hr (rounded to 30 min).",
    "Project work typically 50% to start, 50% on delivery."
  ],

  process: [
    { name: "Discovery", desc: "Goals, constraints, success metrics (free; extended $95 if needed)." },
    { name: "SOW & Quote", desc: "Scope, timeline, outcomes, clear pricing." },
    { name: "Working Sprint(s)", desc: "Async work + weekly touchpoints; tight feedback loops." },
    { name: "Demo & Handoff", desc: "Docs, runbooks, recordings, next steps." },
    { name: "Measure & Iterate", desc: "Optional retainer to improve DORA metrics." }
  ],

  slas: [
    "Response — Essential: 72h, Growth: 24–48h, Pro: same-day (business).",
    "Incidents — Pro start ≤4 business hrs; Growth ≤8; Essential best effort.",
    "Comms — Slack/email + weekly sync when active; change windows agreed."
  ],

  faq: [
    { q: "Will you work in our existing stack?", a: "Yes—React/Next, Node/Express, headless CMS, common CI/CD tools, major clouds." },
    { q: "Who owns code, infra, and secrets?", a: "You do. I use least-privilege access in your org accounts." },
    { q: "How do scope changes work?", a: "Small tweaks included; bigger changes get a quick estimate and mini-SOW." },
    { q: "How do we measure success?", a: "We track DORA metrics (deploy frequency, lead time, change failure rate, MTTR) and set targets." }
  ],

  seo: {
    title: "Technical Consulting | CodeByCed",
    description:
      "Affordable code reviews, architecture & scalability guidance, DevOps (Git, Docker, CI/CD), and cloud deployments (Cloud Run, Render, AWS, Cloudflare).",
    url: "https://codebyced.com/services/technical-consulting"
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

const ChipCard = ({ name, price, desc, ctaTo, gradient, highlight }) => (
  <div className={`relative overflow-hidden rounded-xl border border-gray-800 backdrop-blur-md bg-gray-900/70 p-6 ${highlight ? "ring-1 ring-indigo-500/40" : ""}`}>
    {gradient ? <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-3xl`} /> : null}
    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <h3 className="text-gray-100 font-semibold">{name}</h3>
        <div className="text-gray-300">{price}</div>
      </div>
      <p className="text-gray-400 mt-1">{desc}</p>
      <Link
        to={ctaTo}
        className="inline-flex items-center mt-4 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition text-sm"
      >
        Select
        <span className="ml-1">→</span>
      </Link>
    </div>
  </div>
);

const TechnicalConsultingPage = () => {
  const [searchParams] = useSearchParams();
  const plan = (searchParams.get("plan") || "").toLowerCase();

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
        { "@type": "Offer", name: "Code Review Lite", priceCurrency: "USD", price: "149" },
        { "@type": "Offer", name: "Deep Review", priceCurrency: "USD", price: "399" },
        { "@type": "Offer", name: "Architecture Blueprint", priceCurrency: "USD", price: "650" },
        { "@type": "Offer", name: "Blueprint+", priceCurrency: "USD", price: "1200" },
        { "@type": "Offer", name: "DevOps Starter Bundle", priceCurrency: "USD", price: "900" },
        { "@type": "Offer", name: "Cloud Run Deploy", priceCurrency: "USD", price: "350" },
        { "@type": "Offer", name: "Render Deploy", priceCurrency: "USD", price: "300" },
        { "@type": "Offer", name: "AWS Fargate Deploy", priceCurrency: "USD", price: "600" },
        { "@type": "Offer", name: "Cloudflare Workers Deploy", priceCurrency: "USD", price: "300" },
        { "@type": "Offer", name: "Essential Retainer", priceCurrency: "USD", price: "149" },
        { "@type": "Offer", name: "Growth Retainer", priceCurrency: "USD", price: "349" },
        { "@type": "Offer", name: "Pro Retainer", priceCurrency: "USD", price: "749" }
      ]
    }),
    []
  );

  const highlight = (label) => {
    if (!plan) return false;
    const p = plan;
    return (
      (label.toLowerCase().includes("growth") && (p === "growth" || p === "growth-maint")) ||
      (label.toLowerCase().includes("pro") && (p === "pro" || p === "pro-maint")) ||
      label.toLowerCase().includes(p) // generic match (review-lite, review-deep, blueprint, etc.)
    );
  };

  return (
    <PageLayout>
      <Helmet>
        <title>{content.seo.title}</title>
        <meta name="description" content={content.seo.description} />
        <link rel="canonical" href={content.seo.url} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
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
              {content.hero.ctas.map((c) => (
                <CalButton
                  key={c.label}
                  handle={CAL_HANDLE}
                  event={c.event || "secret"} // or hardcode "secret"
                  label={c.label}
                  className={
                    c.variant === "secondary"
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-100 px-5 py-2.5 rounded-lg border border-gray-700 transition-all duration-300"
                      : "bg-blue-700 hover:bg-blue-600 hover:shadow-cyan-900/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg"
                  }
                />
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

        {/* Reviews */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Code Reviews & Best Practices</h2>
            <div className="absolute bottom-0 left-0 w-28 h-1 bg-blue-500 rounded-full"></div>
          </div>
          <motion.div variants={variants.stagger} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-6">
            {content.reviews.map((p) => (
              <PriceCard key={p.tier} {...p} highlight={highlight(p.tier)} />
            ))}
          </motion.div>
        </section>

        {/* Architecture */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Project Architecture & Scalability</h2>
            <div className="absolute bottom-0 left-0 w-28 h-1 bg-emerald-500 rounded-full"></div>
          </div>
          <motion.div variants={variants.stagger} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-6">
            {content.architecture.map((p) => (
              <PriceCard key={p.tier} {...p} highlight={highlight(p.tier)} />
            ))}
          </motion.div>
        </section>

        {/* DevOps pick-and-play */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">DevOps Support (Pick & Play)</h2>
            <div className="absolute bottom-0 left-0 w-28 h-1 bg-cyan-500 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.devops.map((d) => (
              <ChipCard key={d.name} {...d} />
            ))}
          </div>
        </section>

        {/* Cloud deployment */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Cloud Deployment (One-time Setup)</h2>
            <div className="absolute bottom-0 left-0 w-28 h-1 bg-fuchsia-500 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.cloud.map((c) => (
              <ChipCard key={c.name} {...c} />
            ))}
          </div>
        </section>

        {/* Retainers */}
        <section className="mb-4">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Retainers (Month-to-Month)</h2>
            <div className="absolute bottom-0 left-0 w-28 h-1 bg-violet-500 rounded-full"></div>
          </div>
          <motion.div variants={variants.stagger} initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-6">
            {content.retainers.map((m) => (
              <PriceCard
                key={m.name}
                tier={m.name}
                price={m.price}
                timeline={`Response: ${m.response}`}
                items={m.features}
                ctaTo={m.ctaTo}
                gradient={m.gradient}
                emphasized={m.emphasized}
                badge={m.badge}
                highlight={highlight(m.name)}
              />
            ))}
          </motion.div>
          <ul className="text-sm text-gray-400 mt-3 space-y-1">
            {content.notes.map((n, i) => (
              <li key={i}>{n}</li>
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
            <div className="absolute bottom-0 left-0 w-16 h-1 bg-emerald-500 rounded-full"></div>
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
        <section className="mb-12">
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
              label="Book a Consult"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
              metadata={{ page: "technical-consulting", section: "bottom-cta" }}
            />
            <Link
              to="/contact?service=consulting"
              className="px-5 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 hover:bg-gray-700 transition"
            >
              Ask about bundles
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default TechnicalConsultingPage;
