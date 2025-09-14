import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import PageLayout from "../components/PageLayout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * Web Development & Maintenance — Service Page
 * Static page, dynamic content via arrays below.
 * Design matches your existing gradient/glass style.
 */

const content = {
  hero: {
    title: "Web Development & Maintenance",
    subtitle:
      "Build fast. Look sharp. Stay stable. I design, develop, and maintain high-performance websites and web apps using React, Node.js, and Tailwind.",
    ctas: [
      { label: "Get a Quote", to: "/contact?service=web-dev" },
      { label: "See Past Work", to: "/projects", variant: "secondary" },
    ],
    bullets: [
      "Custom Website Development (React, Node.js, Tailwind)",
      "Bug Fixes & Performance Optimization",
      "Website Redesigns / Modernization (responsive upgrades)",
      "Ongoing Maintenance Plans (security, updates, uptime monitoring)",
    ],
  },

  // Pricing (editable)
  packages: [
    {
      tier: "Starter Site",
      price: "$1,500–$3,500",
      timeline: "1–2 weeks",
      badge: "Popular for launches",
      items: [
        "1–5 pages, responsive",
        "Contact form, basic SEO",
        "Deploy + staging",
        "Light animations",
      ],
      cta: { label: "Start Starter", to: "/contact?service=web-dev&plan=starter" },
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      tier: "Growth Site",
      price: "$4,000–$9,000",
      timeline: "3–6 weeks",
      badge: "Most popular",
      items: [
        "6–15 pages + CMS/blog",
        "Email/CRM integrations",
        "Analytics & performance",
        "Design system tokens",
      ],
      cta: { label: "Start Growth", to: "/contact?service=web-dev&plan=growth" },
      gradient: "from-indigo-600 to-fuchsia-600",
      emphasized: true,
    },
    {
      tier: "Pro / Web App",
      price: "$10,000–$25,000+",
      timeline: "6–12+ weeks",
      items: [
        "Auth, dashboards, RBAC",
        "Custom APIs & webhooks",
        "Advanced integrations",
        "Scalable architecture",
      ],
      cta: { label: "Start Pro", to: "/contact?service=web-dev&plan=pro" },
      gradient: "from-emerald-600 to-teal-600",
    },
  ],

  modernization: [
    { name: "UI Refresh (same content)", price: "$3,000–$7,000" },
    { name: "Full Redesign + IA/content", price: "$7,000–$15,000+" },
  ],

  // Maintenance Plans
  maintenance: [
    {
      name: "Essential",
      price: "$99/mo",
      response: "72-hr email",
      features: [
        "Uptime monitoring (HTTP ping)",
        "Monthly dependency review",
        "Weekly backups (site/db)",
        "Security checks & SSL renewals",
      ],
      gradient: "from-sky-600 to-blue-600",
      cta: "/contact?service=maintenance&plan=essential",
    },
    {
      name: "Growth",
      price: "$299/mo",
      response: "24–48 hr",
      badge: "Most popular",
      features: [
        "Everything in Essential",
        "2 hrs dev time for minor changes",
        "Staging + deploy review",
        "Perf & SEO monthly check",
      ],
      gradient: "from-indigo-600 to-violet-600",
      emphasized: true,
      cta: "/contact?service=maintenance&plan=growth",
    },
    {
      name: "Pro",
      price: "$799/mo",
      response: "Same-day (business)",
      features: [
        "Everything in Growth",
        "6 hrs dev time",
        "Priority queue + incident response",
        "Advanced monitoring & error tracking",
      ],
      gradient: "from-rose-600 to-pink-600",
      cta: "/contact?service=maintenance&plan=pro",
    },
  ],

  alacarte: [
    { name: "Quick Fix (≤1 hr, 1 issue)", price: "$150 flat" },
    { name: "Diagnostic & Triage (up to 2 hrs)", price: "$149 (credited if we proceed)" },
    { name: "Optimization Sprint (1 week)", price: "$1,200–$2,400" },
  ],

  process: [
    { name: "Discovery", desc: "Goals, audience, success metrics; free consult." },
    { name: "Proposal & SOW", desc: "Scope, timeline, price, assumptions." },
    { name: "Design/Architecture", desc: "Component map, data flow, integrations." },
    { name: "Build", desc: "Weekly check-ins; staging links for review." },
    { name: "QA & Launch", desc: "Cross-browser tests, performance, SEO basics." },
    { name: "Handoff & Docs", desc: "Runbook, credentials, training (recorded video)." },
    { name: "Maintenance", desc: "Proactive updates, support, improvements." },
  ],

  slas: [
    "Response time — Essential: 72h, Growth: 24–48h, Pro: same-day (business).",
    "Critical incidents — Pro: start within 4 business hrs; Growth: 8; Essential: best effort.",
    "Uptime monitoring — 24/7 checks, alerts to email/SMS.",
  ],

  faq: [
    {
      q: "Can you work with my existing stack/CMS?",
      a: "Yes—React/Next, Node/Express, Headless WordPress, Sanity, Contentful, or no-CMS setups.",
    },
    {
      q: "Do you migrate content & preserve SEO?",
      a: "Yes. I map URLs, set redirects, carry over meta/OG data, and submit a fresh sitemap.",
    },
    {
      q: "Do you host?",
      a: "I’ll set up hosting (Vercel/Netlify/Render/Cloudflare/AWS). You own the account.",
    },
    {
      q: "How do change requests work during a project?",
      a: "Small tweaks are fine. Larger changes get a quick estimate and a mini-SOW so timelines stay clear.",
    },
    {
      q: "Payment terms?",
      a: "Typically 50% to start and 50% at launch. Maintenance is monthly in advance.",
    },
  ],

  // For SEO / schema
  seo: {
    title: "Web Development & Maintenance | CodeByCed",
    description:
      "Custom React/Node/Tailwind sites, bug fixes, performance optimization, redesigns, and ongoing maintenance plans with clear pricing.",
    url: "https://codebyced.com/services/web-development-maintenance",
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

const PriceCard = ({ tier, price, timeline, items, badge, cta, gradient, emphasized }) => (
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
        to={cta.to}
        className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
      >
        {cta.label}
        <span className="ml-1">→</span>
      </Link>
    </div>
  </motion.div>
);

const FeatureRow = ({ title, items }) => (
  <div className="backdrop-blur-sm bg-gray-900/70 border border-gray-800 rounded-xl p-6">
    <h3 className="text-lg font-semibold text-gray-100 mb-3">{title}</h3>
    <ul className="grid md:grid-cols-2 gap-2">
      {items.map((t, i) => (
        <li key={i} className="text-gray-300 flex">
          <span className="mr-2 text-blue-400">•</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  </div>
);

const WebDevMaintenancePage = () => {
  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Web Development & Maintenance",
      provider: { "@type": "Person", name: "Cedrick Carter" },
      areaServed: "US (remote available)",
      serviceType: "Web development, optimization, redesign, and maintenance",
      offers: [
        {
          "@type": "Offer",
          name: "Starter Site",
          priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", price: "1500-3500" },
        },
        {
          "@type": "Offer",
          name: "Growth Site",
          priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", price: "4000-9000" },
        },
        {
          "@type": "Offer",
          name: "Pro / Web App",
          priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", price: "10000-25000" },
        },
        {
          "@type": "Offer",
          name: "Maintenance Essential",
          priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", price: "99" },
        },
        {
          "@type": "Offer",
          name: "Maintenance Growth",
          priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", price: "299" },
        },
        {
          "@type": "Offer",
          name: "Maintenance Pro",
          priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", price: "799" },
        },
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
        </section>

        {/* Modernization quick pricing */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Redesign / Modernization</h2>
            <div className="absolute bottom-0 left-0 w-20 h-1 bg-indigo-500 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {content.modernization.map((m) => (
              <div key={m.name} className="backdrop-blur-sm bg-gray-900/70 border border-gray-800 rounded-xl p-6 flex items-center justify-between">
                <span className="text-gray-100">{m.name}</span>
                <span className="text-gray-300">{m.price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* À la carte */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Bug Fixes & Optimization (À la carte)</h2>
            <div className="absolute bottom-0 left-0 w-32 h-1 bg-emerald-500 rounded-full"></div>
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

        {/* Maintenance Plans */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Maintenance Plans (Month-to-Month)</h2>
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
                    to={m.cta}
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
            Overages billed at $95–$125/hr or rolled into a mini-sprint.
          </p>
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
            <h2 className="text-2xl font-bold text-gray-100">SLAs</h2>
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
              to="/contact?service=web-dev"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
            >
              Get a Quote
            </Link>
            <Link
              to="/resume.pdf"
              target="_blank"
              className="px-5 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 hover:bg-gray-700 transition"
            >
              Download Capabilities PDF
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default WebDevMaintenancePage;
