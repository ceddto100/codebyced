import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { getProjects } from '../services/projectsService';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Add scroll progress tracking
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching projects...');
        const response = await getProjects(1, 100); // Increased limit to show more projects
        console.log('Projects API response:', response);
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch projects');
        }
        
        if (!Array.isArray(response.data)) {
          console.error('Invalid response format:', response);
          throw new Error('Invalid response format from API');
        }
        
        // Sort projects by featured status
        const sortedProjects = [...response.data].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        
        console.log('Sorted projects:', sortedProjects);
        setProjects(sortedProjects);
        
        // Extract unique categories from projects
        const uniqueCategories = new Set();
        sortedProjects.forEach(project => {
          if (project.category) {
            uniqueCategories.add(project.category);
          }
        });
        
        setCategories(Array.from(uniqueCategories));
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter projects by category
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { 
      y: 50, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  // Structured data for projects page
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
      "worksFor": {
        "@type": "Organization",
        "name": "ChazzTalk Conversational AI"
      }
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
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "image": project.image,
          "url": project.demoLink || project.githubLink
        }
      }))
    }
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Projects | Cedrick Carter - Software Development Portfolio</title>
        <meta name="description" content="Explore my portfolio of software development projects, including web applications, mobile apps, and automation solutions. Specializing in business automation, API integration, and AI." />
        <meta name="keywords" content="software projects, web development, mobile apps, business automation, API integration, AI solutions, low-code development, workflow optimization, digital transformation, conversational AI" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Projects | Cedrick Carter - Software Development Portfolio" />
        <meta property="og:description" content="Explore my portfolio of software development projects, including web applications, mobile apps, and automation solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://codebyced.com/projects" />
        <meta property="og:image" content="https://codebyced.com/images/projects-header.jpg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Projects | Cedrick Carter - Software Development Portfolio" />
        <meta name="twitter:description" content="Explore my portfolio of software development projects, including web applications, mobile apps, and automation solutions." />
        <meta name="twitter:image" content="https://codebyced.com/images/projects-header.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://codebyced.com/projects" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(projectsStructuredData)}
        </script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Scroll Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 z-50">
          <div 
            className="h-full bg-blue-600 transition-all duration-200"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">Projects</h1>
          <p className="text-xl text-gray-300">Exploring innovation through code and creativity.</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-900/80 text-gray-300 hover:bg-gray-800/80'
            }`}
          >
            All Projects
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                filter === category
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-900/80 text-gray-300 hover:bg-gray-800/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="col-span-full backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-yellow-400 p-4 rounded-lg">
              No projects found in this category.
            </div>
          ) : (
            filteredProjects.map(project => (
              <div 
                key={project._id}
                className="backdrop-blur-sm bg-gray-900/80 rounded-lg shadow-md hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 overflow-hidden border border-gray-800 transform hover:-translate-y-1"
              >
                {project.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-100">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(project.technologies || []).map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/70 text-indigo-300 border border-indigo-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {/* Links */}
                  <div className="flex gap-4 mt-4">
                    {project.demoLink && (
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center group bg-gray-800/50 px-3 py-1.5 rounded-lg hover:bg-gray-800/80 transition-all duration-300"
                      >
                        Live Demo
                        <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center group bg-gray-800/50 px-3 py-1.5 rounded-lg hover:bg-gray-800/80 transition-all duration-300"
                      >
                        GitHub
                        <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ProjectsPage;