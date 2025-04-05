import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { getMentions } from '../services/mentionsService';
import PageLayout from '../components/PageLayout';

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

  // Structured data for honorable mentions page
  const mentionsStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Honorable Mentions | Cedrick Carter",
    "description": "Recognition, awards, and acknowledgments received throughout my journey in software development and technology innovation.",
    "url": "https://codebyced.com/honorable-mentions",
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
      "name": "Professional Recognition",
      "description": "Awards, certifications, and acknowledgments in software development and technology."
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": honors.map((honor, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Award",
          "name": honor.title,
          "description": honor.description,
          "awardedBy": honor.organization,
          "dateAwarded": honor.year ? `${honor.year}-01-01` : undefined,
          "image": honor.image,
          "url": honor.link
        }
      }))
    }
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Honorable Mentions | Cedrick Carter - Professional Recognition</title>
        <meta name="description" content="Explore my professional recognition, awards, and acknowledgments in software development, business automation, and technology innovation." />
        <meta name="keywords" content="professional recognition, awards, certifications, software development, business automation, API integration, AI solutions, technology innovation" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Honorable Mentions | Cedrick Carter - Professional Recognition" />
        <meta property="og:description" content="Explore my professional recognition, awards, and acknowledgments in software development and technology innovation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://codebyced.com/honorable-mentions" />
        <meta property="og:image" content="https://codebyced.com/images/mentions-header.jpg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Honorable Mentions | Cedrick Carter - Professional Recognition" />
        <meta name="twitter:description" content="Explore my professional recognition, awards, and acknowledgments in software development and technology innovation." />
        <meta name="twitter:image" content="https://codebyced.com/images/mentions-header.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://codebyced.com/honorable-mentions" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(mentionsStructuredData)}
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
          <h1 className="text-4xl font-bold mb-4 text-gray-100">Honorable Mentions</h1>
          <p className="text-xl text-gray-300">Recognition and achievements in technology and development.</p>
        </div>

        {/* Year Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveYear('all')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeYear === 'all'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-900/80 text-gray-300 hover:bg-gray-800/80'
            }`}
          >
            All Years
          </button>
          {years.map(year => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeYear === year
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-900/80 text-gray-300 hover:bg-gray-800/80'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Mentions Grid */}
        <div className="flex flex-col gap-8">
          {isLoading ? (
            <div className="w-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="w-full backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          ) : filteredHonors.length === 0 ? (
            <div className="w-full backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-yellow-400 p-4 rounded-lg">
              No mentions found for the selected year.
            </div>
          ) : (
            filteredHonors.map(honor => (
              <div
                key={honor.id}
                className="w-full backdrop-blur-sm bg-gray-900/80 rounded-lg shadow-md hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 border border-gray-800 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {honor.image && (
                    <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                      <img 
                        src={honor.image} 
                        alt={honor.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">{honor.year}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/70 text-indigo-300 border border-indigo-700">
                        {honor.organization}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-100">{honor.title}</h2>
                    <p className="text-gray-300 mb-4">{honor.description}</p>
                    
                    {honor.link && (
                      <a
                        href={honor.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center group"
                      >
                        Learn more
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

export default HonorableMentionsPage;