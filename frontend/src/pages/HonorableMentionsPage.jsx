import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMentions } from '../services/mentionsService';

const HonorableMentionsPage = () => {
  const [honors, setHonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeYear, setActiveYear] = useState('all');
  const [years, setYears] = useState([]);
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
    
    const fetchHonors = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching honorable mentions...');
        const response = await getMentions();
        console.log('Mentions API response:', response);
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch honorable mentions');
        }
        
        if (!Array.isArray(response.data)) {
          console.error('Invalid response format:', response);
          throw new Error('Invalid response format from API');
        }
        
        // Sort honors by year
        const sortedHonors = [...response.data].sort((a, b) => b.year - a.year);
        
        console.log('Sorted honors:', sortedHonors);
        setHonors(sortedHonors);
        
        // Extract unique years if they exist
        if (sortedHonors.length > 0 && sortedHonors[0].year) {
          const uniqueYears = [...new Set(sortedHonors.map(honor => honor.year))].sort((a, b) => b - a); // Sort descending
          setYears(uniqueYears);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching honorable mentions:', err);
        setError(err.message || 'Failed to load honorable mentions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHonors();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter honors by year if available
  const filteredHonors = activeYear === 'all' 
    ? honors
    : honors.filter(honor => honor.year === activeYear);

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

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div 
          className="h-full bg-blue-600 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
      
      {/* Static Background Elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
      
      {/* Wave Divider - Top */}
      <div className="w-full h-16 overflow-hidden mb-12">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-blue-50"></path>
        </svg>
      </div>
      
      <header className="mb-10 text-center relative z-10 animate-fade-in-down">
        <div className="relative pb-3 inline-block">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Honorable Mentions</h1>
          <div className="absolute bottom-0 left-0 right-0 w-32 h-1 bg-blue-500 rounded-full mx-auto"></div>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
          Recognition, awards, and acknowledgments that I've received throughout my journey.
        </p>
      </header>

      {/* Year filter - only show if years are available */}
      {years.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-10 relative z-10"
        >
          <button
            onClick={() => setActiveYear('all')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-300 ${
              activeYear === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white transform hover:scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:-translate-y-1'
            }`}
          >
            All Years
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-300 ${
                activeYear === year
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white transform hover:scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:-translate-y-1'
              }`}
            >
              {year}
            </button>
          ))}
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="backdrop-blur-sm bg-white/90 bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md">
          <p>{error}</p>
        </div>
      ) : filteredHonors.length === 0 ? (
        <div className="backdrop-blur-sm bg-white/90 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg shadow-md">
          <p>No honorable mentions found for the selected filter.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {filteredHonors.map((honor) => (
            <motion.div
              key={honor.id}
              variants={itemVariants}
              className="backdrop-blur-sm bg-white/90 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/5 rounded-full"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text">{honor.title}</h2>
                  {honor.organization && (
                    <p className="text-blue-600">{honor.organization}</p>
                  )}
                  {honor.year && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <svg className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {honor.year}
                    </p>
                  )}
                </div>
                
                {honor.image && (
                  <div className="w-16 h-16 flex-shrink-0 mb-4 md:mb-0 rounded-full overflow-hidden shadow-md border-2 border-indigo-100">
                    <img 
                      src={honor.image} 
                      alt={`${honor.title} badge or icon`}
                      className="w-full h-full object-contain" 
                    />
                  </div>
                )}
              </div>
              
              {honor.description && (
                <p className="text-gray-600 mt-3 relative z-10">{honor.description}</p>
              )}
              
              {honor.link && (
                <div className="mt-4 pt-2 border-t border-gray-100 relative z-10">
                  <a 
                    href={honor.link}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center group"
                  >
                    View Details
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Footer Wave Divider */}
      <div className="w-full h-16 overflow-hidden mt-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-blue-50"></path>
        </svg>
      </div>
    </div>
  );
};

export default HonorableMentionsPage;