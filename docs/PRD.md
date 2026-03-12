# Product Requirements Document (PRD)

## Portfolio CMS - Next.js Portfolio with Admin Dashboard

**Project Name**: Portfolio CMS  
**Owner**: Galo Durante  
**Version**: 1.0.0  
**Last Updated**: March 2026

---

## 1. Project Overview

This project is a comprehensive portfolio CMS built with Next.js 16, serving as both a public portfolio website and a private admin dashboard for content management.

### Core Philosophy

1. **Public Interface**: Professional showcase for potential employers and clients
2. **Admin Dashboard**: Secure area for managing all content without code changes

---

## 2. Vision & Goals

| Goal | Description |
|------|-------------|
| **Zero-Code Updates** | Update content without touching code |
| **Professional Presentation** | Polished, responsive user experience |
| **Secure Authentication** | Protected admin routes |
| **Media Management** | Image uploads via Cloudinary |
| **Performance** | Excellent Core Web Vitals |
| **Type Safety** | Full TypeScript strict mode |

---

## 3. Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.6 (App Router) |
| **Language** | TypeScript 5.x (strict mode) |
| **Styling** | Tailwind CSS 4.x + shadcn/ui |
| **Icons** | Lucide React |
| **Database** | Turso (libSQL) + Drizzle ORM |
| **Auth** | NextAuth.js |
| **Media** | Cloudinary |

---

## 4. Core Features

### 4.1 Authentication (NextAuth.js)

- Credentials-based login (email/password)
- Protected routes via middleware
- JWT session management
- Role-based access (Owner/Visitor)

### 4.2 Admin Dashboard

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard overview |
| `/admin/profile` | Edit profile info |
| `/admin/projects` | Manage projects (CRUD) |
| `/admin/technologies` | Manage technologies (CRUD) |
| `/admin/settings` | Account settings |

### 4.3 Profile Management

Fields: name, title, bio, shortBio, avatar, email, location, website, github, linkedin, twitter, resumeUrl

### 4.4 Projects CRUD

Fields: title, slug, description, shortDescription, thumbnail, images, demoUrl, repoUrl, technologies, featured, status, order, dates

### 4.5 Technologies CRUD

Fields: name, slug, icon, iconUrl, category, color, description, order

**Categories**: language, framework, tool, other

---

## 5. User Roles

| Feature | Visitor | Owner (Admin) |
|---------|---------|---------------|
| View portfolio | ✅ | ✅ |
| Edit content | ❌ | ✅ |
| Access admin | ❌ | ✅ |

---

## 6. UI/UX Requirements

- **Style**: Clean, modern, dark mode support
- **Components**: shadcn/ui (radix-nova)
- **Animations**: CSS transitions + tw-animate-css
- **Responsive**: Mobile-first (sm → 2xl)
- **Accessibility**: WCAG 2.1 AA target

### Color Palette

Configured in `app/globals.css` using OKLCH color space with semantic tokens.

---

## 7. Deployment

**Platform**: Vercel (recommended)

**Steps**:
1. Push to GitHub
2. Import in Vercel
3. Configure environment variables
4. Deploy

---

## 8. Future Enhancements

| Feature | Priority |
|---------|----------|
| Blog with markdown | Medium |
| SEO (meta, sitemap) | High |
| Multi-language (i18n) | Medium |
| Analytics integration | Low |
| Contact form | Low |

---

## 9. Development Workflow

```bash
npm install           # Install dependencies
npm run dev           # Start dev server
npm run lint          # Run ESLint
npm run format        # Format with Prettier
npx drizzle-kit push  # Push database changes
```

---

## References

For detailed technical architecture, see [docs/architecture.md](./architecture.md):

- Database schema and relationships
- Cloudinary integration
- API routes
- Authentication configuration
- Environment variables
- File structure
- Component documentation

---

*End of PRD*
