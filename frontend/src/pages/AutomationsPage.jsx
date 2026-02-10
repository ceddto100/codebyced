import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { getAutomations } from '../services/automationsService';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgekypd';

const AutomationOrb = ({ title, audioSrc }) => {
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
    if (!analyserRef.current) {
      return;
    }

    const analyser = analyserRef.current;
    const bins = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(bins);
    const average = bins.reduce((total, value) => total + value, 0) / bins.length;
    const nextLevel = Math.min(1, average / 155);

    setAudioLevel((prev) => prev * 0.65 + nextLevel * 0.35);
    animationFrameRef.current = requestAnimationFrame(sampleAudioLevel);
  }, []);

  const setupAudioAnalyser = React.useCallback(async () => {
    if (!audioRef.current || !cloudinaryAudio) {
      return;
    }

    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }
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
      try {
        await setupAudioAnalyser();
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (_error) {
        setAudioError('Audio playback was blocked. Click the orb again to try.');
      }
      return;
    }

    audioRef.current.pause();
    setIsPlaying(false);
    stopMetering();
  };

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setTimePulse((prev) => prev + 0.08);
    }, 40);

    return () => window.clearInterval(interval);
  }, []);

  React.useEffect(() => () => {
    stopMetering();

    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [stopMetering]);

  const pulseWave = isPlaying ? (Math.sin(timePulse * 2.8) + 1) * 0.5 : 0;
  const orbScale = 1 + audioLevel * 0.16 + pulseWave * 0.08;
  const glowStrength = 0.28 + audioLevel * 0.52 + pulseWave * 0.2;

  return (
    <div className="relative mb-8 py-4">
      <div className="mx-auto relative h-[320px] w-full max-w-[520px] flex items-center justify-center">
        <div
          className="absolute h-[290px] w-[290px] rounded-full border border-cyan-300/25"
          style={{
            transform: `scale(${1 + pulseWave * 0.14})`,
            boxShadow: `0 0 ${44 + audioLevel * 60}px rgba(56,189,248,${0.22 + audioLevel * 0.4})`
          }}
        />
        <div
          className="absolute h-[220px] w-[220px] rounded-full border border-indigo-200/35"
          style={{
            transform: `scale(${1 + pulseWave * 0.22})`,
            opacity: 0.36 + audioLevel * 0.35
          }}
        />

        <button
          type="button"
          aria-label={isPlaying ? `Pause ${title} voice` : `Play ${title} voice`}
          aria-pressed={isPlaying}
          onClick={handleTogglePlay}
          className="relative z-20 rounded-full w-[176px] h-[176px] md:w-[198px] md:h-[198px] flex items-center justify-center border border-cyan-100/45 transition-transform duration-150 active:scale-95"
          style={{
            transform: `scale(${orbScale})`,
            background: 'radial-gradient(circle at 30% 24%, rgba(224,242,254,0.96), rgba(56,189,248,0.9) 48%, rgba(59,130,246,0.86) 74%, rgba(30,64,175,0.92) 100%)',
            boxShadow: `0 0 ${36 + audioLevel * 66}px rgba(59,130,246,${glowStrength}), inset 0 0 65px rgba(255,255,255,0.2)`
          }}
        >
          <span className="text-white text-5xl md:text-6xl font-semibold tracking-wide drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
            {isPlaying ? 'II' : '▶'}
          </span>
        </button>

        <audio
          ref={audioRef}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => {
            setIsPlaying(false);
            stopMetering();
          }}
          onEnded={() => {
            setIsPlaying(false);
            stopMetering();
          }}
        >
          <source src={cloudinaryAudio} type="audio/mpeg" />
        </audio>
      </div>

      <div className="text-center">
        <p className="text-cyan-100 uppercase tracking-[0.24em] text-xs md:text-sm font-medium">
          {title} • {isPlaying ? 'Voice Live' : 'Voice Paused'}
        </p>
        <p className="mt-2 text-[11px] md:text-xs text-cyan-100/75">
          Tap the orb to play the real voice audio.
        </p>
        {!isAudioFile && cloudinaryAudio ? <p className="mt-2 text-xs text-amber-200">This URL does not look like an audio file.</p> : null}
        {audioError ? <p className="mt-2 text-xs text-rose-300">{audioError}</p> : null}
      </div>
    </div>
  );
};

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
          content="Explore premium Make.com AI automation systems, stream real workflow audio, inspect logic, and launch with professional setup support."
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
              Deploy business-ready workflows powered by Make.com. Listen to real audio, inspect the shared workflow logic,
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

                  <AutomationOrb title={automation.name} audioSrc={automation.demoAudioUrl || automation.demoVideoUrl} />

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
