import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { getProjects } from '../services/projectsService';
import { Link } from 'react-router-dom';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
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
    <>
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
        <motion.header 
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-3">My Projects</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A collection of my work across web development, mobile apps, and more.
          </p>
        </motion.header>

        {/* Filter buttons */}
        {categories.length > 0 && (
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Projects
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filter === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
            <p>{error}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded shadow-md">
            <p>No projects found in this category. Please try another filter.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                variants={cardVariants}
                whileHover={{ 
                  y: -10, 
                  transition: { duration: 0.2 } 
                }}
              >
                {/* Project Image */}
                <div className="h-48 overflow-hidden relative">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  {project.category && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {project.category}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Project Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h2>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  {/* Tech Stack */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Links */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-100">
                    {project.githubLink && (
                      <a 
                        href={project.githubLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        GitHub
                      </a>
                    )}
                    
                    {project.demoLink && (
                      <a 
                        href={project.demoLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ProjectsPage;