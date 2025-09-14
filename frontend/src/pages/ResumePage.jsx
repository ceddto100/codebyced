import React, { useEffect, useState, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet';
import { getResumeEntries } from '../services/resumeService';

const ResumePage = () => {
  // Content (kept and expanded)
  const personalInfo = {
    name: "Cedrick Carter",
    title: "Software Developer",
    summary:
      "Versatile software developer adept at documentation comprehension, automation, and seamless code integration using diverse coding tools. Driven by entrepreneurial initiative and enthusiasm for machine learning, I excel at problem-solving, API integrations, AI-powered solutions, and low-code/no-code development.",
    email: "cartercedrick35@gmail.com",
    phone: "(502) 830-7701",
    location: "Willing to relocate - U.S. or remote",
    linkedin: "linkedin.com/in/cedrick-carter-5b41b4315/",
    github: "github.com/ceddto100",
    avatar: "/images/newpic.png",
  };

  const workExperience = [
    {
      id: 1,
      role: "Developer",
      company: "ChazzTalk Conversational AI",
      period: "2025 - Ongoing",
      description:
        "Developed an AI-powered customer service chatbot leveraging conversational AI technologies.",
      achievements: [
        "Developed an AI-powered customer service chatbot leveraging conversational AI technologies",
        "Integrated APIs and automation workflows to enhance customer interactions and streamline support",
        "Utilized various AI tools, including GitHub Copilot and Eleven Labs, for debugging and optimizing chatbot functionalities",
      ],
      tags: ["Node.js", "Python", "LLMs", "APIs", "Automation"],
    },
    {
      id: 2,
      role: "Developer",
      company: "K-LooseThreads Embroidery Business",
      period: "2025 - Ongoing",
      description:
        "Developed, managed, and improved software integrations to automate embroidery business operations.",
      achievements: [
        "Developed, managed, and improved software integrations to automate embroidery business operations",
      ],
      tags: ["Make.com", "Zapier", "Webhooks", "CRM"],
    },
  ];

  const education = [
    {
      id: 1,
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Phoenix",
      period: "Expected 2026",
      description:
        "Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming (OOP), Machine Learning, Web Development, Database Management, Software Engineering",
    },
  ];

  const skills = {
    technical: [
      "Python","JavaScript","HTML & CSS","SQL (Basic)",
      "Flask","Pandas","NumPy","TensorFlow","Scikit-learn (Basic)",
      "MongoDB","Git","GitHub","Eleven Labs","Runway ML"
    ],
    soft: [
      "Problem Solving","API Integration","Business Automation","AI Solutions","Low-code/No-code Development"
    ],
  };

  const certifications = [
    "Make.com (Business automation)",
    "OpenAI GPT-4",
    "Eleven Labs API",
    "Stripe API",
  ];

  // NEW: Selected Integrations & Platforms (concise, scan-friendly)
  const integrations = [
    "OpenAI", "Stripe", "Twilio", "HubSpot / Salesforce (CRM)",
    "GitHub Actions", "Cloudflare", "Render", "Webhooks/REST"
  ];

  // Calculated stats (kept)
  const stats = useMemo(() => {
    const achievementsCount = workExperience.reduce(
      (acc, w) => acc + (w.achievements?.length || 0),
      0
    );
    return [
      { label: "Experience Roles", value: workExperience.length },
      { label: "Key Achievements", value: achievementsCount },
      { label: "Certifications", value: certifications.length },
      { label: "Skills", value: skills.technical.length + skills.soft.length },
    ];
  }, [workExperience, certifications, skills]);

  // Animations (kept)
  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const reveal = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.55 } },
  };
  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const AnimatedSection = ({ children, variants = fadeInUp }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.12, triggerOnce: true });
    useEffect(() => { if (inView) controls.start("visible"); }, [inView, controls]);
    return (
      <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
        {children}
      </motion.div>
    );
  };

  const resumeStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Cedrick Carter",
    jobTitle: "Software Developer",
    url: "https://codebyced.com/resume",
    sameAs: [`https://${personalInfo.linkedin}`, `https://${personalInfo.github}`],
    knowsAbout: [
      "Business Automation","API Integration","AI Solutions",
      "Low-code Development","Workflow Optimization",
      "Digital Transformation","Conversational AI",
    ],
    description: personalInfo.summary,
    email: personalInfo.email,
    telephone: personalInfo.phone,
    address: { "@type": "PostalAddress", addressLocality: "Remote", addressCountry: "US" },
    worksFor: { "@type": "Organization", name: "ChazzTalk Conversational AI", position: "Developer" },
  };

  const ringByAccent = (accent) => ({
    blue: "ring-blue-500/30",
    indigo: "ring-indigo-500/30",
    emerald: "ring-emerald-500/30",
  }[accent] || "ring-blue-500/30");

  const SectionHeader = ({ id, title, accent = "blue" }) => (
    <div id={id} className="relative pb-3 mb-6">
      <h2 className={`text-2xl font-bold bg-gradient-to-r from-${accent}-600 to-indigo-600 text-transparent bg-clip-text`}>
        {title}
      </h2>
      <div className={`absolute bottom-0 left-0 w-24 h-1 bg-${accent}-500 rounded-full`} />
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Resume | Cedrick Carter - Software Developer & Business Automation Expert</title>
        <meta name="description" content="Cedrick Carter's professional resume showcasing expertise in business automation, API integration, AI solutions, and low-code development. Experienced in digital transformation and workflow optimization." />
        <meta name="keywords" content="software developer, business automation, API integration, AI solutions, low-code development, workflow optimization, digital transformation, conversational AI, technology consulting" />
        <meta property="og:title" content="Cedrick Carter - Software Developer & Business Automation Expert" />
        <meta property="og:description" content="Professional resume showcasing expertise in business automation, API integration, AI solutions, and low-code development." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://codebyced.com/resume" />
        <meta property="og:image" content="https://codebyced.com/images/newpic.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cedrick Carter - Software Developer & Business Automation Expert" />
        <meta name="twitter:description" content="Professional resume showcasing expertise in business automation, API integration, AI solutions, and low-code development." />
        <meta name="twitter:image" content="https://codebyced.com/images/newpic.png" />
        <link rel="canonical" href="https://codebyced.com/resume" />
        <script type="application/ld+json">{JSON.stringify(resumeStructuredData)}</script>
      </Helmet>

      {/* Background grid + blobs (kept) */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.08),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
            <div>
              {/* Hero (kept) */}
              <AnimatedSection variants={reveal}>
                <header className="relative mb-10 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg p-6 md:p-8">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-2xl" />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className={`relative h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 p-0.5 ring-4 ${ringByAccent("blue")} shadow-md`}>
                        <div className="h-full w-full rounded-full overflow-hidden bg-white">
                          {personalInfo.avatar ? (
                            <img src={personalInfo.avatar} alt={personalInfo.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-blue-600">
                              {personalInfo.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                          {personalInfo.name}
                        </h1>
                        <p className="text-blue-700 font-medium">{personalInfo.title}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <a href={`mailto:${personalInfo.email}`} className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition">{personalInfo.email}</a>
                      <a href={`tel:${personalInfo.phone.replace(/[^\d+]/g, '')}`} className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition">{personalInfo.phone}</a>
                      <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition">LinkedIn →</a>
                      <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100 transition">GitHub →</a>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Professional Summary</h3>
                    <p className="text-gray-600 leading-relaxed">{personalInfo.summary}</p>
                  </div>

                  {/* Stats (kept) */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {stats.map((s, i) => (
                      <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-3 text-center shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                        <div className="text-xs text-gray-500">{s.label}</div>
                      </motion.div>
                    ))}
                  </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={`${process.env.PUBLIC_URL}/resume.pdf`}
                        target="_blank"
                        rel="noopener"
                        download
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition"
                      >
                        Download PDF
                      </a>
                      <span className="px-3 py-2 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50">
                        {personalInfo.location}
                      </span>
                  </div>



                </header>
              </AnimatedSection>

              {/* Experience (kept) */}
              <section className="mb-12">
                <AnimatedSection>
                  <SectionHeader id="experience" title="Work Experience" accent="blue" />
                </AnimatedSection>

                <motion.div variants={stagger} initial="hidden" animate="visible" className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200" />
                  <div className="space-y-8">
                    {workExperience.map((job) => (
                      <AnimatedSection key={job.id}>
                        <article className="relative pl-10">
                          <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full bg-white border-2 border-blue-400 shadow flex items-center justify-center">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                          </div>
                          <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-sm hover:shadow-md transition">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h3 className="text-xl font-semibold text-gray-900">{job.role}</h3>
                              <p className="text-sm text-gray-500">{job.period}</p>
                            </div>
                            <p className="text-blue-700 font-medium">{job.company}</p>
                            <p className="mt-3 text-gray-700">{job.description}</p>
                            <ul className="mt-4 space-y-2">
                              {job.achievements.map((a, i) => (
                                <li key={i} className="flex items-start text-gray-700">
                                  <svg className="mt-0.5 mr-2 h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{a}</span>
                                </li>
                              ))}
                            </ul>
                            {job.tags?.length ? (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {job.tags.map((t) => (
                                  <span key={t} className="px-2.5 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </article>
                      </AnimatedSection>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* Education (kept) */}
              <section className="mb-12">
                <AnimatedSection>
                  <SectionHeader id="education" title="Education" accent="indigo" />
                </AnimatedSection>
                <div className="grid gap-6">
                  {education.map((edu) => (
                    <AnimatedSection key={edu.id}>
                      <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-sm text-gray-500">{edu.period}</p>
                        </div>
                        <p className="text-indigo-700 font-medium">{edu.institution}</p>
                        <p className="mt-3 text-gray-700">{edu.description}</p>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </section>

              {/* Skills (kept) */}
              <section className="mb-12">
                <AnimatedSection>
                  <SectionHeader id="skills" title="Skills" accent="emerald" />
                </AnimatedSection>
                <div className="grid md:grid-cols-2 gap-6">
                  <AnimatedSection>
                    <div className="relative rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-sm overflow-hidden">
                      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.technical.map((s) => (
                          <span key={s} className="px-3 py-1 rounded-full text-sm bg-emerald-50 text-emerald-700 border border-emerald-100">{s}</span>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                  <AnimatedSection>
                    <div className="relative rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-sm overflow-hidden">
                      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Soft</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.soft.map((s) => (
                          <span key={s} className="px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700 border border-indigo-100">{s}</span>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                </div>
              </section>

              {/* Certifications (kept) + NEW Integrations block */}
              <section className="mb-4">
                <AnimatedSection>
                  <SectionHeader id="certifications" title="Certifications" accent="blue" />
                </AnimatedSection>
                <AnimatedSection>
                  <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-sm">
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {certifications.map((cert) => (
                        <li key={cert} className="flex items-center text-gray-800">
                          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 border border-blue-100">
                            <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                            </svg>
                          </span>
                          {cert}
                        </li>
                      ))}
                    </ul>

                    {/* NEW: Selected Integrations & Platforms */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Selected Integrations & Platforms</h4>
                      <div className="flex flex-wrap gap-2">
                        {integrations.map((x) => (
                          <span key={x} className="px-2.5 py-0.5 text-xs rounded-full bg-gray-50 text-gray-700 border border-gray-200">
                            {x}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              </section>

              {/* Footer wave (kept) */}
              <div className="w-full h-16 overflow-hidden mt-12">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-blue-50" />
                </svg>
              </div>
            </div>

            {/* Sticky right rail (kept) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-5 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Navigation</h4>
                  <nav className="grid gap-2 text-sm">
                    <a href="#experience" className="px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-200 text-gray-700">Work Experience</a>
                    <a href="#education" className="px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-200 text-gray-700">Education</a>
                    <a href="#skills" className="px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-200 text-gray-700">Skills</a>
                    <a href="#certifications" className="px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-200 text-gray-700">Certifications</a>
                  </nav>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Open to Opportunities</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Contract, part-time, or full-time roles. Remote-friendly and U.S. relocation.
                  </p>
                  <a href="mailto:cartercedrick35@gmail.com?subject=Opportunity%20for%20Cedrick" className="inline-flex items-center px-3 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm shadow hover:shadow-md transition">
                    Contact Me
                    <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Print styles (kept) */}
      <style>{`
        @media print {
          body { background: #fff !important; }
          .bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.08),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.08),transparent_40%)] { background: #fff !important; }
          .bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] { background: transparent !important; }
          .shadow, .shadow-sm, .shadow-md, .shadow-lg, .backdrop-blur, .backdrop-blur-md { box-shadow: none !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .ring-4, .border, .rounded-2xl, .rounded-lg { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          a[href]:after { content: "" !important; }
          button { display: none !important; }
          aside { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default ResumePage;

