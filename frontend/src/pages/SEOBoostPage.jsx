import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";

/**
 * SEO Boost — Static Service Page
 * CTAs use /contact?service=seo&plan=<quick|audit|onpage|schema|starter|essential|growth|pro>
 * Highlights a card when URL has ?plan=<value>
 */

const content = {
  hero: {
    title: "SEO Boost",
    subtitle:
      "Improve discoverability, speed, and rich results eligibility. I audit technical SEO, tune on-page signals, add structured data, and track progress in Google Search Console & Core Web Vitals.",
    bullets: [
      "Technical SEO Audit (crawlability, indexation, canonicals, sitemaps/robots)",
      "On-Page Optimization (titles, meta, headings, internal links, image alts)",
      "Core Web Vitals (LCP, CLS, INP) diagnostics & fixes",
      "Structured Data (Schema.org JSON-LD) for rich results"
    ],
    ctas: [
      { label: "Get an Audit", to: "/contact?service=seo&plan=audit" },
      { label: "Ask About Bundles", to: "/contact?service=seo", variant: "secondary" }
    ]
  },

  // One-time packages
  packages: [
    {
      tier: "Quick SEO Check",
      price: "$99",
      timeline: "2–3 business days",
      items: [
        "Lightweight review (top 5 issues)",
        "Console setup guidance",
        "Prioritized mini action list"
      ],
      ctaTo: "/contact?service=seo&plan=quick",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      tier: "Technical SEO Audit",
      price: "$299",
      timeline: "5–7 business days",
      badge: "Most popular",
      items: [
        "Full crawl + indexability",
        "CWV snapshot (LCP/CLS/INP)",
        "Sitemap/robots/canonicals",
        "P0–P2 backlog + 20–30m walkthrough"
      ],
      ctaTo: "/contact?service=seo&plan=audit",
      gradient: "from-indigo-600 to-fuchsia-600",
      emphasized: true
    },
    {
      tier: "Starter Boost",
      price: "$699",
      timeline: "1–2 weeks",
      items: [
        "Audit + implement P0 fixes",
        "Sitemap/robots tune & resubmit",
        "On-page updates for 10 key pages"
      ],
      ctaTo: "/contact?service=seo&plan=starter",
      gradient: "from-emerald-600 to-teal-600"
    }
  ],

  // À la carte / focused tasks
  focus: [
    {
      name: "On-Page Bundle (up to 5 pages)",
      price: "$199",
      desc: "Titles/meta/heading/internal-linking refresh + before/after diff",
      ctaTo: "/contact?service=seo&plan=onpage",
      gradient: "from-sky-600 to-blue-600"
    },
    {
      name: "Schema Setup (starter)",
      price: "$249",
      desc: "Organization + Breadcrumb + one page type (e.g., BlogPosting/Product), validated",
      ctaTo: "/contact?service=seo&plan=schema",
      gradient: "from-rose-600 to-pink-600"
    },
    {
      name: "Image Performance Pass",
      price: "$149",
      desc: "Lazy-load, modern formats, dimensions; CWV-friendly media",
      ctaTo: "/contact?service=seo&plan=images",
      gradient: "from-amber-600 to-orange-600"
    }
  ],

  // Monthly retainers
  retainers: [
    {
      name: "Essential",
      price: "$129/mo",
      response: "72-hr business",
      features: [
        "2 optimized pages / month",
        "Monthly CWV & index check",
        "Email support"
      ],
      ctaTo: "/contact?service=seo&plan=essential",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      name: "Growth",
      price: "$299/mo",
      response: "24–48 hr",
      badge: "Most popular",
      features: [
        "5 optimized pages / month",
        "2 content briefs / month",
        "Search Console report & insights"
      ],
      ctaTo: "/contact?service=seo&plan=growth",
      gradient: "from-indigo-600 to-fuchsia-600",
      emphasized: true
    },
    {
      name: "Pro",
      price: "$649/mo",
      response: "Same-day (business)",
      features: [
        "12 optimized pages / month",
        "Quarterly technical tune-up",
        "A/B meta testing roadmap"
      ],
      ctaTo: "/contact?service=seo&plan=pro",
      gradient: "from-emerald-600 to-teal-600"
    }
  ],

  notes: [
    "Overages billed at $95/hr (rounded to 30 min).",
    "Google does not guarantee indexing or rankings; we focus on eligibility and strong signals."
  ],

  process: [
    { name: "Access & Discovery", desc: "GSC/Analytics access, CMS/host, priority pages & queries." },
    { name: "Audit & Plan", desc: "Crawl/indexability, CWV, sitemaps/robots/canonicals, prioritized backlog." },
    { name: "Implement", desc: "Fix P0/P1 issues; on-page & structured data updates." },
    { name: "Validate", desc: "Re-crawl key pages, CWV/PageSpeed check, resubmit sitemap if needed." },
    { name: "Measure", desc: "Track GSC clicks/CTR/position & CWV trends over 4–12 weeks." }
  ],

  measure: [
    "Index coverage ↑ / errors ↓",
    "Core Web Vitals in the green (LCP/CLS/INP)",
    "GSC: impressions, clicks, CTR, avg position",
    "Rich results eligibility & errors"
  ],

  faq: [
    { q: "Do you guarantee #1 rankings?", a: "No—rankings aren’t guaranteed. We improve eligibility and signals per Google’s Search Essentials." },
    { q: "Do I need a sitemap?", a: "Most sites benefit. We validate XML sitemaps and submit via Search Console." },
    { q: "Can robots.txt prevent indexing?", a: "Robots.txt controls crawling, not indexing. Use noindex or auth for exclusion." },
    { q: "Which structured data do we add?", a: "Only types your content truly supports, following Google’s structured data policies." }
  ],

  seo: {
    title: "SEO Boost | CodeByCed",
    description:
      "Affordable technical SEO audits, on-page optimization, Core Web Vitals tuning, and Schema.org structured data. Track results in Google Search Console.",
    url: "https://codebyced.com/services/seo-boost"
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

const SEOBoostPage = () => {
  const [searchParams] = useSearchParams();
  const plan = (searchParams.get("plan") || "").toLowerCase();

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "SEO Boost",
      serviceType: "Technical SEO audit, on-page optimization, Core Web Vitals, structured data",
      provider: { "@type": "Person", name: "Cedrick Carter" },
      areaServed: "US (remote available)",
      url: content.seo.url,
      description: content.seo.description,
      offers: [
        { "@type": "Offer", name: "Quick SEO Check", priceCurrency: "USD", price: "99" },
        { "@type": "Offer", name: "Technical SEO Audit", priceCurrency: "USD", price: "299" },
        { "@type": "Offer", name: "Starter Boost", priceCurrency: "USD", price: "699" },
        { "@type": "Offer", name: "On-Page Bundle", priceCurrency: "USD", price: "199" },
        { "@type": "Offer", name: "Schema Setup", priceCurrency: "USD", price: "249" },
        { "@type": "Offer", name: "Essential", priceCurrency: "USD", price: "129" },
        { "@type": "Offer", name: "Growth", priceCurrency: "USD", price: "299" },
        { "@type": "Offer", name: "Pro", priceCurrency: "USD", price: "649" }
      ]
    }),
    []
  );

  const highlight = (label) => {
    if (!plan) return false;
    const p = plan;
    return (
      label.toLowerCase().includes(p) ||
      (label.toLowerCase() === "technical seo audit" && p === "audit")
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
            <h2 className="text-2xl font-bold text-gray-100">One-time Packages</h2>
            <div className="absolute bottom-0 left-0 w-24 h-1 bg-blue-500 rounded-full"></div>
          </div>
          <motion.div variants={variants.stagger} initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-6">
            {content.packages.map((p) => (
              <PriceCard key={p.tier} {...p} highlight={highlight(p.tier)} />
            ))}
          </motion.div>
        </section>

        {/* Focused tasks */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Focused Tasks</h2>
            <div className="absolute bottom-0 left-0 w-24 h-1 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.focus.map((c) => (
              <ChipCard key={c.name} {...c} highlight={highlight(c.name)} />
            ))}
          </div>
        </section>

        {/* Retainers */}
        <section className="mb-4">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Monthly Plans</h2>
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

        {/* How we measure */}
        <section className="mb-14">
          <div className="relative pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">How We Measure Success</h2>
            <div className="absolute bottom-0 left-0 w-28 h-1 bg-emerald-500 rounded-full"></div>
          </div>
          <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.measure.map((m, i) => (
              <li key={i} className="backdrop-blur-sm bg-gray-900/70 border border-gray-800 rounded-xl p-5 text-gray-300">
                {m}
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
            <Link
              to="/contact?service=seo&plan=audit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
            >
              Get an Audit
            </Link>
            <Link
              to="/contact?service=seo"
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

export default SEOBoostPage;
