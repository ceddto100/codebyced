const express = require('express');
const Blog = require('../models/Blog');

const router = express.Router();

const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://codebyced.com').replace(/\/$/, '');
const DEFAULT_IMAGE = `${SITE_URL}/images/blog-header.jpg`;

const escapeHtml = (value = '') => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const toAbsoluteImageUrl = (coverImage) => {
  if (!coverImage || typeof coverImage !== 'string') {
    return DEFAULT_IMAGE;
  }

  const trimmed = coverImage.trim();
  if (!trimmed) return DEFAULT_IMAGE;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  return `${SITE_URL}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};

router.get('/blog/:id', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).select('title excerpt coverImage date');

    if (!post) {
      return res.status(404).send('Blog post not found');
    }

    const blogUrl = `${SITE_URL}/blog/${post._id}`;
    const shareUrl = `${SITE_URL}/share/blog/${post._id}`;
    const title = post.title || 'CodeByCed Blog';
    const excerpt = post.excerpt || 'Read the latest posts on CodeByCed.';
    const image = toAbsoluteImageUrl(post.coverImage);
    const publishedAt = post.date ? new Date(post.date).toISOString() : '';

    res.set('Content-Type', 'text/html; charset=utf-8');
    return res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)} | CodeByCed</title>
  <meta name="description" content="${escapeHtml(excerpt)}" />
  <link rel="canonical" href="${blogUrl}" />

  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="CodeByCed" />
  <meta property="og:url" content="${shareUrl}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(excerpt)}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  ${publishedAt ? `<meta property="article:published_time" content="${publishedAt}" />` : ''}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@codebyced" />
  <meta name="twitter:url" content="${shareUrl}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(excerpt)}" />
  <meta name="twitter:image" content="${image}" />

  <meta http-equiv="refresh" content="0;url=${blogUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${blogUrl}">${escapeHtml(title)}</a>...</p>
  <script>window.location.replace(${JSON.stringify(blogUrl)});</script>
</body>
</html>`);
  } catch (error) {
    return res.status(500).send('Unable to generate share preview');
  }
});

module.exports = router;
