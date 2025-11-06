# Blog Section for Portfolio

This is a modern, attractive blog section for your portfolio website built with Next.js and Tailwind CSS.

## Features

- Responsive design that looks great on all devices
- Blog post listing with filtering by category
- Search functionality
- Individual blog post pages with rich content
- Related posts section
- Modern UI with animations and transitions

## Setup Instructions

1. **Add Images**:

   - Place your blog post cover images in the `/public/assets/blog/` directory
   - Make sure the image paths in `blogData.js` match your actual image files

2. **Update Blog Data**:

   - Edit the `blogData.js` file to add your own blog posts
   - Each blog post should follow the structure provided in the example posts
   - HTML content can be added in the `content` field of each post

3. **Customize Styling**:

   - The blog section uses the same styling theme as your portfolio
   - You can customize colors, fonts, and other styles in your Tailwind config

4. **Add Your Avatar**:
   - Place your avatar image at `/public/assets/avatar.jpg` or update the path in the blog data

## Adding New Blog Posts

To add a new blog post:

1. Add a new object to the `blogPosts` array in `blogData.js`
2. Make sure to include all required fields:
   - `id`: A unique identifier
   - `title`: The title of your blog post
   - `excerpt`: A short summary
   - `coverImage`: Path to the cover image
   - `date`: Publication date
   - `readTime`: Estimated reading time
   - `category`: The category (should match one in the categories array)
   - `slug`: URL-friendly version of the title
   - `author`: Object with your name, avatar, and bio
   - `content`: HTML content of the blog post

## Components

The blog section consists of the following components:

- `app/blog/page.jsx`: Main blog listing page
- `app/blog/[slug]/page.jsx`: Individual blog post page
- `app/blog/blogData.js`: Data file containing blog posts
- `components/BlogPostCard.jsx`: Card component for blog posts
- `components/RelatedPosts.jsx`: Related posts component

## Dependencies

- Next.js
- Tailwind CSS
- @tailwindcss/typography (for styling blog post content)
- Framer Motion (for animations)
- React Icons
