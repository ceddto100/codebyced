import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBlogPost } from '../services/blogService';
import ReactMarkdown from 'react-markdown';

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
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
    
    const fetchBlogPost = async () => {
      setIsLoading(true);
      try {
        const response = await getBlogPost(id);
        
        // Ensure we have valid post data
        if (!response || !response.data) {
          throw new Error('Invalid response format from API');
        }
        
        // Extract the post data and ensure all fields are the correct type
        const postData = response.data;
        
        // For debugging
        console.log("Received post data:", postData);
        console.log("Cover image:", postData.coverImage);
        
        const sanitizedPost = {
          _id: String(postData._id || ''),
          title: String(postData.title || ''),
          content: typeof postData.content === 'string' ? postData.content : 
                  typeof postData.content === 'object' ? JSON.stringify(postData.content) : '',
          excerpt: String(postData.excerpt || ''),
          date: postData.date || new Date().toISOString(),
          tags: Array.isArray(postData.tags) ? postData.tags.map(tag => String(tag)) : [],
          coverImage: postData.coverImage || '' // Preserve the original value if it exists
        };
        
        setPost(sanitizedPost);
        setError(null);
        
        // Scroll to top when post loads
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlogPost();
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Unknown date';
    }
  };

  // Simple content renderer fallback
  const renderContentFallback = (content) => {
    if (!content) return null;
    try {
      return content.split('\n').map((paragraph, idx) => (
        paragraph.trim() ? <p key={idx} className="mb-4">{paragraph}</p> : null
      )).filter(Boolean);
    } catch (e) {
      console.error('Content rendering fallback error:', e);
      return <p>Content display error</p>;
    }
  };

  const renderContent = (content) => {
    if (!content || typeof content !== 'string') {
      return <p>No content available</p>;
    }

    try {
      return (
        <div className="blog-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      );
    } catch (e) {
      console.error('ReactMarkdown error:', e);
      return renderContentFallback(content);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
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
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md backdrop-blur-sm">
          <p>{error}</p>
          <Link to="/blog" className="inline-block mt-4 text-blue-600 hover:text-blue-800 transition-colors group">
            <span className="flex items-center">
              <svg 
                className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              Back to all blog posts
            </span>
          </Link>
        </div>
      ) : post ? (
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {/* Navigation */}
          <div className="mb-8">
            <Link 
              to="/blog" 
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center group"
            >
              <svg 
                className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              Back to all blog posts
            </Link>
          </div>
          
          {/* Header */}
          <header className="mb-10 animate-fade-in-down">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">{post.title}</h1>
            <div className="flex flex-wrap items-center text-gray-600">
              <time dateTime={post.date} className="mr-6 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(post.date)}
              </time>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 transition-all duration-200 hover:bg-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>
          
          {/* Cover image if available */}
          {post.coverImage && post.coverImage.trim() !== '' && (
            <div className="mb-10 rounded-xl overflow-hidden shadow-lg transform hover:shadow-xl transition-all duration-300">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-auto transform hover:scale-105 transition-transform duration-700" 
                onError={(e) => {
                  console.error("Image failed to load:", post.coverImage);
                  e.target.style.display = 'none'; // Hide the image if it fails to load
                }}
              />
            </div>
          )}
          
          {/* Wave Divider */}
          <div className="w-full h-16 overflow-hidden my-8">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
              <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-blue-50"></path>
            </svg>
          </div>
          
          {/* Blog content */}
          <div className="prose prose-lg max-w-none p-8 rounded-xl backdrop-blur-sm bg-white/90 shadow-lg border border-gray-100 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/5 rounded-full"></div>
            
            <div className="relative z-10">
              {renderContent(post.content)}
            </div>
          </div>
          
          {/* Footer with tags */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="relative pb-3 mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Tags</h3>
              <div className="absolute bottom-0 left-0 w-16 h-1 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Link 
                  key={index}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 transition-all duration-200 hover:bg-blue-200 hover:-translate-y-1"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Wave Divider */}
          <div className="w-full h-16 overflow-hidden mt-12 transform rotate-180">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
              <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-indigo-50"></path>
            </svg>
          </div>
        </motion.article>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg shadow-md backdrop-blur-sm bg-white/80">
          <p>Blog post not found.</p>
          <Link 
            to="/blog" 
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 transition-colors group flex items-center"
          >
            <svg 
              className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to all blog posts
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogPostPage;