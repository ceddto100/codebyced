import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import PageLayout from '../components/PageLayout';
import { getApiUrl } from '../utils/api';

const ToolsPage = () => {
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
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
        const response = await fetch(getApiUrl('/tools'));
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Tools API response:', result);
        
        // Log the first tool to see its structure
        if (result.data && result.data.length > 0) {
          console.log('First tool structure:', result.data[0]);
        }
        
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
    const matchesCategory = filter === 'all' || tool.category === filter;
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
    <PageLayout>
      <Helmet>
        <title>AI Tools & Automation</title>
        <meta name="description" content="Empowering productivity through intelligent automation." />
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
          <h1 className="text-4xl font-bold mb-4 text-gray-100">AI Tools & Automation</h1>
          <p className="text-xl text-gray-300">Empowering productivity through intelligent automation.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-900/80 text-gray-300 hover:bg-gray-800/80'
            }`}
          >
            All Tools
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

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="col-span-full backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="col-span-full backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-yellow-400 p-4 rounded-lg">
              No tools found in this category.
            </div>
          ) : (
            filteredTools.map(tool => (
              <div
                key={tool._id}
                className="backdrop-blur-sm bg-gray-900/80 rounded-lg shadow-md hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 border border-gray-800 overflow-hidden"
              >
                {tool.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={tool.image} 
                      alt={tool.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-100">{tool.name}</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/70 text-indigo-300 border border-indigo-700">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{tool.description}</p>
                  
                  {/* Features */}
                  {tool.features && tool.features.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {/* Links */}
                  <div className="flex gap-4 mt-4">
                    {tool.link && (
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center group bg-gray-800/50 px-3 py-1.5 rounded-lg hover:bg-gray-800/80 transition-all duration-300"
                      >
                        Try it out
                        <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </a>
                    )}
                    {tool.docs && (
                      <a
                        href={tool.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center group bg-gray-800/50 px-3 py-1.5 rounded-lg hover:bg-gray-800/80 transition-all duration-300"
                      >
                        Documentation
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

export default ToolsPage
