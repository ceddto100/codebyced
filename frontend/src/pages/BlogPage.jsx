import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getBlogPosts } from '../services/blogService';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
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

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching blog posts...');
        const result = await getBlogPosts(1, 100); // Increased limit to show more posts
        console.log('Blog API response:', result);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch blog posts');
        }
        
        if (!Array.isArray(result.data)) {
          console.error('Invalid response format:', result);
          throw new Error('Invalid response format from API');
        }
        
        // Log all posts before filtering
        console.log('All posts before filtering:', result.data);
        
        // Check if any post has hub1.png as coverImage
        const hub1Post = result.data.find(post => post.coverImage && post.coverImage.includes('hub1.png'));
        if (hub1Post) {
          console.log('Found post with hub1.png:', hub1Post);
          console.log('Is it published?', hub1Post.published);
        } else {
          console.log('No post found with hub1.png as coverImage');
        }
        
        // Filter for published posts and sort by date
        const filteredPosts = result.data
          .filter(post => post.published === true)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log('Filtered and sorted posts:', filteredPosts);
        setPosts(filteredPosts);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err.message || 'Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };

  // Structured data for blog page
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CodeByCed Blog",
    "description": "Thoughts, ideas, and insights on technology and development, focusing on business automation, API integration, and AI solutions.",
    "url": "https://codebyced.com/blog",
    "author": {
      "@type": "Person",
      "name": "Cedrick Carter",
      "jobTitle": "Software Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "ChazzTalk Conversational AI"
      }
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "dateModified": post.date,
      "image": post.coverImage,
      "author": {
        "@type": "Person",
        "name": "Cedrick Carter"
      },
      "keywords": post.tags || [],
      "url": `https://codebyced.com/blog/${post._id}`
    }))
  };

  return (
    <>
      <Helmet>
        <title>Blog | Cedrick Carter - Technology & Development Insights</title>
        <meta name="description" content="Explore insights on technology and development, focusing on business automation, API integration, and AI solutions. Stay updated with the latest trends and best practices." />
        <meta name="keywords" content="technology blog, development insights, business automation, API integration, AI solutions, low-code development, workflow optimization, digital transformation, conversational AI" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Blog | Cedrick Carter - Technology & Development Insights" />
        <meta property="og:description" content="Explore insights on technology and development, focusing on business automation, API integration, and AI solutions." />
        <meta property="og:type" content="blog" />
        <meta property="og:url" content="https://codebyced.com/blog" />
        <meta property="og:image" content="https://codebyced.com/images/blog-header.jpg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | Cedrick Carter - Technology & Development Insights" />
        <meta name="twitter:description" content="Explore insights on technology and development, focusing on business automation, API integration, and AI solutions." />
        <meta name="twitter:image" content="https://codebyced.com/images/blog-header.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://codebyced.com/blog" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(blogStructuredData)}
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
        
        <header className="mb-16 relative animate-fade-in-down">
          <div className="relative pb-3">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Blog</h1>
            <div className="absolute bottom-0 left-0 w-20 h-1 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 mt-4">
            Thoughts, ideas, and insights on technology and development
          </p>
        </header>

        {/* Wave Divider */}
        <div className="w-full h-16 overflow-hidden my-8">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-blue-50"></path>
          </svg>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="backdrop-blur-sm bg-white/90 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
            <p>{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="backdrop-blur-sm bg-white/90 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-md">
            <p>No blog posts found. Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article 
                key={post._id} 
                className="backdrop-blur-sm bg-white/90 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {post.coverImage && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.coverImage.startsWith('/') ? post.coverImage : `/images/${post.coverImage}`} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 relative">
                  <p className="text-sm text-gray-500 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(post.date)}
                  </p>
                  <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text">
                    <Link to={`/blog/${post._id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <Link 
                    to={`/blog/${post._id}`} 
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 group"
                  >
                    Read more 
                    <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </Link>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                      {post.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        
        {/* Footer Wave Divider */}
        <div className="w-full h-16 overflow-hidden mt-16">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-blue-50"></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default BlogPage;