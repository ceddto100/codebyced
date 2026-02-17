import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

const PostContent = ({ post }) => {
  const sanitizedContent = useMemo(() => {
    const html = post?.content ?? '';
    return DOMPurify.sanitize(html);
  }, [post?.content]);

  if (!sanitizedContent) {
    return <p>No content available.</p>;
  }

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};

export default PostContent;
