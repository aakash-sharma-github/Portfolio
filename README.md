# Aakash Sharma — Developer Portfolio

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Full-stack developer portfolio with a CMS admin panel, blog platform, dynamic cover image generation, GitHub stats, and production-grade SEO.**

[Live Site](https://www.aakashsharma.com.np) · [Admin Panel](https://www.aakashsharma.com.np/admin) · [Blog](https://www.aakashsharma.com.np/blog) · [Report Bug](mailto:aakashsharma9855@gmail.com)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Admin CMS](#admin-cms)
- [API Reference](#api-reference)
- [SEO Strategy](#seo-strategy)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contact](#contact)

---

## Overview

A production-grade portfolio and personal brand platform built for a full-stack software developer based in Dubai, UAE. Beyond a static portfolio, it includes a fully functional headless CMS, a Markdown/rich-text blog, auto-generated Cloudinary cover images, GitHub stats pulled via GraphQL, and a comprehensive SEO setup targeting UAE tech recruiters and companies.

---

## Features

### 🏠 Public Site

| Feature | Details |
|---|---|
| **Homepage** | Animated hero, TypeAnimation role cycling, GitHub stats counter, tech badge pills, social links |
| **Resume** | Tabbed layout — Experience · Skills · Education · About · Certifications. Mobile horizontal-scroll tabs. |
| **Portfolio** | Grid/list toggle, category filter, search, animated cards with live/GitHub links |
| **Blog** | Category dropdown filter, full-text search, featured post hero, skeleton loading, pagination |
| **Blog Post** | Markdown → HTML auto-conversion, TinyMCE HTML rendering, author bio, related posts, JSON-LD ArticlePosting |
| **Services** | Service cards with feature lists and CTA |
| **Contact** | Validated form with Zod, Nodemailer email notification, DB storage |

### 🔐 Admin CMS

| Feature | Details |
|---|---|
| **Secure Login** | JWT authentication, bcrypt password hashing, rate-limited login (10 attempts / 15 min) |
| **Blog Management** | Create, edit, delete posts. TinyMCE rich text editor. Cover image toggle (auto-generate vs upload). Tag management. Draft/publish toggle. |
| **Auto Cover Images** | Design-B gradient mesh generator using `node-canvas`. Auto-uploads to Cloudinary. Per-category colour palettes. |
| **Project Management** | Create, edit, delete portfolio projects. Cloudinary image upload. Tech stack tags. Featured toggle. No content field required. |
| **Contact Inbox** | View and manage contact form submissions |
| **Dashboard** | Overview stats — total blogs, projects, messages |

### ⚡ Performance & SEO

| Feature | Details |
|---|---|
| **Core Web Vitals** | `next/image` with AVIF/WebP, `display: swap` fonts, preconnect hints, lazy-loaded particles |
| **Structured Data** | Person, WebSite, ProfilePage, BreadcrumbList, ProfessionalService, BlogPosting schemas |
| **Geographic SEO** | UAE city targeting (Dubai, Abu Dhabi, Sharjah), `geo.region: AE`, `locale: en_AE` |
| **Sitemap** | Dynamic XML sitemap including all blog posts and projects (ISR, hourly revalidation) |
| **Per-page metadata** | Unique title, description, canonical, OG, Twitter cards on every route |
| **Security headers** | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |

---

## Tech Stack

### Frontend
- **Next.js 15** (App Router, RSC, ISR)
- **React 19**
- **Tailwind CSS 3**
- **Framer Motion** — page and element animations
- **TinyMCE** — rich text blog editor
- **Shadcn UI + Radix UI** — accessible component primitives
- **TypeAnimation** — animated role cycling
- **tsParticles** — background particle effects (high-perf devices only)
- **React CountUp** — animated stat counters

### Backend
- **Next.js API Routes** (Node.js runtime)
- **MongoDB Atlas + Mongoose** — content storage with indexed schemas
- **Cloudinary** — image CDN with transformation pipeline
- **node-canvas** — server-side cover image generation
- **Nodemailer** — SMTP email notifications
- **JWT + bcryptjs** — admin authentication
- **ioredis** — optional rate-limit caching (graceful fallback to in-memory)

### DevOps
- **Vercel** — deployment, edge CDN, ISR
- **GitHub GraphQL API** — repo + commit statistics
- **Vercel Analytics + Speed Insights** — production monitoring

---

## Getting Started

### Prerequisites

- Node.js **v18+**
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (free tier works)
- GitHub personal access token

### 1. Clone the repository

```bash
git clone https://github.com/aakash-sharma-github/Portfolio.git
cd Portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

See the [Environment Variables](#environment-variables) section below for full details.

### 4. Generate your admin password hash

```bash
node -e "require('bcryptjs').hash('your_password_here', 12).then(h => console.log(Buffer.from(h).toString('base64')))"
```

Copy the output into `ADMIN_PASSWORD_HASH` in your `.env.local`.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site and [http://localhost:3000/admin](http://localhost:3000/admin) — the admin panel.

### 6. Build for production

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env.local` file in the project root. **Never commit this file.**

```env
# ── Site ──────────────────────────────────────────────────────────────────────
# The real production domain — used in sitemap, OG tags, and cover image URLs.
# ⚠️  Do NOT set NEXT_PUBLIC_API_URL — all API calls use relative paths.
NEXT_PUBLIC_SITE_URL=https://www.aakashsharma.com.np

# ── MongoDB ───────────────────────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority

# ── Admin auth ────────────────────────────────────────────────────────────────
# Generate hash: node -e "require('bcryptjs').hash('password',12).then(h=>console.log(Buffer.from(h).toString('base64')))"
ADMIN_PASSWORD_HASH=base64_encoded_bcrypt_hash
JWT_SECRET=random_string_minimum_32_characters

# ── Cloudinary ────────────────────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── Email (Gmail App Password) ────────────────────────────────────────────────
SMTP_EMAIL=your_email@gmail.com
SMTP_EMAIL_PASSWORD=your_16_char_app_password

# ── GitHub stats (homepage) ───────────────────────────────────────────────────
GITHUB_USERNAME=your_github_username
GITHUB_TOKEN=github_pat_...

# ── Google Search Console verification ───────────────────────────────────────
GOOGLE_SITE_VERIFICATION=your_verification_token

# ── TinyMCE (blog editor) ────────────────────────────────────────────────────
NEXT_PUBLIC_TINYMCE=your_tinymce_api_key

# ── Redis (optional — rate limiting) ─────────────────────────────────────────
# If not set, falls back to in-memory rate limiting automatically
# REDIS_URL=redis://default:password@hostname:port
```

> **Important:** `NEXT_PUBLIC_API_URL` has been intentionally removed. All client-side API calls use relative paths (`/api/...`) which resolve correctly on both `localhost:3000` and the production domain. Setting this to `http://localhost:3000` and deploying to Vercel was causing `Network Error` on every login attempt.

### Setting environment variables on Vercel

1. Go to your project on [vercel.com](https://vercel.com)
2. **Settings → Environment Variables**
3. Add each variable above with its production value
4. Redeploy after adding variables

---

## Project Structure

```
├── app/
│   ├── layout.jsx               # Root layout — metadata, JSON-LD, fonts
│   ├── page.jsx                 # Homepage
│   ├── robots.js                # /robots.txt generator
│   ├── sitemap.js               # /sitemap.xml generator (ISR)
│   ├── blog/
│   │   ├── page.jsx             # Blog listing
│   │   ├── metadata.js          # Blog page SEO
│   │   └── [slug]/page.jsx      # Blog post — markdown→HTML, JSON-LD
│   ├── work/
│   │   ├── page.jsx             # Portfolio
│   │   └── metadata.js
│   ├── services/
│   │   ├── page.jsx
│   │   └── metadata.js
│   ├── resume/
│   │   ├── page.jsx
│   │   └── metadata.js
│   ├── contact/
│   │   ├── page.jsx
│   │   └── metadata.js
│   ├── admin/
│   │   ├── page.jsx             # Login
│   │   └── dashboard/
│   │       ├── page.jsx
│   │       ├── blogs/           # Blog CRUD
│   │       ├── works/           # Project CRUD
│   │       └── contacts/        # Message inbox
│   └── api/
│       ├── auth/route.js        # JWT login + verify
│       ├── blogs/
│       │   ├── route.js         # GET list, POST create
│       │   └── [slug]/route.js  # GET, PUT, DELETE
│       ├── works/
│       │   ├── route.js
│       │   └── [slug]/route.js
│       ├── contacts/
│       │   ├── route.js
│       │   └── submit/route.js
│       ├── upload/route.js      # Cloudinary image upload
│       ├── default-cover/route.js  # Auto cover image generator
│       ├── dashboard/route.js
│       └── github-stats/route.js
├── components/
│   ├── Header.jsx               # Scroll-aware sticky header
│   ├── Nav.jsx                  # Desktop navigation
│   ├── MobileNav.jsx            # Slide-in mobile menu
│   ├── ClientLayout.jsx         # Client wrapper (no StairTransition)
│   ├── RichTextEditor.jsx       # TinyMCE + markdown→HTML conversion
│   ├── BlogPostForm.jsx         # Shared create/edit blog form
│   ├── RelatedPosts.jsx         # Related posts grid
│   ├── SeoStructuredData.jsx    # Per-page JSON-LD injector
│   └── AdminLayout.jsx
├── lib/
│   ├── api.js                   # Axios client — relative URLs, auth interceptor
│   ├── mongodb.js               # Mongoose connection with pool config
│   ├── cloudinary.js            # Upload + delete helpers (throws on error)
│   ├── authMiddleware.js        # JWT verifyAuth (HS256, explicit algorithm)
│   ├── rateLimit.js             # Redis + in-memory fallback rate limiter
│   ├── generateCoverImage.js    # node-canvas Design-B cover generator
│   ├── models/
│   │   ├── Blog.js
│   │   ├── Work.js              # content optional, coverImage.url has default
│   │   └── Contact.js
│   ├── blogCategories.js
│   └── seo/
│       └── pageMeta.js          # Centralised page metadata constants
└── public/
    ├── og-image.png             # 1200×630 OG image for LinkedIn/social
    ├── site.webmanifest         # PWA manifest
    └── assets/
```

---

## Admin CMS

### Accessing the admin panel

Navigate to `/admin` on your deployed site. Enter your admin password (the one you hashed during setup).

### Blog workflow

1. Go to `/admin/dashboard/blogs` → **New Post**
2. Fill in title, slug (auto-generated), category, excerpt
3. Write content in the **TinyMCE editor** — supports headings, code blocks, images, tables
4. **Cover image**: toggle between **Auto-generate** (Design-B gradient mesh, uploaded to Cloudinary) or **Upload your own**
5. Add tags, set read time, toggle publish
6. Click **Create Blog Post**

> **Tip:** Existing posts with markdown content are automatically converted to HTML when opened in the editor.

### Cover image generation

When no cover image is provided, the server:
1. Generates a 1200×630 PNG using `node-canvas` with the post's title and category
2. Each category has a unique colour palette (AI → indigo, System Design → amber, Cloud → ocean blue, etc.)
3. Uploads the generated image to Cloudinary under `blog/covers/generated/`
4. Stores the real `https://res.cloudinary.com/...` URL in MongoDB

This means `next/image` always receives a Cloudinary URL — never a localhost URL.

### Security

- Passwords stored as `bcrypt` hashes (cost factor 12), base64-encoded in env
- JWT tokens expire after 2 hours, algorithm pinned to `HS256`
- Login rate-limited to 10 attempts per 15 minutes per IP
- All admin API routes use `verifyAuth()` middleware
- Admin routes excluded from `robots.txt` and sitemap

---

## API Reference

All endpoints use **relative paths** — no base URL needed from the client.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth` | — | Login with password → returns JWT |
| `GET`  | `/api/auth` | Bearer | Verify token validity |

### Blogs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/api/blogs` | — | List posts. Query: `category`, `search`, `page`, `limit` |
| `POST` | `/api/blogs` | ✅ | Create post. `coverImage: null` triggers auto-generate |
| `GET`  | `/api/blogs/:slug` | — | Get single post |
| `PUT`  | `/api/blogs/:slug` | ✅ | Update post. `coverImage: null` regenerates cover |
| `DELETE` | `/api/blogs/:slug` | ✅ | Delete post + Cloudinary cleanup |

### Works / Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/api/works` | — | List projects. Query: `category`, `featured`, `status` |
| `POST` | `/api/works` | ✅ | Create project. `content` field optional. |
| `GET`  | `/api/works/:slug` | — | Get single project |
| `PUT`  | `/api/works/:slug` | ✅ | Update project |
| `DELETE` | `/api/works/:slug` | ✅ | Delete project |

### Utility

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/upload` | ✅ | Upload image to Cloudinary → returns `{ url, publicId }` |
| `GET`  | `/api/default-cover` | — | Generate cover PNG. Query: `title`, `category`, `author` |
| `GET`  | `/api/github-stats` | — | GitHub repo count + total commits (Redis-cached 6h) |
| `GET`  | `/api/dashboard` | ✅ | Overview counts — blogs, works, contacts |
| `POST` | `/api/contacts/submit` | — | Submit contact form (rate-limited 5/min per IP) |

---

## SEO Strategy

This portfolio is optimised specifically for **UAE tech recruiter and HR discovery**.

### Target keywords
- `software developer Dubai` / `full stack developer UAE`
- `React developer Dubai` / `Node.js developer UAE`
- `hire software developer UAE` / `developer for hire Dubai`
- `Aakash Sharma developer` / `Aakash Sharma Dubai`

### Structured data schemas
- **Person** — establishes Aakash as a professional entity with Dubai address for Google Knowledge Panel
- **ProfilePage** — newer schema type Google uses for professional profiles
- **Occupation** — with UAE location, skills, and experience — surfaces in job-related searches
- **ProfessionalService** — `areaServed: Dubai, Abu Dhabi, Sharjah` for local service searches
- **BreadcrumbList** — on every page for better search result display
- **BlogPosting** — on every blog post with author, dates, and tags

### After deploying
1. Submit `https://www.aakashsharma.com.np/sitemap.xml` to [Google Search Console](https://search.google.com/search-console)
2. Submit the same sitemap to [Bing Webmaster Tools](https://www.bing.com/webmasters) — many UAE corporate networks use Bing
3. Add your domain to your LinkedIn profile and include "Dubai, UAE · Open to work" in your LinkedIn About section
4. Create a free [Google Business Profile](https://business.google.com) as an individual consultant in Dubai

---

## Deployment

### Deploy to Vercel (recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository directly at [vercel.com/new](https://vercel.com/new).

### Required Vercel environment variables

Set all variables from the [Environment Variables](#environment-variables) section in **Vercel → Project → Settings → Environment Variables**.

**Critical:** Make sure `NEXT_PUBLIC_SITE_URL` is set to `https://www.aakashsharma.com.np` — this is used in the sitemap, OG tags, and cover image fallback URLs.

### Custom domain

Your domain `www.aakashsharma.com.np` is already connected to Vercel. No additional DNS configuration is needed unless you change hosting.

---

## Troubleshooting

### Login fails with "Network Error" on production

**Cause:** `NEXT_PUBLIC_API_URL=http://localhost:3000` is set as an environment variable on Vercel.

**Fix:** Delete `NEXT_PUBLIC_API_URL` from Vercel environment variables entirely. The codebase uses relative API paths (`/api/...`) which resolve correctly on any host.

---

### Blog cover image shows localhost URL

**Cause:** Old posts created before the cover image fix may have `http://localhost:3000/api/default-cover?...` stored in MongoDB.

**Fix:** Edit and re-save the affected posts from the admin dashboard. The PUT route will regenerate and upload the cover to Cloudinary, replacing the localhost URL.

---

### TinyMCE editor doesn't load

**Cause:** Missing or invalid `NEXT_PUBLIC_TINYMCE` API key.

**Fix:** Get a free API key from [tiny.cloud](https://www.tiny.cloud), add it to your environment variables, and redeploy.

---

### GitHub stats not updating

**Cause:** GitHub API rate limit hit, or `GITHUB_TOKEN` missing/expired.

**Fix:** Ensure `GITHUB_TOKEN` is set with `public_repo` and `read:user` scopes. Stats are Redis-cached for 6 hours — if Redis isn't configured, they're cached per-instance.

---

### Images not uploading to Cloudinary

**Cause:** One or more Cloudinary credentials are incorrect, or the `cloudinary.js` lib was throwing `NextResponse` instead of an `Error`.

**Fix:** Verify all three Cloudinary variables (`CLOUD_NAME`, `API_KEY`, `API_SECRET`) are correct in your environment. The updated `lib/cloudinary.js` throws real errors, so check server logs for the exact message.

---

### Admin dashboard shows 500 error

**Cause:** Missing `Authorization` header on dashboard API calls, or MongoDB connection issue.

**Fix:** Clear `localStorage` in your browser (`localStorage.clear()`), log out, and log back in to get a fresh JWT token.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

```bash
git checkout -b feature/your-feature-name
git commit -m 'feat: describe your change'
git push origin feature/your-feature-name
```

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Contact

**Aakash Sharma** — Full-Stack Developer · Dubai, UAE

| | |
|---|---|
| 🌐 Website | [www.aakashsharma.com.np](https://www.aakashsharma.com.np) |
| 💼 LinkedIn | [linkedin.com/in/aakash-sharma-918447178](https://www.linkedin.com/in/aakash-sharma-918447178/) |
| 🐙 GitHub | [github.com/aakash-sharma-github](https://github.com/aakash-sharma-github) |
| 📧 Email | [aakashsharma9855@gmail.com](mailto:aakashsharma9855@gmail.com) |

---

<p align="center">Built with love & Next.js · Deployed on Vercel · Based in Dubai, UAE</p>