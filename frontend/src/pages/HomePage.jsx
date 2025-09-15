// ...imports unchanged...
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getBlogPosts } from '../services/blogService';
import { getIdeas } from '../services/ideasService';
import { getProjects } from '../services/projectsService';
import { getTools } from '../services/toolsService';
import ShareButton from '../components/ShareButton';
import PageLayout from '../components/PageLayout';

const HomePage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);//

  useEffect(() => {
    // Add scroll progress tracking
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    const fetchData = async () => {
      try {
        const [blogResponse, ideasResponse, projectsResponse, toolsResponse] = await Promise.all([
          getBlogPosts(1, 2),
          getIdeas(1, 3), // Get 3 latest ideas
          getProjects(1, 1, null, true), // Get 1 featured project
          getTools(1, 2) // Get 2 latest tools
        ]);

        if (blogResponse && blogResponse.data) {
          setBlogPosts(blogResponse.data);
        } else {
          // Use mock blog data if API fails
          setBlogPosts([
            {
              id: 1,
              title: "Getting Started with React",
              excerpt: "Learn the basics of React and start building modern web applications.",
              date: new Date().toISOString(),
              coverImage: "/images/hub1.png"
            },
            {
              id: 2,
              title: "Advanced JavaScript Concepts",
              excerpt: "Deep dive into advanced JavaScript concepts every developer should know.",
              date: new Date().toISOString(),
              coverImage: "/images/therise.png"
            }
          ]);
        }
        
        if (ideasResponse && ideasResponse.success) {
          setIdeas(ideasResponse.data.slice(0, 3));
        } else {
          // Use mock ideas data if API fails
          setIdeas([
            {
              id: 1,
              title: "AI-Powered Personal Productivity Assistant",
              summary: "An intelligent assistant that helps manage tasks and boost productivity.",
              tags: ["AI", "Productivity"]
            },
            {
              id: 2,
              title: "Blockchain-Based Digital Identity Management",
              summary: "Secure and decentralized identity management system using blockchain.",
              tags: ["Blockchain", "Security"]
            },
            {
              id: 3,
              title: "Sustainable Tech Practices",
              summary: "Implementing eco-friendly practices in software development.",
              tags: ["Sustainability", "Development"]
            }
          ]);
        }

        if (projectsResponse && projectsResponse.success) {
          setProjects(projectsResponse.data);
        } else {
          // Use mock projects data if API fails
          setProjects([
            {
              id: 1,
              title: "E-commerce Platform",
              description: "A full-featured e-commerce platform with React and Node.js",
              category: "Web Development",
              technologies: ["React", "Node.js", "MongoDB"],
              featured: true,
              imageUrl: "project1.jpg"
            }
          ]);
        }

        if (toolsResponse && toolsResponse.success) {
          setTools(toolsResponse.data.slice(0, 2));
        } else {
          // Use mock tools data if API fails
          setTools([
            {
              id: 1,
              name: "Code Companion",
              description: "AI-powered code review and suggestion tool",
              category: "Development",
              link: "https://example.com/code-companion"
            },
            {
              id: 2,
              name: "Content Generator",
              description: "Smart content creation assistant for various formats",
              category: "Content",
              link: "https://example.com/content-generator"
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content from API, using mock data instead');
        
        // Set mock data when API calls fail
        setBlogPosts([
          {
            id: 1,
            title: "Getting Started with React",
            excerpt: "Learn the basics of React and start building modern web applications.",
            date: new Date().toISOString(),
            coverImage: "/images/hub1.png"
          },
          {
            id: 2,
            title: "Advanced JavaScript Concepts",
            excerpt: "Deep dive into advanced JavaScript concepts every developer should know.",
            date: new Date().toISOString(),
            coverImage: "/images/therise.png"
          }
        ]);
        
        setIdeas([
          {
            id: 1,
            title: "AI-Powered Personal Productivity Assistant",
            summary: "An intelligent assistant that helps manage tasks and boost productivity.",
            tags: ["AI", "Productivity"]
          },
          {
            id: 2,
            title: "Blockchain-Based Digital Identity Management",
            summary: "Secure and decentralized identity management system using blockchain.",
            tags: ["Blockchain", "Security"]
          },
          {
            id: 3,
            title: "Sustainable Tech Practices",
            summary: "Implementing eco-friendly practices in software development.",
            tags: ["Sustainability", "Development"]
          }
        ]);
        
        setProjects([
          {
            id: 1,
            title: "E-commerce Platform",
            description: "A full-featured e-commerce platform with React and Node.js",
            category: "Web Development",
            technologies: ["React", "Node.js", "MongoDB"],
            featured: true,
            imageUrl: "project1.jpg"
          }
        ]);
        
        setTools([
          {
            id: 1,
            name: "Code Companion",
            description: "AI-powered code review and suggestion tool",
            category: "Development",
            link: "https://example.com/code-companion"
          },
          {
            id: 2,
            name: "Content Generator",
            description: "Smart content creation assistant for various formats",
            category: "Content",
            link: "https://example.com/content-generator"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Unknown date';
    }
  };

  const resumeTeaser = {
    title: 'Software Developer',
    company: 'ChazzTalk Conversational AI',
    period: '2025 - Present',
    skills: ['Python', 'JavaScript', 'React', 'Node.js', 'AI/ML']
  };

  const ideasHighlight = [
    'AI-Powered Personal Productivity Assistant',
    'Blockchain-Based Digital Identity Management',
    'Sustainable Tech Practices for Development Teams'
  ];

  const aiTools = [
    {
      id: 1,
      name: 'Code Companion',
      description: 'AI-powered code review and suggestion tool'
    },
    {
      id: 2,
      name: 'Content Generator',
      description: 'Smart content creation assistant for various formats'
    }
  ];

  const honorableMentions = [
    {
      name: 'Tech Innovator Award',
      year: '2024'
    },
    {
      name: 'Open Source Contributor',
      project: 'React Ecosystem'
    }
  ];

  // NEW: Services data (programming generalist offerings)
  // NOTE: "Data & Analytics" card has been removed per request.
  const servicesData = [
    {
      title: 'Web Development & Maintenance',
      color: 'from-blue-600 to-indigo-600',
      items: [
        'Custom Website Development (React, Node.js, Tailwind)',
        'Bug Fixes & Performance Optimization',
        'Website Redesigns / Modernization (responsive upgrades)',
        'Ongoing Maintenance Plans (security, updates, uptime monitoring)'
      ],
      ctaText: 'Start a Website',
      ctaLink: 'services/web-development-maintenance'
    },
    {
      title: 'Workflow & Automation',
      color: 'from-cyan-600 to-blue-600',
      items: [
        'Business Process Automation (Make.com, Zapier, n8n)',
        'Custom API Development (REST/GraphQL)',
        'Web Scraping & Data Pipelines (Python)',
        'CRM Integrations (HubSpot, Salesforce, custom DBs)'
      ],
      ctaText: 'Automate My Business',
      ctaLink: '/services/workflow-automation'
    },
    {
      title: 'AI & Conversational Tools',
      color: 'from-purple-600 to-fuchsia-600',
      items: [
        'Conversational AI Setup (chatbots, voice assistants)',
        'AI-Powered Content Generation (posts, ads, blogs)',
        'Predictive Models (analytics, forecasting)',
        'Knowledge Base Bots (PDF ingestion + QA assistant)'
      ],
      ctaText: 'Build an AI Assistant',
      ctaLink: '/services/ai-conversational-tools'
    },
    {
      title: 'App & Software Development',
      color: 'from-emerald-600 to-teal-600',
      items: [
        'MVP Builds for startups',
        'Mobile App Prototypes (React Native / Flutter-style approach)',
        'Custom Tools & Dashboards (auth, reports)'
      ],
      ctaText: 'Ship an MVP',
      ctaLink: '/services/app-development'
    },
    {
      title: 'Technical Consulting',
      color: 'from-amber-600 to-orange-600',
      items: [
        'Code Reviews & Best Practices',
        'Project Architecture & Scalability',
        'DevOps Support (Git, Docker, CI/CD)',
        'Cloud Deployment (Cloud Run, Render, AWS, Cloudflare)'
      ],
      ctaText: 'Book a Consult',
      ctaLink: '/services/technical-consulting'
    },
    {
      title: 'SEO Boost',
      color: 'from-rose-600 to-pink-600', // keeps your existing gradient style
      items: [
        'Technical SEO Audit (Core Web Vitals, crawlability)',
        'On-Page Optimization (titles, meta, headings, internal links)',
        'Structured Data & Sitemap Fixes (Schema.org, XML, robots.txt)'
      ],
      ctaText: 'Boost My SEO',
      ctaLink: '/services/seo-boost'
    }

  ];

  // Structured data for homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Cedrick Carter - Software Developer & Business Automation Expert",
    "description": "Explore my projects, ideas, and journey through the world of technology and development. Specializing in business automation, API integration, and AI solutions.",
    "url": "https://codebyced.com",
    "author": {
      "@type": "Person",
      "name": "Cedrick Carter",
      "jobTitle": "Software Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "ChazzTalk Conversational AI"
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "Blog",
            "name": "Latest Blog Posts",
            "url": "https://codebyced.com/blog"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "Project",
            "name": "Featured Projects",
            "url": "https://codebyced.com/projects"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "Idea",
            "name": "Latest Ideas",
            "url": "https://codebyced.com/ideas"
          }
        }
      ]
    }
  };

  return (
    <PageLayout>
      <Helmet>
        <title>CodeByCed | Software Development & AI Solutions</title>
        <meta name="description" content="Welcome to my digital space where I share my journey in software development, AI solutions, and innovative tech projects." />
        {/* Optional: add structured data */}
        <script type="application/ld+json">
          {JSON.stringify(homepageStructuredData)}
        </script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8 relative">
        {/* Scroll Progress Bar */}
        <div className="fixed top-16 left-0 w-full h-1 z-40">
          <div 
            className="h-full bg-blue-600 transition-all duration-200"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
        
        {/* Hero Section with Video Background and Profile Picture */}
        <section className="mb-20 relative animate-fade-in-down rounded-xl overflow-hidden shadow-md">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <video 
              className="absolute min-w-full min-h-full object-cover object-center opacity-60"
              style={{ 
                objectPosition: "center 50%",
                transform: "translateY(-25%)"
              }}
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src="background.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 backdrop-blur-sm"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Picture */}
              <div className="relative animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform duration-400">
                  <img
                    src="profilepic.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 shadow-md">
                  <svg 
                    className="w-4 h-4 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                </div>
              </div>
              
              {/* Welcome Text */}
              <div className="md:text-left text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-100">
                  Welcome to My Digital Space
                </h1>
                <p className="text-xl text-gray-300">
                  Explore my projects, ideas, and journey through the world of technology and development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================== NEW SERVICES SECTION (inserted above Blog) =================== */}
        <section id="services" className="mb-20 backdrop-blur-sm bg-gray-900/80 p-8 rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 border border-gray-800 relative overflow-hidden">
          {/* Subtle gradient blobs */}
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10">
            <div className="relative pb-3">
              <h2 className="text-2xl font-bold text-gray-100 mb-1">Services</h2>
              <div className="absolute bottom-0 left-0 w-24 h-1 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/contact"
                className="bg-blue-700 hover:bg-blue-600 hover:shadow-cyan-900/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                Get a Quote
              </Link>
              <Link
                to="/projects"
                className="bg-gray-800 hover:bg-gray-700 text-gray-100 px-5 py-2.5 rounded-lg border border-gray-700 transition-all duration-300"
              >
                See Past Work
              </Link>
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {servicesData.map((svc, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-lg border border-gray-800 backdrop-blur-md bg-gray-900/70 p-6 hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 group"
              >
                <div className={`absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-br ${svc.color} opacity-20 rounded-full blur-2xl transition-all duration-300 group-hover:opacity-30`} />
                <h3 className="text-xl font-semibold text-gray-100 mb-3">{svc.title}</h3>
                <ul className="space-y-2 mb-4">
                  {svc.items.map((item, i) => (
                    <li key={i} className="text-gray-300 flex">
                      <span className="mr-2 text-blue-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={svc.ctaLink}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group"
                >
                  {svc.ctaText}
                  <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
              </div>
            ))}
          </div>

          {/* Package hint */}
          <div className="mt-8 text-sm text-gray-400">
            Prefer bundles? Ask about <span className="text-indigo-300 font-medium">Starter</span>, <span className="text-indigo-300 font-medium">Growth</span>, and <span className="text-indigo-300 font-medium">Pro</span> tiers—designed for flexibility as your needs scale.
          </div>
        </section>
        {/* ================= End Services Section ================= */}

        {/* Blog Section */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <div className="relative pb-3">
              <h2 className="text-2xl font-bold text-gray-100">Latest from the Blog</h2>
              <div className="absolute bottom-0 left-0 w-20 h-1 bg-blue-500 rounded-full"></div>
            </div>
            <Link 
              to="/blog" 
              className="bg-blue-700 hover:bg-blue-600 hover:shadow-cyan-900/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              View All Blog Posts
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="col-span-2 flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="col-span-2 backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-red-400 p-4 rounded-lg">
                {error}
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="col-span-2 backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-yellow-400 p-4 rounded-lg">
                No blog posts found. Check back soon for new content!
              </div>
            ) : (
              blogPosts.map(post => (
                <div key={post._id} className="backdrop-blur-sm bg-gray-900/80 rounded-lg shadow-md hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 overflow-hidden border border-gray-800 transform hover:-translate-y-1 relative">
                  {/* Share Button */}
                  <div className="absolute top-2 right-2 z-10">
                    <ShareButton 
                      url={`${window.location.origin}/blog/${post._id}`}
                      title={post.title}
                      description={post.excerpt}
                    />
                  </div>
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.coverImage} 
                        alt={post.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-sm text-gray-400 mb-2">{formatDate(post.date)}</p>
                    <h3 className="text-xl font-semibold mb-2 text-gray-100 hover:text-blue-400 transition-colors duration-200">{post.title}</h3>
                    <p className="text-gray-300 mb-4">{post.excerpt}</p>
                    <Link 
                      to={`/blog/${post._id}`} 
                      className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center group"
                    >
                      Read more 
                      <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Resume Section */}
        <section className="mb-20 backdrop-blur-sm bg-gray-900/80 p-8 rounded-lg shadow-lg hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 border border-gray-800 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="resumecover.png" 
              alt="Resume Background" 
              className="w-full h-full object-cover opacity-30"
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gray-900/80"></div>
          </div>
          
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-xl animate-float" style={{ animationDuration: '15s' }}></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-indigo-500/10 rounded-full filter blur-xl animate-pulse" style={{ animationDuration: '20s' }}></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
            <div className="relative pb-3">
              <h2 className="text-2xl font-bold text-gray-100 mb-1">Resume at a Glance</h2>
              <div className="absolute bottom-0 left-0 w-20 h-1 bg-blue-500 rounded-full"></div>
            </div>
            <Link 
              to="/resume" 
              className="bg-blue-700 hover:bg-blue-600 hover:shadow-cyan-900/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              View Full Resume
            </Link>
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">{resumeTeaser.title}</h3>
            <p className="text-gray-300 mb-2">{resumeTeaser.company} | {resumeTeaser.period}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {resumeTeaser.skills.map((skill, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900/70 text-indigo-300 border border-indigo-700 transition-all duration-200 hover:bg-indigo-800/70">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Ideas Section */}
        <section className="mb-20 backdrop-blur-sm bg-gray-900/80 p-8 rounded-lg shadow-lg hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 border border-gray-800 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="GeoffreyHinton.png" 
              alt="Geoffrey Hinton Background" 
              className="w-full h-full object-cover opacity-50"
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gray-900/60"></div>
          </div>
          
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-xl animate-float" style={{ animationDuration: '15s' }}></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-indigo-500/10 rounded-full filter blur-xl animate-pulse" style={{ animationDuration: '20s' }}></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
            <div className="relative pb-3">
              <h2 className="text-2xl font-bold text-gray-100 mb-1">Latest Ideas</h2>
              <div className="absolute bottom-0 left-0 w-20 h-1 bg-indigo-500 rounded-full"></div>
            </div>
            <Link 
              to="/ideas" 
              className="bg-indigo-700 hover:bg-indigo-600 hover:shadow-indigo-900/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              Explore More Ideas
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-12 relative z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-red-400 p-4 rounded-lg relative z-10">
              {error}
            </div>
          ) : ideas.length === 0 ? (
            <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-yellow-400 p-4 rounded-lg relative z-10">
              No ideas found. Check back soon for new content!
            </div>
          ) : (
            <ul className="space-y-4 relative z-10">
              {ideas.map((idea, index) => (
                <li key={idea._id} className="flex items-start p-4 hover:bg-gray-800/50 rounded-lg transition-colors duration-200">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white mr-4 shadow-md">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-100 hover:text-blue-400 transition-colors duration-200">{idea.title}</h3>
                    <p className="text-gray-300 mt-1">{idea.summary}</p>
                    {idea.tags && idea.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {idea.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/70 text-indigo-300 border border-indigo-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Projects Section */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="relative pb-3">
              <h2 className="text-2xl font-bold text-gray-100 mb-1">Featured Project</h2>
              <div className="absolute bottom-0 left-0 w-20 h-1 bg-blue-500 rounded-full"></div>
            </div>
            <Link 
              to="/projects" 
              className="bg-blue-700 hover:bg-blue-600 hover:shadow-cyan-900/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              View All Projects
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4">
              No featured projects available at the moment.
            </div>
          ) : (
            <div className="backdrop-blur-sm bg-gray-900/80 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-800 transform hover:-translate-y-1">
              {/* Project Image */}
              <div className="h-56 overflow-hidden relative">
                {projects[0].image ? (
                  <img 
                    src={projects[0].image} 
                    alt={projects[0].title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                {projects[0].category && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
                      {projects[0].category}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Project Content */}
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text">{projects[0].title}</h3>
                <p className="text-gray-600 mb-4">{projects[0].description}</p>
                <div className="flex flex-wrap gap-2">
                  {projects[0].techStack?.map((tech, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 transition-all duration-200 hover:bg-blue-200">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  {projects[0].githubLink && (
                    <a 
                      href={projects[0].githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium mr-6 inline-flex items-center group"
                    >
                      GitHub Repository 
                      <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </a>
                  )}
                  {projects[0].demoLink && (
                    <a 
                      href={projects[0].demoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center group"
                    >
                      Live Demo 
                      <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* AI Tools Section */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="relative pb-3">
              <h2 className="text-2xl font-bold text-gray-100 mb-1">AI Tools</h2>
              <div className="absolute bottom-0 left-0 w-20 h-1 bg-indigo-500 rounded-full"></div>
            </div>
            <Link 
              to="/tools" 
              className="bg-indigo-700 hover:bg-indigo-600 hover:shadow-indigo-900/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              Explore All Tools
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              {error}
            </div>
          ) : tools.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4">
              No tools found. Check back soon for new content!
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map(tool => (
                <div key={tool._id} className="backdrop-blur-sm bg-gray-900/80 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-800 transform hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full"></div>
                  <div className="flex items-center mb-4 relative z-10">
                    {tool.logo ? (
                      <div className="h-14 w-14 flex-shrink-0 mr-4 rounded-full overflow-hidden shadow-md border-2 border-indigo-100">
                        <img
                          src={tool.logo}
                          alt={`${tool.name} logo`}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4 shadow-md">
                        <span className="text-white font-semibold text-lg">
                          {tool.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">{tool.name}</h3>
                      {tool.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {tool.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 relative z-10">{tool.description}</p>
                  <a 
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center group relative z-10"
                  >
                    Try it out
                    <svg 
                      className="ml-1 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                      />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Honorable Mentions Section */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="relative pb-3">
              <h2 className="text-2xl font-bold text-gray-100 mb-1">Honorable Mentions</h2>
              <div className="absolute bottom-0 left-0 w-20 h-1 bg-blue-500 rounded-full"></div>
            </div>
            <a 
              href="/mentions" 
              className="bg-blue-700 hover:bg-blue-600 hover:shadow-cyan-900/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              See All Mentions
            </a>
          </div>
          <div className="backdrop-blur-sm bg-gray-900/80 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-800 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/5 rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {honorableMentions.map((mention, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50/50 rounded-r-lg hover:bg-blue-50 transition-colors duration-200">
                  <h3 className="font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text">{mention.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {mention.year ? `Year: ${mention.year}` : `Project: ${mention.project}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default HomePage;


