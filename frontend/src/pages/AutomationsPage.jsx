import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { getAutomations } from '../services/automationsService';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgekypd';

/* ── Workflow step data derived from automation name ── */
const AGENT_WORKFLOWS = {
  'Auto Blog': [
    { label: 'Trigger', detail: 'Schedule or webhook fires', icon: 'Z' },
    { label: 'Research', detail: 'AI scans topics & trends', icon: 'R' },
    { label: 'Draft', detail: 'Agent writes full blog post', icon: 'D' },
    { label: 'Review', detail: 'Grammar, SEO & tone check', icon: 'Q' },
    { label: 'Publish', detail: 'Posts to your CMS live', icon: 'P' },
  ],
};

const DEFAULT_WORKFLOW = [
  { label: 'Trigger', detail: 'Event or schedule starts the agent', icon: 'T' },
  { label: 'Process', detail: 'AI analyzes and executes tasks', icon: 'A' },
  { label: 'Integrate', detail: 'Connects to your tools', icon: 'I' },
  { label: 'Deliver', detail: 'Output sent to destination', icon: 'D' },
];

/* ── Workflow visualizer ── */
const WorkflowDisplay = ({ agentName }) => {
  const steps = AGENT_WORKFLOWS[agentName] || DEFAULT_WORKFLOW;

  return (
    <div className="my-8 p-5 rounded-2xl border border-gray-700/60 bg-gray-950/50 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/80 mb-4 font-medium">
        Agent Workflow
      </p>
      <div className="flex items-start justify-between gap-2 overflow-x-auto pb-2">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            {/* Step node */}
            <div className="flex flex-col items-center min-w-[80px] flex-1">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 border border-cyan-400/40 flex items-center justify-center text-cyan-200 text-sm font-bold mb-2">
                {step.icon}
              </div>
              <span className="text-xs font-semibold text-gray-100 text-center">{step.label}</span>
              <span className="text-[10px] text-gray-400 text-center mt-0.5 leading-tight">{step.detail}</span>
            </div>
            {/* Connector arrow */}
            {idx < steps.length - 1 && (
              <div className="flex items-center pt-3 text-cyan-500/50 text-lg select-none shrink-0">
                &rarr;
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/* ── Agent status badge ── */
const StatusBadge = ({ status }) => {
  const colors = {
    active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    ready: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  };
  const s = status || 'ready';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${colors[s] || colors.ready}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
      {s === 'active' ? 'Active' : 'Ready to Deploy'}
    </span>
  );
};

/* ── Agent avatar orb (with optional audio) ── */
const AgentOrb = ({ title, audioSrc }) => {
  const audioRef = React.useRef(null);
  const audioContextRef = React.useRef(null);
  const analyserRef = React.useRef(null);
  const sourceNodeRef = React.useRef(null);
  const animationFrameRef = React.useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioError, setAudioError] = useState('');
  const [timePulse, setTimePulse] = useState(0);

  const cloudinaryAudio = typeof audioSrc === 'string' && audioSrc.includes('res.cloudinary.com') ? audioSrc : '';
  const isAudioFile = typeof cloudinaryAudio === 'string' && /\.(mp3|wav|m4a|ogg)(\?|$)/i.test(cloudinaryAudio);

  const stopMetering = React.useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const sampleAudioLevel = React.useCallback(() => {
    if (!analyserRef.current) return;
    const analyser = analyserRef.current;
    const bins = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(bins);
    const average = bins.reduce((total, value) => total + value, 0) / bins.length;
    const nextLevel = Math.min(1, average / 155);
    setAudioLevel((prev) => prev * 0.65 + nextLevel * 0.35);
    animationFrameRef.current = requestAnimationFrame(sampleAudioLevel);
  }, []);

  const setupAudioAnalyser = React.useCallback(async () => {
    if (!audioRef.current || !cloudinaryAudio) return;
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioContextRef.current = new AudioContextClass();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    if (!sourceNodeRef.current) {
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 128;
      sourceNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
    sampleAudioLevel();
  }, [cloudinaryAudio, sampleAudioLevel]);

  const handleTogglePlay = async () => {
    if (!audioRef.current || !cloudinaryAudio) {
      setAudioError('Add a real Cloudinary audio URL to activate voice playback.');
      return;
    }
    setAudioError('');
    if (audioRef.current.paused) {
      try { await setupAudioAnalyser(); } catch (_e) { /* continue */ }
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (_e) {
        setAudioError('Audio playback was blocked. Click the orb again to try.');
      }
      return;
    }
    audioRef.current.pause();
    setIsPlaying(false);
    stopMetering();
  };

  React.useEffect(() => {
    const interval = window.setInterval(() => setTimePulse((prev) => prev + 0.08), 40);
    return () => window.clearInterval(interval);
  }, []);

  React.useEffect(() => () => {
    stopMetering();
    if (sourceNodeRef.current) { sourceNodeRef.current.disconnect(); sourceNodeRef.current = null; }
    if (analyserRef.current) { analyserRef.current.disconnect(); analyserRef.current = null; }
    if (audioContextRef.current) { audioContextRef.current.close(); audioContextRef.current = null; }
  }, [stopMetering]);

  const pulseWave = isPlaying ? (Math.sin(timePulse * 2.8) + 1) * 0.5 : 0;
  const orbScale = 1 + audioLevel * 0.16 + pulseWave * 0.08;
  const glowStrength = 0.28 + audioLevel * 0.52 + pulseWave * 0.2;

  /* Initials from agent title */
  const initials = title
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[160px] w-[160px] flex items-center justify-center">
        <div
          className="absolute h-[150px] w-[150px] rounded-full border border-cyan-300/25"
          style={{
            transform: `scale(${1 + pulseWave * 0.14})`,
            boxShadow: `0 0 ${30 + audioLevel * 40}px rgba(56,189,248,${0.18 + audioLevel * 0.35})`,
          }}
        />
        <button
          type="button"
          aria-label={isPlaying ? `Pause ${title} voice` : `Play ${title} voice`}
          aria-pressed={isPlaying}
          onClick={handleTogglePlay}
          className="relative z-20 rounded-full w-[110px] h-[110px] flex items-center justify-center border border-cyan-100/45 transition-transform duration-150 active:scale-95"
          style={{
            transform: `scale(${orbScale})`,
            background: 'radial-gradient(circle at 30% 24%, rgba(224,242,254,0.96), rgba(56,189,248,0.9) 48%, rgba(59,130,246,0.86) 74%, rgba(30,64,175,0.92) 100%)',
            boxShadow: `0 0 ${28 + audioLevel * 50}px rgba(59,130,246,${glowStrength}), inset 0 0 50px rgba(255,255,255,0.18)`,
          }}
        >
          <span className="text-white text-2xl font-bold tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">
            {isPlaying ? 'II' : initials}
          </span>
        </button>

        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => { setIsPlaying(false); stopMetering(); }}
          onEnded={() => { setIsPlaying(false); stopMetering(); }}
        >
          <source src={cloudinaryAudio} type="audio/mpeg" />
        </audio>
      </div>

      <p className="mt-2 text-[10px] text-cyan-100/60 text-center">
        {isPlaying ? 'Agent speaking...' : 'Tap to hear this agent'}
      </p>
      {!isAudioFile && cloudinaryAudio ? <p className="mt-1 text-[10px] text-amber-200">URL may not be an audio file.</p> : null}
      {audioError ? <p className="mt-1 text-[10px] text-rose-300">{audioError}</p> : null}
    </div>
  );
};

/* ── Main page ── */
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
        <title>AI Agent Employees | CodeByCed</title>
        <meta
          name="description"
          content="Hire AI agent employees that work 24/7. Each agent handles an entire workflow end-to-end — from content creation to customer ops — so you can scale without headcount."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gray-900/75 backdrop-blur-xl p-8 md:p-12 shadow-2xl shadow-cyan-900/20 mb-12">
          <div className="absolute -top-24 -right-16 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="relative z-10">
            <p className="inline-block text-xs uppercase tracking-[0.2em] text-cyan-200 mb-3">AI Workforce</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Hire AI Employees, Not&nbsp;Software
            </h1>
            <p className="text-lg text-gray-200 max-w-3xl">
              Each agent is a fully trained digital employee that owns an entire workflow — content writing,
              lead nurturing, data entry, customer ops, and more. They work 24/7, never call in sick,
              and cost a fraction of a full-time hire.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-2 bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Always On — 24/7
              </span>
              <span className="flex items-center gap-2 bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700/60">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Full Workflow Ownership
              </span>
              <span className="flex items-center gap-2 bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700/60">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Inspect Every Step
              </span>
            </div>
          </div>
        </section>

        {/* ── Agent cards ── */}
        {loading ? (
          <div className="text-gray-300">Loading your AI workforce...</div>
        ) : (
          <div className="grid gap-10">
            {automations.map((agent) => (
              <article
                key={agent.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-700/70 bg-gray-900/70 backdrop-blur-lg hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-900/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-indigo-500/0 group-hover:from-cyan-500/5 group-hover:to-indigo-500/5 transition-all duration-300" />

                <div className="relative z-10 p-6 md:p-8">
                  {/* Agent header row */}
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Orb / avatar */}
                    <AgentOrb title={agent.name} audioSrc={agent.demoAudioUrl || agent.demoVideoUrl} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="text-2xl md:text-3xl text-white font-semibold">{agent.name}</h2>
                        <StatusBadge status="ready" />
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">{agent.description}</p>

                      {/* Quick stats */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span className="bg-gray-800/70 border border-gray-700/50 px-2.5 py-1 rounded-lg">
                          Role: Content Creator
                        </span>
                        <span className="bg-gray-800/70 border border-gray-700/50 px-2.5 py-1 rounded-lg">
                          Availability: 24/7
                        </span>
                        <span className="bg-gray-800/70 border border-gray-700/50 px-2.5 py-1 rounded-lg">
                          Powered by Make.com
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Workflow visualizer */}
                  <WorkflowDisplay agentName={agent.name} />

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={agent.makeSharedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gray-800 text-gray-100 border border-cyan-400/40 hover:border-cyan-300 hover:text-white transition-all"
                    >
                      View Agent Workflow
                    </a>
                    <a
                      href={agent.stripeCheckoutLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                    >
                      Hire This Agent
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ── Custom agent request ── */}
        <section className="mt-12 rounded-3xl border border-cyan-400/20 bg-gray-900/75 backdrop-blur-xl p-8 md:p-10 shadow-xl shadow-cyan-900/20">
          <div className="max-w-3xl">
            <p className="inline-block text-xs uppercase tracking-[0.2em] text-cyan-200 mb-3">Custom Agents</p>
            <h2 className="text-3xl md:text-4xl text-white font-semibold mb-4">Need a custom AI employee?</h2>
            <p className="text-gray-200 mb-8">
              Describe the role you need filled, the tools your team uses, and what a successful outcome looks
              like. I&apos;ll design and deploy a custom agent tailored to your business.
            </p>
          </div>

          <form
            action={FORMSPREE_ENDPOINT}
            method="POST"
            className="grid gap-5 md:grid-cols-2"
            aria-label="Custom agent request form"
          >
            <input type="hidden" name="_subject" value="New AI agent employee request" />

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
              <label htmlFor="workflow" className="block text-sm font-medium text-gray-200 mb-2">
                Describe the role & workflow
              </label>
              <textarea
                id="workflow"
                name="workflow"
                rows="6"
                required
                className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Example: I need an agent that monitors new Stripe payments, creates invoices in QuickBooks, and sends a thank-you email to the customer."
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                Request a Custom Agent
              </button>
            </div>
          </form>
        </section>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            &larr; Back to homepage
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default AutomationsPage;
