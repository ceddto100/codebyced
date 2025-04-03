import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getBlogPosts } from '../services/blogService';
import { getIdeas } from '../services/ideasService';
import { getProjects } from '../services/projectsService';
import { getTools } from '../services/toolsService';

const HomePage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
              coverImage: "blog1.jpg"
            },
            {
              id: 2,
              title: "Advanced JavaScript Concepts",
              excerpt: "Deep dive into advanced JavaScript concepts every developer should know.",
              date: new Date().toISOString(),
              coverImage: "blog2.jpg"
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
            coverImage: "blog1.jpg"
          },
          {
            id: 2,
            title: "Advanced JavaScript Concepts",
            excerpt: "Deep dive into advanced JavaScript concepts every developer should know.",
            date: new Date().toISOString(),
            coverImage: "blog2.jpg"
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
    <>
      <Helmet>
        <title>Cedrick Carter - Software Developer & Business Automation Expert</title>
        <meta name="description" content="Software developer specializing in business automation, API integration, and AI solutions. Explore my projects, ideas, and journey through technology." />
        <meta name="keywords" content="software developer, business automation, API integration, AI solutions, low-code development, workflow optimization, digital transformation, conversational AI, technology consulting" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Cedrick Carter - Software Developer & Business Automation Expert" />
        <meta property="og:description" content="Software developer specializing in business automation, API integration, and AI solutions. Explore my projects and ideas." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://codebyced.com" />
        <meta property="og:image" content="https://codebyced.com/images/profile.jpg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cedrick Carter - Software Developer & Business Automation Expert" />
        <meta name="twitter:description" content="Software developer specializing in business automation, API integration, and AI solutions. Explore my projects and ideas." />
        <meta name="twitter:image" content="https://codebyced.com/images/profile.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://codebyced.com" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(homepageStructuredData)}
        </script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8 relative">
        {/* Scroll Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 z-50">
          <div 
            className="h-full bg-blue-600 transition-all duration-200"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Hero Section with Video Background and Profile Picture */}
<section className="mb-20 relative animate-fade-in-down rounded-xl overflow-hidden shadow-md">
  {/* Video Background */}
  <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
    <video 
      className="absolute min-w-full min-h-full object-cover object-center"
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
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 backdrop-blur-sm"></div>
  </div>
  
  {/* Content */}
  <div className="relative z-10 p-8">
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
      {/* Profile Picture */}
      <div className="relative animate-float" style={{ animationDelay: '0.5s' }}>
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg transform hover:scale-105 transition-transform duration-400">
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Welcome to My Digital Space
        </h1>
        <p className="text-xl text-white/90">
          Explore my projects, ideas, and journey through the world of technology and development.
        </p>
      </div>
    </div>
  </div>
      </section>

      {/* Blog Section */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <div className="relative pb-3">
          <h2 className="text-2xl font-bold text-gray-800">Latest from the Blog</h2>
              <div className="absolute bottom-0 left-0 w-20 h-1 bg-blue-500 rounded-full"></div>
            </div>
            <Link 
              to="/blog" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
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
              <div className="col-span-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                {error}
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="col-span-2 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4">
                No blog posts found. Check back soon for new content!
              </div>
            ) : (
              blogPosts.map(post => (
                <div key={post._id} className="backdrop-blur-sm bg-white/90 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1">
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
                    <p className="text-sm text-gray-500 mb-2">{formatDate(post.date)}</p>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-600 transition-colors duration-200">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <Link 
                      to={`/blog/${post._id}`} 
                      className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center group"
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

        {/* Wave Divider */}
        <div className="w-full h-16 overflow-hidden my-8">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-blue-50"></path>
          </svg>
        </div>

      {/* Resume Section */}
<section className="mb-20 backdrop-blur-sm bg-white/40 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0 z-0">
    <img 
      src="resumecover.png" 
      alt="Resume Background" 
      className="w-full h-full object-cover opacity-75"
    />
    {/* Overlay to ensure text readability */}
    <div className="absolute inset-0 bg-white/60"></div>
  </div>
  
  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full"></div>
  <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/5 rounded-full"></div>
  
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
    <div className="relative pb-3">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Resume at a Glance</h2>
      <div className="absolute bottom-0 left-0 w-20 h-1 bg-blue-500 rounded-full"></div>
    </div>
          <a 
            href="/resume" 
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            View Full Resume
          </a>
        </div>
  <div className="relative z-10">
    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text">{resumeTeaser.title}</h3>
          <p className="text-gray-600 mb-2">{resumeTeaser.company} | {resumeTeaser.period}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {resumeTeaser.skills.map((skill, index) => (
        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 transition-all duration-200 hover:bg-blue-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
        {/* Ideas Section */}
        <section className="mb-20 backdrop-blur-sm bg-white/80 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/5 rounded-full"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
            <div className="relative pb-3">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Latest Ideas</h2>
              <div className="absolute bottom-0 left-0 w-20 h-1 bg-indigo-500 rounded-full"></div>
            </div>
            <Link 
              to="/ideas" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            Explore More Ideas
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-12 relative z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 relative z-10">
              {error}
            </div>
          ) : ideas.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 relative z-10">
              No ideas found. Check back soon for new content!
        </div>
          ) : (
            <ul className="space-y-4 relative z-10">
              {ideas.map((idea, index) => (
                <li key={idea._id} className="flex items-start p-4 hover:bg-blue-50/50 rounded-lg transition-colors duration-200">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white mr-4 shadow-md">
                {index + 1}
              </span>
                  <div>
                    <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200">{idea.title}</h3>
                    <p className="text-gray-600 mt-1">{idea.summary}</p>
                    {idea.tags && idea.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {idea.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
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

        {/* Wave Divider */}
        <div className="w-full h-16 overflow-hidden my-8 transform rotate-180">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-indigo-50"></path>
          </svg>
        </div>

      {/* Projects Section */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="relative pb-3">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Featured Project</h2>
              <div className="absolute bottom-0 left-0 w-20 h-1 bg-blue-500 rounded-full"></div>
            </div>
            <Link 
              to="/projects" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
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
            <div className="backdrop-blur-sm bg-white/90 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1">
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
              <h2 className="text-2xl font-bold text-gray-800 mb-1">AI Tools</h2>
              <div className="absolute bottom-0 left-0 w-20 h-1 bg-indigo-500 rounded-full"></div>
            </div>
            <Link 
              to="/tools" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
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
                <div key={tool._id} className="backdrop-blur-sm bg-white/90 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 relative overflow-hidden">
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
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Honorable Mentions</h2>
              <div className="absolute bottom-0 left-0 w-20 h-1 bg-blue-500 rounded-full"></div>
            </div>
          <a 
            href="/mentions" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            See All Mentions
          </a>
        </div>
          <div className="backdrop-blur-sm bg-white/90 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
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
        
        {/* Footer Wave Divider */}
        <div className="w-full h-16 overflow-hidden mt-12">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-blue-50"></path>
          </svg>
        </div>
    </div>
    </>
  );
};

export default HomePage;
