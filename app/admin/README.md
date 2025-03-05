# Admin Dashboard for Blog Management

This admin dashboard provides a secure interface for managing blog posts on your portfolio website.

## Features

- **Secure Password Protection**: Access to the admin dashboard is protected by a password.
- **Blog Post Management**: View, create, edit, and delete blog posts.
- **Client-Side Data Persistence**: Blog posts are stored in MongoDB and images in Cloudinary.
- **Rich Text Editor**: TinyMCE integration for creating and editing blog content.
- **Image Upload**: Cloudinary integration for uploading and managing images.

## Access Instructions

1. Navigate to `/admin` in your browser
2. Enter the admin password
3. Upon successful authentication, you'll be redirected to the dashboard

## Security Note

This admin dashboard uses server-side authentication with JWT tokens. For production use, consider implementing additional security measures like rate limiting and HTTPS.

## Changing the Admin Password

The admin password is stored in your `.env.local` file as `ADMIN_PASSWORD`. To change it, update this value.

## Data Storage

Blog posts are stored in MongoDB and images in Cloudinary. The data is persisted across sessions and devices.

## Components

The admin dashboard consists of the following components:

- `app/admin/page.jsx`: Login page with password protection
- `app/admin/dashboard/page.jsx`: Main dashboard showing all blog posts
- `app/admin/dashboard/create/page.jsx`: Page for creating new posts
- `app/admin/dashboard/edit/[slug]/page.jsx`: Page for editing existing posts
- `components/BlogPostForm.jsx`: Reusable form component for creating and editing posts
- `components/RichTextEditor.jsx`: TinyMCE integration for rich text editing
- `components/ImageUpload.jsx`: Component for uploading images to Cloudinary

## Integration with Blog Frontend

The admin dashboard integrates with the blog frontend, allowing you to:

1. Create and publish new blog posts
2. Edit existing blog posts
3. Delete blog posts
4. View your blog posts as they appear on the frontend
