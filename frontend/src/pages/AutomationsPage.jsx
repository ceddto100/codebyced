import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { getAutomations } from '../services/automationsService';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgekypd';

const STAR_NODES = [
  { id: 1, left: '12%', top: '20%', size: 'h-2 w-2', speed: '2.4s' },
  { id: 2, left: '18%', top: '68%', size: 'h-1.5 w-1.5', speed: '3.1s' },
  { id: 3, left: '26%', top: '34%', size: 'h-2.5 w-2.5', speed: '2.8s' },
  { id: 4, left: '34%', top: '78%', size: 'h-1.5 w-1.5', speed: '3.3s' },
  { id: 5, left: '42%', top: '16%', size: 'h-2 w-2', speed: '2.6s' },
  { id: 6, left: '52%', top: '82%', size: 'h-1.5 w-1.5', speed: '3.4s' },
  { id: 7, left: '60%', top: '24%', size: 'h-2.5 w-2.5', speed: '2.5s' },
  { id: 8, left: '69%', top: '73%', size: 'h-1.5 w-1.5', speed: '3.2s' },
  { id: 9, left: '76%', top: '40%', size: 'h-2 w-2', speed: '2.9s' },
  { id: 10, left: '84%', top: '62%', size: 'h-2.5 w-2.5', speed: '2.7s' },
  { id: 11, left: '90%', top: '30%', size: 'h-1.5 w-1.5', speed: '3s' }
];

const AutomationOrb = ({ title, audioSrc }) => {
  const audioRef = React.useRef(null);
  const audioContextRef = React.useRef(null);
  const analyserRef = React.useRef(null);
  const sourceNodeRef = React.useRef(null);
  const animationFrameRef = React.useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioError, setAudioError] = useState('');

  const cloudinaryAudio = typeof audioSrc === 'string' && audioSrc.includes('res.cloudinary.com') ? audioSrc : '';

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
    const nextLevel = Math.min(1, average / 160);

    setAudioLevel((prev) => prev * 0.62 + nextLevel * 0.38);
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
      setAudioError('Upload a Cloudinary audio source for this automation to activate voice playback.');
      return;
    }

    setAudioError('');

    if (audioRef.current.paused) {
      try {
        await setupAudioAnalyser();
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        setAudioError('Audio playback was blocked. Click the orb again to try.');
      }
      return;
    }

    audioRef.current.pause();
    setIsPlaying(false);
    stopMetering();
  };

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

  const hue = Math.round(198 + audioLevel * 120);
  const secondHue = (hue + 58) % 360;
  const orbScale = 1 + audioLevel * 0.1;
  const haloStrength = 0.35 + audioLevel * 0.45;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-400/35 bg-[#03051a] p-6 mb-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(56,189,248,0.24),transparent_43%),radial-gradient(circle_at_75%_72%,rgba(129,140,248,0.35),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-indigo-500/10 to-transparent" />

      <div className="relative mx-auto h-[280px] md:h-[340px] max-w-[540px] flex items-center justify-center">
        <div className="absolute w-[320px] h-[320px] md:w-[390px] md:h-[390px] rounded-full border border-cyan-300/20 animate-ping [animation-duration:4.4s]" />
        <div className="absolute w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full border border-indigo-300/25 animate-pulse [animation-duration:2.6s]" />
        <div className="absolute w-[230px] h-[230px] md:w-[286px] md:h-[286px] rounded-full border border-cyan-200/40" style={{ boxShadow: `0 0 80px hsla(${hue}, 95%, 65%, ${haloStrength})` }} />

        {STAR_NODES.map((star, index) => (
          <span
            key={star.id}
            className={`absolute rounded-full bg-cyan-100/95 ${star.size} animate-bounce`}
            style={{
              left: star.left,
              top: star.top,
              animationDuration: star.speed,
              filter: `drop-shadow(0 0 ${12 + audioLevel * 20}px hsla(${secondHue}, 92%, 70%, 0.95))`,
              transform: `translateY(${Math.sin((index + 1) * 0.9) * (6 + audioLevel * 18)}px) scale(${1 + audioLevel * 0.55})`
            }}
          />
        ))}

        <button
          type="button"
          aria-label={isPlaying ? `Pause ${title} voice` : `Play ${title} voice`}
          aria-pressed={isPlaying}
          onClick={handleTogglePlay}
          className="relative z-20 rounded-full w-[170px] h-[170px] md:w-[190px] md:h-[190px] flex items-center justify-center border border-white/40 shadow-[inset_0_0_55px_rgba(255,255,255,0.16)] transition-transform duration-150 active:scale-95"
          style={{
            transform: `scale(${orbScale})`,
            background: `radial-gradient(circle at 30% 22%, hsla(${hue}, 94%, 82%, 0.93), hsla(${secondHue}, 88%, 61%, 0.88) 56%, hsla(${hue}, 90%, 44%, 0.86) 100%)`
          }}
        >
          <span className="text-white text-5xl md:text-6xl font-semibold tracking-wide drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
            {isPlaying ? 'II' : '▶'}
          </span>
        </button>

        <audio
          ref={audioRef}
          src={cloudinaryAudio}
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
        />
      </div>

      <div className="relative z-10 text-center">
        <p className="text-cyan-100 uppercase tracking-[0.24em] text-xs md:text-sm font-medium">
          {title} • {isPlaying ? 'Voice Live' : 'Voice Paused'}
        </p>
        <p className="mt-2 text-[11px] md:text-xs text-cyan-100/75">
          Click the orb to play/pause Cloudinary voice audio with reactive color waves and dancing stars.
        </p>
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

                  <AutomationOrb title={automation.name} audioSrc={automation.demoVideoUrl} />

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
