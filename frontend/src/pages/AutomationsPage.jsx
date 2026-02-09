import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { getAutomations } from '../services/automationsService';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgekypd';

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
        <section className="mb-12">
          <img
            src="/automation_cover.png"
            alt="Done-for-You AI Automation Systems"
            className="w-full rounded-3xl"
          />
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

                  <div className="rounded-xl border border-gray-700 bg-black/40 p-2 mb-6">
                    <video
                      className="w-full h-[240px] md:h-[380px] rounded-lg object-cover"
                      src={automation.demoVideoUrl}
                      controls
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>

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
