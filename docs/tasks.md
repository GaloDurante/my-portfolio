# Tasks - Development Roadmap

This document decomposes the project into small, actionable tasks organized by phases.

---

## Phase 1: Setup & Infrastructure

### 1.1 Dependencies

- [x] **1.1.1** Install `next-auth`, `bcrypt`, `@types/bcrypt`
- [x] **1.1.2** Install `cloudinary`, `next-cloudinary`

### 1.2 Database Schema

- [x] **1.2.1** Configure `drizzle.config.ts` for Turso
- [x] **1.2.2** Add `AUTH_SECRET` to `.env`
- [x] **1.2.3** Create `db/schema.ts` - `users` table
- [x] **1.2.4** Create `db/schema.ts` - `profiles` table
- [x] **1.2.5** Create `db/schema.ts` - `projects` table
- [x] **1.2.6** Create `db/schema.ts` - `technologies` + junction table

### 1.3 Database Setup

- [x] **1.3.1** Generate migrations: `npx drizzle-kit generate`
- [x] **1.3.2** Push schema to database: `npx drizzle-kit push`

---

## Phase 2: Authentication

### 2.1 Auth Configuration

- [x] **2.1.1** Create `lib/auth/config.ts` - base NextAuth config
- [x] **2.1.2** Create `lib/auth/index.ts` - NextAuth with Credentials provider + callbacks
- [x] **2.1.3** Create `app/api/auth/[...nextauth]/route.ts` - auth handlers

### 2.2 Registration

- [x] **2.2.1** Create `app/api/auth/register/route.ts` - seed admin user

### 2.3 Login UI

- [x] **2.3.1** Create `app/(auth)/login/page.tsx` - login form UI
- [x] **2.3.2** Add validation with Zod

### 2.4 Route Protection

- [x] **2.4.1** Create `middleware.ts` - protect `/admin` routes

---

## Phase 3: Cloudinary

### 3.1 Configuration

- [x] **3.1.1** Configure Cloudinary in `.env` (already done: `CLOUDINARY_URL`)

### 3.2 Library

- [x] **3.2.1** Create `lib/cloudinary.ts` - config + upload helper

### 3.3 Upload Component

- [x] **3.3.1** Create components to manage avatar upload widget
- [x] **3.3.2** Create `components/admin/settings/RemoveImageButton.tsx` and `components/admin/settings/UploadImageButton.tsx` to handle buttons logic.

---

## Phase 4: UI Components (shadcn/ui)

Install and configure shadcn components:

- [x] **4.1** `npx shadcn@latest add input`
- [x] **4.2** `npx shadcn@latest add textarea`
- [x] **4.3** `npx shadcn@latest add select`
- [ ] **4.4** `npx shadcn@latest add form` (not a CLI component — use Field + react-hook-form pattern)
- [x] **4.5** `npx shadcn@latest add card`
- [x] **4.6** `npx shadcn@latest add dialog`
- [x] **4.7** `npx shadcn@latest add label`
- [x] **4.8** `npx shadcn@latest add avatar`
- [x] **4.9** `npx shadcn@latest add switch`
- [x] **4.10** `npx shadcn@latest add badge`
- [x] **4.11** `npx shadcn@latest add table`
- [x] **4.12** `npx shadcn@latest add alert-dialog`
- [x] **4.13** `npx shadcn@latest add separator`
- [x] **4.14** `npx shadcn@latest add sonner`
- [x] **4.15** `npx shadcn@latest add dropdown-menu`
- [x] **4.16** Create `components/ui/field.tsx` - field composition components
- [x] **4.17** Create `components/ui/input-group.tsx` - input with addons
- [x] **4.18** Create `components/ui/spinner.tsx` - loading spinner


---

## Phase 5: Admin Components

### 5.1 Layout

- [x] **5.1.1** Create `app/(admin)/admin/layout.tsx` - sidebar + header wrapper
- [x] **5.1.2** Create `components/admin/admin-sidebar.tsx` - navigation + user info + theme toggle
- [x] **5.1.3** Deleted: header within sidebar (see 5.1.2)

### 5.2 Dashboard

- [x] **5.2.1** Create `app/(admin)/admin/page.tsx` - stats overview

### 5.3 Profile Management

- [ ] **5.3.1** Create `components/admin/profile-form.tsx` - profile editing form
- [ ] **5.3.2** Add Zod validation schemas to all POST/PUT routes
- [ ] **5.3.3** Add error handling and proper HTTP status codes
- [ ] **5.3.4** Create `app/(admin)/admin/profile/page.tsx` - profile page

### 5.4 Projects Management

- [ ] **5.4.1** Create `components/admin/project-list.tsx` - projects table
- [ ] **5.4.2** Create `components/admin/project-form.tsx` - create/edit form
- [ ] **5.4.3** Add Zod validation schemas to all POST/PUT routes
- [ ] **5.4.4** Add error handling and proper HTTP status codes
- [ ] **5.4.5** Create `app/(admin)/admin/projects/page.tsx` - projects page

### 5.5 Technologies Management

- [ ] **5.5.1** Create `components/admin/technology-list.tsx` - technologies table
- [ ] **5.5.2** Create `components/admin/technology-form.tsx` - create/edit form
- [ ] **5.5.3** Add Zod validation schemas to all POST/PUT routes
- [ ] **5.5.4** Add error handling and proper HTTP status codes
- [ ] **5.5.5** Create `app/(admin)/admin/technologies/page.tsx` - technologies page

### 5.6 Settings

- [x] **5.6.1** Create `app/(admin)/admin/settings/page.tsx` - account settings

---

## Phase 6: Public Components

### 6.1 Layout & Structure

- [x] **6.1.1** Root layout already handles public layout (`app/layout.tsx`)

### 6.2 Sections

- [ ] **6.2.1** Create `components/public/hero-section.tsx` - landing hero
- [ ] **6.2.2** Create `components/public/about-section.tsx` - bio section
- [ ] **6.2.3** Create `components/public/project-card.tsx` - project card
- [ ] **6.2.4** Create `components/public/projects-section.tsx` - projects showcase
- [ ] **6.2.5** Create `components/public/tech-badge.tsx` - technology badge
- [ ] **6.2.6** Create `components/public/technologies-section.tsx` - tech stack
- [ ] **6.2.7** Create `components/public/contact-section.tsx` - contact info
- [ ] **6.2.8** Create `components/public/footer.tsx` - site footer

### 6.3 Page Assembly

- [ ] **6.3.1** Update `app/page.tsx` - assemble all public sections

---

## Phase 7: API Routes

### 7.1 Public Routes

- [ ] **7.1.1** Create `app/api/public/profile/route.ts` - GET profile
- [ ] **7.1.2** Create `app/api/public/projects/route.ts` - GET published projects
- [ ] **7.1.3** Create `app/api/public/projects/[slug]/route.ts` - GET single project
- [ ] **7.1.4** Create `app/api/public/technologies/route.ts` - GET all technologies

### 7.2 Admin Profile Routes

- [ ] **7.2.1** Create `app/api/admin/profile/route.ts` - GET/PUT profile

### 7.3 Admin Projects Routes

- [ ] **7.3.1** Create `app/api/admin/projects/route.ts` - GET all + POST create
- [ ] **7.3 `app/api/admin.2** Create/projects/[id]/route.ts` - PUT update + DELETE
- [ ] **7.3.3** Create `app/api/admin/projects/reorder/route.ts` - POST reorder

### 7.4 Admin Technologies Routes

- [ ] **7.4.1** Create `app/api/admin/technologies/route.ts` - GET all + POST create
- [ ] **7.4.2** Create `app/api/admin/technologies/[id]/route.ts` - PUT update + DELETE

---

## Phase 8: Pages Integration

### 8.1 Root Layout

- [ ] **8.1.1** Update `app/layout.tsx` - add SessionProvider

### 8.2 Admin Pages

- [ ] **8.2.1** Update `app/(admin)/admin/page.tsx` - connect to API
- [ ] **8.2.2** Update `app/(admin)/admin/profile/page.tsx` - connect form to API
- [ ] **8.2.3** Update `app/(admin)/admin/projects/page.tsx` - connect to API
- [ ] **8.2.4** Update `app/(admin)/admin/technologies/page.tsx` - connect to API
- [ ] **8.2.5** Update `app/(admin)/admin/settings/page.tsx` - settings UI

### 8.3 Public Pages

- [ ] **8.3.1** Update `app/page.tsx` - fetch data from API and render sections

---

## Phase 9: Final Integration

### 9.1 Error Handling

- [ ] **9.1.1** Add loading states (loading.tsx) to key pages
- [ ] **9.1.2** Add error boundaries where needed

### 9.2 Testing

- [ ] **9.2.1** Test authentication flow (login/logout)
- [ ] **9.2.2** Test CRUD operations for profile, projects, technologies
- [ ] **9.2.3** Test image upload to Cloudinary
- [ ] **9.2.4** Test public portfolio display

### 9.3 Code Quality

- [ ] **9.3.1** Run `npm run lint` and fix any errors
- [ ] **9.3.2** Run `npm run format` to ensure consistent formatting

### 9.4 Deployment Prep

- [ ] **9.4.1** Verify all environment variables are set in Vercel
- [ ] **9.4.2** Test production build locally: `npm run build`
- [ ] **9.4.3** Deploy to Vercel

---

## Quick Reference

### Commands

```bash
# Database
npx drizzle-kit generate     # Generate migrations
npx drizzle-kit push         # Push to database
npx drizzle-kit studio      # Open DB studio

# shadcn
npx shadcn@latest add [component]

# Development
npm run dev                  # Start dev server
npm run lint                 # Lint code
npm run format               # Format code
npm run build                # Production build
```

### File Locations

| Feature           | Location             |
| ----------------- | -------------------- |
| Database Schema   | `db/schema.ts`       |
| Auth Config       | `lib/auth/config.ts` + `lib/auth/index.ts` |
| Cloudinary        | `lib/cloudinary.ts`   |
| Middleware        | `middleware.ts`       |
| Login Form        | `app/(auth)/login/LoginForm.tsx` |
| Admin Layout      | `app/(admin)/admin/layout.tsx` |
| Admin Sidebar     | `components/admin/admin-sidebar.tsx` |
| Admin Header      | `components/admin/admin-header.tsx` |
| Admin Pages       | `app/(admin)/admin/`  |
| Settings Page     | `app/(admin)/admin/settings/page.tsx` |
| Admin Components  | `components/admin/`   |
| UI Components     | `components/ui/`      |
| Zod Schemas       | `lib/schemas/`        |

---

## Future Enhancements

After core functionality is complete, consider adding:

- [ ] Blog with markdown support
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Multi-language support (i18n)
- [ ] Analytics integration
- [ ] Contact form with email notifications

---

_Last Updated: March 2026_
