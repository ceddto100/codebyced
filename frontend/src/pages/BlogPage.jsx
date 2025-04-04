import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PageLayout from '../components/PageLayout';
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
    <PageLayout>
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
          <h1 className="text-4xl font-bold mb-4 text-gray-100">Blog</h1>
          <p className="text-xl text-gray-300">Exploring ideas, sharing insights, and documenting my journey.</p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {isLoading ? (
            <div className="col-span-2 flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="col-span-2 backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="col-span-2 backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-yellow-400 p-4 rounded-lg">
              No blog posts found. Check back soon for new content!
            </div>
          ) : (
            posts.map(post => (
              <div key={post._id} className="backdrop-blur-sm bg-gray-900/80 rounded-lg shadow-md hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 overflow-hidden border border-gray-800 transform hover:-translate-y-1">
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
                  <p className="text-sm text-gray-400 mb-2">{formatDate(post.date)}</p>
                  <h2 className="text-xl font-semibold mb-2 text-gray-100 hover:text-blue-400 transition-colors duration-200">{post.title}</h2>
                  <p className="text-gray-300 mb-4">{post.excerpt}</p>
                  <Link 
                    to={`/blog/${post._id}`} 
                    className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center group"
                  >
                    Read more 
                    <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default BlogPage;