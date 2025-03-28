import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIdeas } from '../services/ideasService';

const IdeasPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [allTags, setAllTags] = useState([]);
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
    
    const fetchIdeas = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching ideas...');
        const response = await getIdeas(1, 100); // Increased limit to show more ideas
        console.log('Ideas API response:', response);
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch ideas');
        }
        
        if (!Array.isArray(response.data)) {
          console.error('Invalid response format:', response);
          throw new Error('Invalid response format from API');
        }
        
        // Sort ideas by date
        const sortedIdeas = [...response.data].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log('Sorted ideas:', sortedIdeas);
        setIdeas(sortedIdeas);
        
        // Extract all unique tags
        const tags = new Set();
        sortedIdeas.forEach(idea => {
          if (idea.tags && Array.isArray(idea.tags)) {
            idea.tags.forEach(tag => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching ideas:', err);
        setError(err.message || 'Failed to load ideas. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter ideas by selected tag
  const filteredIdeas = selectedTag 
    ? ideas.filter(idea => idea.tags?.includes(selectedTag))
    : ideas;

  // Card animations
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  // Container animations with staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
      
      <header className="mb-12 text-center md:text-left animate-fade-in-down">
        <div className="relative pb-3 inline-block">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Ideas & Concepts</h1>
          <div className="absolute bottom-0 left-0 w-32 h-1 bg-blue-500 rounded-full"></div>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto md:mx-0 mt-4">
          Explore my collection of ideas, concepts, and thought experiments across various domains.
        </p>
      </header>

      {/* Wave Divider */}
      <div className="w-full h-16 overflow-hidden my-8">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-blue-50"></path>
        </svg>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 relative z-10"
        >
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-300 ${
                selectedTag === null
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white transform hover:scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:-translate-y-1'
              }`}
            >
              All Ideas
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white transform hover:scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:-translate-y-1'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="backdrop-blur-sm bg-white/90 bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md">
          <p>{error}</p>
        </div>
      ) : filteredIdeas.length === 0 ? (
        <div className="backdrop-blur-sm bg-white/90 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg shadow-md">
          <p>No ideas found with the selected filter. Try another tag or check back later!</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredIdeas.map((idea) => (
            <motion.div
              key={idea._id}
              className="backdrop-blur-sm bg-white/90 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2 relative"
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
              <div className="p-6 relative z-10">
                <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text">
                  {idea.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {idea.summary}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {idea.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 transition-all duration-200 hover:bg-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {idea.readMoreLink && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a 
                      href={idea.readMoreLink} 
                      className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 inline-flex items-center group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Explore this idea 
                      <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </a>
                  </div>
                )}
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

export default IdeasPage;