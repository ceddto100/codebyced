import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ToolsPage = () => {
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
    
    const fetchTools = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/tools');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Check if the response has the expected structure
        if (!result.success || !result.data) {
          throw new Error('Invalid response format from API');
        }
        
        setTools(result.data);
        
        // Extract unique categories
        const uniqueCategories = new Set();
        result.data.forEach(tool => {
          if (tool.category) {
            uniqueCategories.add(tool.category);
          }
        });
        
        setCategories(Array.from(uniqueCategories));
        setError(null);
      } catch (err) {
        console.error('Error fetching tools:', err);
        setError('Failed to load tools. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter tools by category and search query
  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = 
      searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
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
      
      <header className="mb-12 text-center animate-fade-in-down">
        <div className="relative pb-3 inline-block">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Recommended Tools</h1>
          <div className="absolute bottom-0 left-0 right-0 w-32 h-1 bg-blue-500 rounded-full mx-auto"></div>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
          A curated collection of AI tools and developer resources I find valuable.
        </p>
      </header>

      {/* Wave Divider */}
      <div className="w-full h-16 overflow-hidden my-8">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-blue-50"></path>
        </svg>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-10 flex flex-col md:flex-row gap-6 justify-between relative z-10">
        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 hover:shadow"
          />
          <svg
            className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white transform hover:scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:-translate-y-1'
            }`}
          >
            All Tools
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white transform hover:scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:-translate-y-1'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="backdrop-blur-sm bg-white/90 bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md">
          <p>{error}</p>
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="backdrop-blur-sm bg-white/90 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg shadow-md">
          <p>No tools found matching your criteria. Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredTools.map((tool) => (
            <motion.div
              key={tool.id}
              className="backdrop-blur-sm bg-white/90 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2 relative"
              variants={cardVariants}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
              <div className="p-6 relative z-10">
                <div className="flex items-center mb-4">
                  {tool.logo ? (
                    <div className="h-14 w-14 flex-shrink-0 mr-4 rounded-full overflow-hidden shadow-md border-2 border-blue-100">
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
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text">{tool.name}</h2>
                    {tool.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {tool.category}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{tool.description}</p>
                
                {tool.features && tool.features.length > 0 && (
                  <ul className="mb-4 space-y-2">
                    {tool.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <svg 
                          className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 group"
                  >
                    Visit Website
                    <svg 
                      className="ml-1 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
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
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Footer Wave Divider */}
      <div className="w-full h-16 overflow-hidden mt-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-indigo-50"></path>
        </svg>
      </div>
    </div>
  );
};

export default ToolsPage;