import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { getProjects } from '../services/projectsService';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { CardSkeletonGrid } from '../components/Skeleton';

const CLAUDE_ARTIFACT_URL = "https://claude.site/public/artifacts/6358a80a-75eb-4ee0-ae85-5ebc986fe2a3/embed";
const KELLY_APP_URL = "https://kelly-s-criterion-calculator.vercel.app/";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await getProjects(1, 100);
        if (!response?.success) throw new Error(response?.error || 'Failed to fetch projects');
        if (!Array.isArray(response?.data)) throw new Error('Invalid response format from API');

        const sortedProjects = [...response.data].sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );
        setProjects(sortedProjects);

        const uniqueCategories = Array.from(
          new Set(sortedProjects.filter(p => p.category).map(p => p.category))
        );
        setCategories(uniqueCategories);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProjects = useMemo(
    () => (filter === 'all' ? projects : projects.filter(p => p.category === filter)),
    [projects, filter]
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
      transition: { type: 'spring', damping: 12, stiffness: 100 }
    }
  };

  // Structured data
  const projectsStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CodeByCed Projects",
    "description": "A collection of web development, mobile apps, and technology projects showcasing expertise in business automation, API integration, and AI solutions.",
    "url": "https://codebyced.com/projects",
    "author": {
      "@type": "Person",
      "name": "Cedrick Carter",
      "jobTitle": "Software Developer",
      "worksFor": { "@type": "Organization", "name": "ChazzTalk Conversational AI" }
    },
    "about": {
      "@type": "Thing",
      "name": "Software Development Projects",
      "description": "Portfolio of technology projects including web applications, mobile apps, and automation solutions."
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": projects.map((project, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": project.title,
          "description": project.description,
          "applicationCategory": project.category,
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "image": project.image,
          "url": project.demoLink || project.githubLink
        }
      }))
    },
    "hasPart": [
      {
        "@type": "WebApplication",
        "name": "Kelly’s Criterion Calculator",
        "url": KELLY_APP_URL,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web"
      },
      {
        "@type": "WebApplication",
        "name": "My App Hub — Claude Artifact",
        "url": CLAUDE_ARTIFACT_URL,
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web"
      }
    ]
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Projects | Cedrick Carter - Software Development Portfolio</title>
        <meta
          name="description"
          content="Explore my portfolio of software development projects, including web applications, mobile apps, and automation solutions. Specializing in business automation, API integration, and AI."
        />
        <meta
          name="keywords"
          content="software projects, web development, mobile apps, business automation, API integration, AI solutions, low-code development, workflow optimization, digital transformation, conversational AI"
        />
        {/* Open Graph */}
        <meta property="og:title" content="Projects | Cedrick Carter - Software Development Portfolio" />
        <meta property="og:description" content="Explore my portfolio of software development projects, including web applications, mobile apps, and automation solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://codebyced.com/projects" />
        <meta property="og:image" content="https://codebyced.com/images/projects-header.jpg" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Projects | Cedrick Carter - Software Development Portfolio" />
        <meta name="twitter:description" content="Explore my portfolio of software development projects, including web applications, mobile apps, and automation solutions." />
        <meta name="twitter:image" content="https://codebyced.com/images/projects-header.jpg" />
        {/* Canonical */}
        <link rel="canonical" href="https://codebyced.com/projects" />
        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(projectsStructuredData)}</script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Scroll Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 z-50">
          <div
            className="h-full bg-blue-600 transition-all duration-200"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-100">Projects</h1>
          <p className="text-xl text-gray-100 text-improved">Exploring innovation through code and creativity.</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              filter === 'all'
                ? 'bg-brand-primary text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-900/80 text-gray-100 hover:bg-gray-800/80 border border-gray-700'
            }`}
          >
            All Projects
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                filter === category
                  ? 'bg-brand-primary text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-900/80 text-gray-100 hover:bg-gray-800/80 border border-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <CardSkeletonGrid count={6} type="project" />
        ) : error ? (
          <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-red-400 p-4 rounded-xl">
            {error}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-yellow-400 p-4 rounded-xl">
            No projects found in this category.
          </div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map(project => (
              <motion.div
                key={project._id}
                variants={cardVariants}
                onClick={() => {
                  if (project.demoLink) {
                    window.open(project.demoLink, '_blank');
                  } else if (project.githubLink) {
                    window.open(project.githubLink, '_blank');
                  }
                }}
                className="clickable-card backdrop-blur-sm bg-gray-900/80 rounded-xl shadow-md hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 overflow-hidden border border-gray-800 group"
              >
                {project.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-100 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                  <p className="text-gray-100 mb-4 text-improved">{project.description}</p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(project.technologies || []).map((tech, index) => (
                      <span
                        key={`${project._id}-tech-${index}`}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/70 text-indigo-300 border border-indigo-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links - visual only, click handled by card */}
                  <div className="flex gap-4 mt-4">
                    {project.demoLink && (
                      <span className="text-blue-400 font-medium inline-flex items-center">
                        Live Demo
                        <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </span>
                    )}
                    {project.githubLink && (
                      <span className="text-blue-400 font-medium inline-flex items-center">
                        GitHub
                        <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ===== My App Hub (Kelly calculator above QR embed) ===== */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-100">My App Hub</h2>
            <span className="text-sm text-gray-400">Live tools & gadgets</span>
          </div>

          {/* Kelly’s Criterion Calculator (iframe) */}
          <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-100">Kelly’s Criterion Calculator</span>
                <span className="text-sm text-gray-400">
                   AI probability estimator & bankroll management with Kelly's Criterion
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={KELLY_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-sm px-3 py-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-800/90 transition-all"
                >
                  Open ↗
                </a>
              </div>
            </div>

            {/* Responsive iframe (16:9) */}
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={KELLY_APP_URL}
                title="Kelly’s Criterion Calculator"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0, overflow: 'hidden' }}
                allow="clipboard-read; clipboard-write"
              />
            </div>

            {/* Footer / Notes */}
            <div className="px-4 sm:px-6 py-3 border-t border-gray-800 text-gray-400 text-xs">
               To view full screen tap open↗.
            </div>
          </div>

          {/* QR Code Generator (existing Claude Artifact card) */}
          <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-100">QR Code Generator</span>
                <span className="text-sm text-gray-400">
                  Create a QR code that links to a URL or saves contact info directly.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={CLAUDE_ARTIFACT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-sm px-3 py-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-800/90 transition-all"
                >
                  Open ↗
                </a>
              </div>
            </div>

            {/* Cover Photo Fallback */}
            <div className="relative">
              <img
                src="/images/qr-code.png" // replace with your uploaded image path
                alt="QR Code Generator Cover"
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Footer / Notes */}
            <div className="px-4 sm:px-6 py-3 border-t border-gray-800 text-gray-400 text-xs">
              Click “Open ↗” to generate your personal QR code.
            </div>
          </div>
        </section>
        {/* ===== /My App Hub ===== */}
      </div>
    </PageLayout>
  );
};

export default ProjectsPage;

