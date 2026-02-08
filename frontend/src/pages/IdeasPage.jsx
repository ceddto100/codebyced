import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { getIdeas } from '../services/ideasService';
import PageLayout from '../components/PageLayout';

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

  // Container animations with staggered children

  // Structured data for ideas page
  const ideasStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Ideas & Concepts | Cedrick Carter",
    "description": "Explore my collection of ideas, concepts, and thought experiments across various domains, focusing on technology innovation and business automation.",
    "url": "https://codebyced.com/ideas",
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
      "name": "Technology Innovation Ideas",
      "description": "Collection of innovative ideas and concepts in software development, business automation, and technology."
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": ideas.map((idea, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CreativeWork",
          "name": idea.title,
          "description": idea.summary,
          "keywords": idea.tags || [],
          "dateCreated": idea.date,
          "url": idea.readMoreLink
        }
      }))
    }
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Ideas & Concepts | Cedrick Carter - Technology Innovation</title>
        <meta name="description" content="Explore my collection of innovative ideas and concepts in software development, business automation, and technology. Discover thought experiments and future possibilities." />
        <meta name="keywords" content="technology ideas, innovation concepts, software development ideas, business automation, API integration, AI solutions, low-code development, workflow optimization, digital transformation, conversational AI" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Ideas & Concepts | Cedrick Carter - Technology Innovation" />
        <meta property="og:description" content="Explore my collection of innovative ideas and concepts in software development, business automation, and technology." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://codebyced.com/ideas" />
        <meta property="og:image" content="https://codebyced.com/images/ideas-header.jpg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ideas & Concepts | Cedrick Carter - Technology Innovation" />
        <meta name="twitter:description" content="Explore my collection of innovative ideas and concepts in software development, business automation, and technology." />
        <meta name="twitter:image" content="https://codebyced.com/images/ideas-header.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://codebyced.com/ideas" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(ideasStructuredData)}
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
          <h1 className="text-4xl font-bold mb-4 text-gray-100">Ideas Lab</h1>
          <p className="text-xl text-gray-300">A collection of innovative concepts and experimental projects.</p>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              !selectedTag
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-900/80 text-gray-300 hover:bg-gray-800/80'
            }`}
          >
            All Ideas
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-900/80 text-gray-300 hover:bg-gray-800/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Ideas Grid */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-yellow-400 p-4 rounded-lg">
              No ideas found with the selected tag.
            </div>
          ) : (
            filteredIdeas.map((idea, index) => (
              <div
                key={idea._id}
                className="backdrop-blur-sm bg-gray-900/80 rounded-lg shadow-md hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 border border-gray-800 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold mb-2 text-gray-100">{idea.title}</h2>
                    <p className="text-gray-300 mb-4">{idea.summary}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {idea.tags.map((tag, tagIndex) => (
                        <button
                          key={tagIndex}
                          onClick={() => setSelectedTag(tag)}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/70 text-indigo-300 border border-indigo-700 hover:bg-indigo-800/70 transition-colors duration-200"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {/* Read More Link */}
                    {idea.readMoreLink && (
                      <a
                        href={idea.readMoreLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-4 text-blue-400 hover:text-blue-300 font-medium group"
                      >
                        Read more
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

export default IdeasPage;