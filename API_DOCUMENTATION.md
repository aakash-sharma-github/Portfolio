# Portfolio API Documentation

## Overview
Complete CRUD API system for **Blogs**, **Works**, and **Contacts** with admin dashboard and notification system.

## 🚀 Available APIs

### 📝 Blogs API
- **GET** `/api/blogs` - Get all blogs with pagination, filtering
- **POST** `/api/blogs` - Create new blog (authenticated)
- **GET** `/api/blogs/[slug]` - Get specific blog
- **PUT** `/api/blogs/[slug]` - Update blog (authenticated)
- **DELETE** `/api/blogs/[slug]` - Delete blog (authenticated)

### 💼 Works API
- **GET** `/api/works` - Get all portfolio works with filtering
- **POST** `/api/works` - Create new work (authenticated)
- **GET** `/api/works/[slug]` - Get specific work
- **PUT** `/api/works/[slug]` - Update work (authenticated)
- **DELETE** `/api/works/[slug]` - Delete work (authenticated)

### 📧 Contacts API
- **GET** `/api/contacts` - Get all contact messages (authenticated)
- **GET** `/api/contacts/[id]` - Get specific contact message (authenticated)
- **PUT** `/api/contacts/[id]` - Update contact status/reply (authenticated)
- **DELETE** `/api/contacts/[id]` - Delete contact message (authenticated)

### 🔔 Notifications API
- **GET** `/api/notifications` - Get notification status and unread count
- **PUT** `/api/notifications` - Mark messages as read

### 📊 Dashboard API
- **GET** `/api/dashboard` - Get complete overview statistics

### 🔐 Authentication API
- **POST** `/api/auth` - Login with password
- **GET** `/api/auth` - Verify token

## 📋 Database Models

### Blog Model
```javascript
{
  title: String (required),
  slug: String (unique, required),
  excerpt: String (required),
  content: String (required),
  category: String (required),
  coverImage: { url, publicId },
  readTime: String,
  author: { name, avatar, bio },
  published: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Work Model
```javascript
{
  title: String (required),
  slug: String (unique, required),
  description: String (required),
  content: String (required),
  category: String (required),
  technologies: [String] (required),
  images: [{ url, publicId, caption }],
  coverImage: { url, publicId },
  links: { live, github, demo },
  features: [String],
  challenges: [String],
  status: String (completed/in-progress/archived),
  featured: Boolean,
  client: { name, company, testimonial },
  duration: { start, end },
  teamSize: Number,
  role: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Model
```javascript
{
  name: String (required),
  email: String (required),
  subject: String (required),
  message: String (required),
  phone: String,
  company: String,
  projectType: String,
  budget: String,
  timeline: String,
  status: String (unread/read/replied/archived),
  priority: String (low/medium/high),
  source: String,
  ipAddress: String,
  userAgent: String,
  notes: String,
  replies: [{ message, sentAt, sentBy }],
  createdAt: Date,
  updatedAt: Date
}
```

## 📊 Dashboard Features

### Overview Statistics
- **Blogs**: Total, published, drafts, monthly/weekly growth
- **Works**: Total, completed, featured, in-progress, growth stats
- **Contacts**: Total, unread, read, replied, archived, today's count

### Notifications
- **Badge System**: Shows unread contact count
- **Real-time Updates**: Tracks new messages
- **Priority Alerts**: Highlights high-priority messages

### Analytics
- **Category Breakdown**: Distribution by categories
- **Status Tracking**: Message status distribution
- **Priority Distribution**: Contact priority analysis

### Recent Activity
- Latest 5 blogs, works, and contact messages
- Quick access to recent items

## 🔧 Frontend Integration

### JavaScript API Usage
```javascript
import { blogApi, workApi, contactApi, notificationApi, dashboardApi } from '@/lib/api';

// Get blogs
const blogs = await blogApi.getPosts({ category: 'Tech', page: 1 });

// Get works
const works = await workApi.getWorks({ featured: true });

// Get contacts (admin only)
const contacts = await contactApi.getContacts({ status: 'unread' });

// Get notifications for badge
const notifications = await notificationApi.getNotifications();
// Use notifications.badge.count for badge display

// Get dashboard overview
const overview = await dashboardApi.getOverview();
```

### Notification Badge Implementation
```javascript
// Check for new messages every minute
setInterval(async () => {
  const notifications = await notificationApi.getNotifications();
  updateBadge(notifications.badge.count); // Update UI badge
}, 60000);
```

## 🛡️ Security Features
- JWT token authentication for admin routes
- Input validation and sanitization
- Rate limiting ready (can be added)
- Proper error handling

## 📱 Mobile Responsive
- Blog category filters hidden on mobile (`hidden md:flex`)
- Optimized for mobile viewing experience

## ✅ Contact Form Integration
Contact form submissions are automatically:
- ✅ Stored in database
- ✅ Sent via email
- ✅ Tracked with status
- ✅ Available in admin dashboard
- ✅ Show notification badges for new messages

## 🚀 Next Steps
1. Build admin dashboard UI to consume these APIs
2. Create forms for CRUD operations on blogs and works
3. Implement notification badge in admin header
4. Add real-time updates using WebSockets (optional)

## 🔗 API Endpoints Summary
```
/api/blogs            → Blog CRUD
/api/works            → Work CRUD
/api/contacts         → Contact management
/api/notifications    → Notification system
/api/dashboard        → Overview statistics
/api/auth             → Authentication
```

All endpoints support filtering, pagination, and include proper error handling.
