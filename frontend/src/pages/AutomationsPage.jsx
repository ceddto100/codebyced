import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { getAutomations } from '../services/automationsService';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgekypd';

const AutomationOrb = ({ title }) => (
  <div className="relative overflow-hidden rounded-2xl border border-cyan-400/35 bg-[#04061a] p-6 mb-6">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.2),transparent_45%),radial-gradient(circle_at_70%_75%,rgba(99,102,241,0.35),transparent_50%)]" />
    <div className="relative mx-auto h-[250px] md:h-[320px] max-w-[520px] flex items-center justify-center">
      <div className="absolute w-[300px] h-[300px] md:w-[360px] md:h-[360px] rounded-full border border-cyan-400/25 animate-ping [animation-duration:4.8s]" />
      <div className="absolute w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-full border border-indigo-400/30 animate-pulse [animation-duration:2.8s]" />
      <div className="absolute w-[220px] h-[220px] md:w-[260px] md:h-[260px] rounded-full bg-gradient-to-br from-cyan-200/80 via-indigo-300/70 to-purple-500/70 shadow-[0_0_70px_rgba(56,189,248,0.45)]" />
      <div className="absolute w-[200px] h-[200px] md:w-[235px] md:h-[235px] rounded-full border-2 border-cyan-300/70" />
      <div className="absolute w-[12px] h-[12px] rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(56,189,248,0.95)] -translate-x-[118px] -translate-y-[18px] md:-translate-x-[132px] md:-translate-y-[30px] animate-bounce [animation-duration:2.2s]" />
      <div className="absolute w-[8px] h-[8px] rounded-full bg-indigo-300 shadow-[0_0_16px_rgba(129,140,248,0.95)] translate-x-[108px] -translate-y-[65px] md:translate-x-[124px] md:-translate-y-[80px] animate-pulse" />
      <div className="relative z-10 rounded-full w-[140px] h-[140px] md:w-[160px] md:h-[160px] flex items-center justify-center backdrop-blur-md bg-white/8 border border-white/35 shadow-[inset_0_0_40px_rgba(255,255,255,0.15)]">
        <span className="text-white text-5xl md:text-6xl font-semibold tracking-wide">II</span>
      </div>
    </div>
    <p className="relative z-10 mt-1 text-center text-cyan-200 uppercase tracking-[0.28em] text-xs md:text-sm">
      {title} • Live Introduction Pulse
    </p>
  </div>
);

const AutomationsPage = () => {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAutomations = async () => {
      const data = await getAutomations();
      setAutomations(data);
      setLoading(false);
    };

    fetchAutomations();
  }, []);

  return (
    <PageLayout>
      <Helmet>
        <title>Automation Systems | CodeByCed</title>
        <meta
          name="description"
          content="Explore premium Make.com AI automation systems, watch workflow demos, and launch with professional setup support."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gray-900/75 backdrop-blur-xl p-8 md:p-12 shadow-2xl shadow-cyan-900/20 mb-12">
          <div className="absolute -top-24 -right-16 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="relative z-10">
            <p className="inline-block text-xs uppercase tracking-[0.2em] text-cyan-200 mb-3">Automation Marketplace</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Done-for-You AI Automation Systems</h1>
            <p className="text-lg text-gray-200 max-w-3xl">
              Deploy business-ready workflows powered by Make.com. Watch real demos, inspect the shared workflow logic,
              and launch quickly with white-glove implementation.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="text-gray-300">Loading automation systems...</div>
        ) : (
          <div className="grid gap-8">
            {automations.map((automation) => (
              <article
                key={automation.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-700/70 bg-gray-900/70 backdrop-blur-lg p-6 md:p-8 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-900/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-indigo-500/0 group-hover:from-cyan-500/5 group-hover:to-indigo-500/5 transition-all duration-300" />
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl text-white font-semibold mb-3">{automation.name}</h2>
                  <p className="text-gray-200 mb-6">{automation.description}</p>

                  <AutomationOrb title={automation.name} />

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={automation.makeSharedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gray-800 text-gray-100 border border-cyan-400/40 hover:border-cyan-300 hover:text-white transition-all"
                    >
                      View Make.com Workflow
                    </a>
                    <a
                      href={automation.stripeCheckoutLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                    >
                      Purchase Professional Setup
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <section className="mt-12 rounded-3xl border border-cyan-400/20 bg-gray-900/75 backdrop-blur-xl p-8 md:p-10 shadow-xl shadow-cyan-900/20">
          <div className="max-w-3xl">
            <p className="inline-block text-xs uppercase tracking-[0.2em] text-cyan-200 mb-3">Custom Workflow Requests</p>
            <h2 className="text-3xl md:text-4xl text-white font-semibold mb-4">Need a custom automation workflow?</h2>
            <p className="text-gray-200 mb-8">
              Share your workflow goals, ask questions, or request a custom implementation. I&apos;ll follow up with
              recommendations and next steps.
            </p>
          </div>

          <form
            action={FORMSPREE_ENDPOINT}
            method="POST"
            className="grid gap-5 md:grid-cols-2"
            aria-label="Custom workflow request form"
          >
            <input type="hidden" name="_subject" value="New automation workflow request" />

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="you@company.com"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="workflow" className="block text-sm font-medium text-gray-200 mb-2">Workflow request or question</label>
              <textarea
                id="workflow"
                name="workflow"
                rows="6"
                required
                className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Tell me what you want to automate, your current tools, and any timeline or budget details."
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                Send request
              </button>
            </div>
          </form>
        </section>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default AutomationsPage;
