# Portfolio - Modern Full-Stack Developer Showcase

![Portfolio Banner](https://res.cloudinary.com/demo/image/upload/portfolio_banner.jpg)

A modern, responsive portfolio application built with Next.js, showcasing professional projects, blog posts, and developer skills. This full-stack application features dynamic content management, GitHub statistics integration, interactive UI elements, and a comprehensive admin dashboard.

## 🚀 Features

### 📊 Dashboard & Analytics

- **Admin Dashboard**: Secure admin panel for content management
- **GitHub Integration**: Real-time GitHub statistics using GraphQL API
- **Analytics**: Track visitor engagement and content performance

### 💼 Project Showcase

- **Dynamic Project Slider**: Interactive carousel displaying featured projects
- **Filterable Portfolio**: Sort projects by technology or category
- **Detailed Project Pages**: In-depth case studies with images and technical details

### ✍️ Blog Platform

- **Rich Text Editor**: Create and edit blog posts with TinyMCE
- **Category Management**: Organize content with customizable categories
- **SEO Optimization**: Built-in metadata management for better search visibility

### 🎨 User Experience

- **Responsive Design**: Optimized for all device sizes
- **Animations**: Smooth transitions and interactions with Framer Motion
- **Particle Effects**: Interactive background elements with tsParticles
- **Dark/Light Mode**: Toggle between visual themes (if implemented)

### 📱 Contact & Communication

- **Contact Form**: Email integration with Nodemailer
- **Notification System**: Real-time alerts for new messages
- **Social Media Integration**: Connect with professional profiles

## 🛠️ Technology Stack

### Frontend

- **Next.js**: React framework for server-side rendering and static site generation
- **React**: UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Shadcn UI**: Component library for consistent design
- **Swiper**: Touch slider for mobile-friendly carousels
- **tsParticles**: Particle animation system

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **MongoDB**: NoSQL database for content storage
- **Mongoose**: MongoDB object modeling
- **Cloudinary**: Cloud-based image management
- **Nodemailer**: Email sending functionality
- **JWT**: Authentication and authorization

### DevOps & Tools

- **Vercel**: Deployment and hosting platform
- **GitHub API**: Repository and commit statistics
- **Redis**: Caching for improved performance (via ioredis)

## 📋 Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm** or **yarn**: Latest stable version
- **MongoDB**: Local instance or MongoDB Atlas account
- **Cloudinary**: Account for image uploads (free tier available)
- **GitHub**: Personal access token (for GitHub stats)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/aakash-sharma-github/Portfolio.git
cd Portfolio
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup Guide

This guide will help you set up the required environment variables for the Portfolio project.

## 📋 Required Environment Variables

### 1. **Database Configuration**
```bash
MONGODB_URI=mongodb://localhost:27017/portfolio
```

### 2. **JWT Configuration**
```bash
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
```

### 3. **Admin Authentication**
```bash
# Generate this hash using: node scripts/generatePassword.js your_password
ADMIN_PASSWORD_HASH="your_base64_encoded_password_hash_here"
```

### 4. **Cloudinary Configuration (for image uploads)**
```bash
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 5. **Email Configuration (for contact form)**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 6. **GitHub API (for stats)**
```bash
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=your_github_username
```

### 7. **API Configuration**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```


### 4. Generate Admin Password Hash

```bash
npm run password
# Follow the prompts to create a secure password hash
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 6. Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## ⚙️ Configuration

### MongoDB Setup

1. Create a MongoDB Atlas account or use a local MongoDB instance
2. Create a new cluster and database
3. Add your connection string to the `.env.local` file

### Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Navigate to Dashboard to find your cloud name, API key, and API secret
3. Add these credentials to your `.env.local` file

### Email Configuration

1. Set up an email account for sending notifications
2. For Gmail, you'll need to create an App Password:
   - Go to your Google Account > Security > App Passwords
   - Select "Mail" and your device, then generate
3. Use this password in your `.env.local` file

### GitHub API Integration

1. Create a personal access token at [GitHub Developer Settings](https://github.com/settings/tokens)
2. Select the `public_repo` and `read:user` scopes
3. Add your token and username to the `.env.local` file

## 📝 Usage

### Admin Dashboard

Access the admin dashboard at `/admin` to manage your content:

```javascript
// Example: Creating a new blog post via the API
const createBlogPost = async (postData) => {
  const response = await fetch("/api/blogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(postData)
  });
  return await response.json();
};
```

### Adding Portfolio Projects

Add new projects through the admin interface or directly via the API:

```javascript
// Example: Adding a new project
const addProject = async (projectData) => {
  const response = await fetch("/api/works", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });
  return await response.json();
};
```

### Customizing the UI

Modify the Tailwind configuration in `tailwind.config.js` to customize the appearance:

```javascript
// Example: Customizing colors
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff"
          // Add your custom color palette
        }
      }
    }
  }
};
```

### Working with Particles

Customize the particle effects by modifying the configuration in your components:

```javascript
// Example: Customizing particle effects
const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#ffffff"
    }
    // Additional configuration options
  }
};
```

## 🔍 API Documentation

The application provides a comprehensive API for managing content. See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint information.

Key endpoints include:

- **GET/POST/PUT/DELETE** `/api/blogs` - Blog management
- **GET/POST/PUT/DELETE** `/api/works` - Portfolio project management
- **GET/POST/PUT/DELETE** `/api/contacts` - Contact message management
- **GET/PUT** `/api/notifications` - Notification system
- **GET** `/api/dashboard` - Dashboard statistics
- **POST/GET** `/api/auth` - Authentication

## 🐛 Troubleshooting

### Common Issues

#### GitHub API Rate Limiting

**Problem**: GitHub API requests are being rate-limited.

**Solution**: Ensure your GitHub token has the correct permissions and consider implementing caching to reduce API calls.

#### Email Sending Failures

**Problem**: Contact form emails are not being sent.

**Solution**:

- Verify SMTP credentials in your `.env.local` file
- For Gmail, ensure you're using an App Password, not your regular password
- Check your email provider's security settings

#### Image Upload Issues

**Problem**: Images fail to upload to Cloudinary.

**Solution**:

- Confirm Cloudinary credentials are correct
- Check file size limits (default is 10MB)
- Verify your Cloudinary plan limits

## 👥 Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## 📄 License

This project is open-source and available under the MIT License. See the [LICENSE](LICENSE) file for more information.

## 📞 Contact & Support

- **Creator**: Aakash Sharma
- **GitHub**: [aakash-sharma-github](https://github.com/aakash-sharma-github)
- **Email**: [aakashsharma9855@gmail.com](mailto:aakashsharma9855@gmail.com)
- **Website**: [aakashsharma.vercel.app](https://aakashsharma.vercel.app/)
- **LinkedIn**: [aakash-sharma-linkedin](https://www.linkedin.com/in/aakash-sharma-918447178/)

For bug reports and feature requests, please open an issue on the GitHub repository.

---

<p align="center">Built with ❤️ using Next.js and React</p>
