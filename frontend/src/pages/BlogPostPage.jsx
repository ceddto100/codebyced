import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBlogPost } from '../services/blogService';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';
import PageLayout from '../components/PageLayout';
import ShareButton from '../components/ShareButton';

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
        
        // Debug logs
        console.log('Raw API response:', response);
        
        // Ensure we have valid post data
        if (!response || !response.data) {
          throw new Error('Invalid response format from API');
        }
        
        // Extract the post data and ensure all fields are the correct type
        const postData = response.data;
        
        // Debug logs
        console.log('Post data before sanitization:', postData);
        console.log('Cover image before sanitization:', postData.coverImage);
        
        const sanitizedPost = {
          _id: String(postData._id || ''),
          title: String(postData.title || ''),
          content: typeof postData.content === 'string' ? postData.content : 
                  typeof postData.content === 'object' ? JSON.stringify(postData.content) : '',
          excerpt: String(postData.excerpt || ''),
          date: postData.date || new Date().toISOString(),
          tags: Array.isArray(postData.tags) ? postData.tags.map(tag => String(tag)) : [],
          coverImage: postData.coverImage ? 
            (postData.coverImage.startsWith('/') ? postData.coverImage : `/${postData.coverImage}`) : 
            '' // Ensure the path starts with a forward slash
        };
        
        // Debug logs
        console.log('Sanitized post:', sanitizedPost);
        console.log('Cover image after sanitization:', sanitizedPost.coverImage);
        
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
    <PageLayout>
      <Helmet>
        {/* ... existing Helmet content ... */}
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Scroll Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 z-50">
          <div 
            className="h-full bg-blue-600 transition-all duration-200"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        ) : !post ? (
          <div className="backdrop-blur-sm bg-gray-900/80 border border-gray-800 text-yellow-400 p-4 rounded-lg">
            Blog post not found.
          </div>
        ) : (
          <article className="animate-fade-in">
            {post.coverImage && (
              <div className="relative h-96 -mx-4 mb-8 overflow-hidden rounded-lg">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}

            <header className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-100">{post.title}</h1>
                  <div className="flex items-center text-gray-400">
                    <span className="mr-4">{formatDate(post.date)}</span>
                    {post.readTime && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{post.readTime} min read</span>
                      </>
                    )}
                  </div>
                </div>
                <ShareButton 
                  url={window.location.href}
                  title={post.title}
                  description={post.excerpt}
                />
              </div>
            </header>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900/70 text-indigo-300 border border-indigo-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-lg prose-invert max-w-none">
              {renderContent(post.content)}
            </div>

            {post.references && post.references.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-800">
                <h2 className="text-2xl font-bold mb-4 text-gray-100">References</h2>
                <ul className="space-y-2">
                  {post.references.map((ref, index) => (
                    <li key={index}>
                      <a 
                        href={ref.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        {ref.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        )}
      </div>
    </PageLayout>
  );
};

export default BlogPostPage;