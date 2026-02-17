# Creating a blog post via HTTP request

This API exposes a create endpoint at:

- `POST /api/blog`

When your backend is running locally on port `5000`, the full URL is:

- `http://localhost:5000/api/blog`

In production, use your deployed API base URL (for example `https://api.codebyced.com/api/blog` if that domain points to this backend).

## Required body fields

Based on the `Blog` model, these fields are required:

- `title` (string)
- `excerpt` (string)
- `content` (string)

Optional fields:

- `tags` (array of strings)
- `coverImage` (string URL)
- `date` (date string)
- `published` (boolean)

## Does JSON accept image uploads?

Short answer: **not directly**.

- The API expects normal JSON in `req.body`, not `multipart/form-data` file uploads.
- `coverImage` should be a **string URL** to an image that is already hosted somewhere (Cloudinary, S3, your CDN, etc.).
- If you send a binary image file directly in this request, it will not be processed as an uploaded file by the current route.

Example:

```json
{
  "title": "Post title",
  "excerpt": "Summary",
  "content": "Body",
  "coverImage": "https://cdn.example.com/my-cover.jpg"
}
```

## HTTP module setup (Make/Zapier style)

- **Authentication type:** None (unless you add auth middleware)
- **URL:** `https://api.codebyced.com/api/blog` (or your local URL)
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
- **Body content type:** Raw / JSON
- **Request body:**

```json
{
  "title": "How I Automated My Workflow",
  "excerpt": "A short summary of the post.",
  "content": "Full markdown or plain text content goes here.",
  "tags": ["automation", "ai"],
  "coverImage": "https://example.com/cover.jpg",
  "published": true
}
```

## cURL test

```bash
curl -X POST http://localhost:5000/api/blog \
  -H "Content-Type: application/json" \
  -d '{
    "title":"How I Automated My Workflow",
    "excerpt":"A short summary of the post.",
    "content":"Full markdown or plain text content goes here.",
    "tags":["automation","ai"],
    "coverImage":"https://example.com/cover.jpg",
    "published":true
  }'
```

Expected success response:

- status `201`
- JSON with `success: true` and the created post under `data`
