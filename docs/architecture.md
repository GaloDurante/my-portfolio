# Architecture Document

This document contains the technical architecture details for the Portfolio CMS project.

---

## Table of Contents

1. [Database Schema](#1-database-schema)
2. [Cloudinary Integration](#2-cloudinary-integration)
3. [API Routes](#3-api-routes)
4. [Authentication & Security](#4-authentication--security)
5. [Environment Variables](#5-environment-variables)
6. [File Structure](#6-file-structure)
7. [Components](#7-components)

---

## 1. Database Schema

### 1.1 Overview

The database uses **Drizzle ORM** with **Turso** (libSQL). All tables include `createdAt` and `updatedAt` timestamps for audit purposes.

### 1.2 Tables

#### Users Table

```
users
├── id              (uuid, primary key)
├── email           (string, unique, indexed)
├── passwordHash   (string)
├── name            (string, nullable)
├── role            (enum: owner, admin)
├── createdAt       (timestamp)
└── updatedAt       (timestamp)
```

#### Profiles Table

```
profiles
├── id              (uuid, primary key)
├── userId          (uuid, foreign key → users.id)
├── title           (string, nullable)
├── bio             (text, nullable)
├── shortBio        (string, nullable)
├── avatar          (string, nullable) - Cloudinary URL
├── location        (string, nullable)
├── website         (string, nullable)
├── github          (string, nullable)
├── linkedin        (string, nullable)
├── twitter         (string, nullable)
├── resumeUrl       (string, nullable)
├── createdAt       (timestamp)
└── updatedAt       (timestamp)
```

#### Projects Table

```
projects
├── id              (uuid, primary key)
├── title           (string)
├── slug            (string, unique, indexed)
├── description     (text, nullable)
├── shortDescription (string, nullable)
├── thumbnail       (string, nullable) - Cloudinary URL
├── images          (json, nullable) - Array of Cloudinary URLs
├── demoUrl         (string, nullable)
├── repoUrl         (string, nullable)
├── featured        (boolean, default false)
├── status          (enum: draft, published)
├── order           (integer, default 0)
├── startDate       (date, nullable)
├── endDate         (date, nullable)
├── createdAt       (timestamp)
└── updatedAt       (timestamp)
```

#### Technologies Table

```
technologies
├── id              (uuid, primary key)
├── name            (string)
├── slug            (string, unique, indexed)
├── icon            (string, nullable) - Cloudinary URL
├── iconUrl         (string, nullable) - External icon URL
├── category        (enum: language, framework, tool, other)
├── color           (string, nullable) - Brand color hex
├── description     (string, nullable)
├── order           (integer, default 0)
├── createdAt       (timestamp)
└── updatedAt       (timestamp)
```

#### Junction Table

```
projectTechnologies
├── projectId       (uuid, foreign key → projects.id)
└── technologyId    (uuid, foreign key → technologies.id)
```

### 1.3 Relationships

| Relationship           | Type         | Description                              |
| ---------------------- | ------------ | ---------------------------------------- |
| User → Profile         | One-to-One   | Each user has one profile                |
| Project → Technologies | Many-to-Many | Projects use multiple technologies       |
| Technology → Projects  | Many-to-Many | Technologies appear in multiple projects |

### 1.4 Database Files

| File             | Purpose                       |
| ---------------- | ----------------------------- |
| `db/index.ts`    | Database connection singleton |
| `db/schema.ts`   | All table definitions         |
| `db/migrations/` | Drizzle migration files       |

---

## 2. Cloudinary Integration

### 2.1 Configuration

The project uses Cloudinary for image upload, optimization, and delivery.

**Connection String** (in `.env`):

```
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

**Current Configuration**:

- Cloud Name: `portfolio-galo`

### 2.2 Image Specifications

| Type              | Max Size  | Formats        | Transformations       |
| ----------------- | --------- | -------------- | --------------------- |
| Avatar            | 5MB       | JPG, PNG, WebP | 400x400, auto-crop    |
| Project Thumbnail | 10MB      | JPG, PNG, WebP | 800x600, auto-format  |
| Project Gallery   | 10MB each | JPG, PNG, WebP | 1200x800, auto-format |

### 2.3 Optimization Settings

- **Auto-format**: Serve WebP/AVIF when supported
- **Auto-quality**: Optimize file size while maintaining quality
- **Responsive**: Generate variants for different screen sizes

### 2.4 Implementation

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File, folder: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });
}

export function getOptimizedUrl(publicId: string, options?: { width?: number; height?: number }) {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    ...options,
  });
}
```

### 2.5 Folder Structure

```
cloudinary://portfolio-galo/
├── avatars/        # Profile avatars
├── projects/       # Project thumbnails and galleries
└── tech-icons/    # Technology icons
```

---

## 3. API Routes

### 3.1 Public Routes (No Authentication)

| Method | Route                  | Description                |
| ------ | ---------------------- | -------------------------- |
| GET    | `/api/profile`         | Get public profile data    |
| GET    | `/api/projects`        | List published projects    |
| GET    | `/api/projects/[slug]` | Get single project by slug |
| GET    | `/api/technologies`    | List all technologies      |

### 3.2 Protected Routes (Admin Only)

| Method | Route                          | Description                          |
| ------ | ------------------------------ | ------------------------------------ |
| GET    | `/api/admin/profile`           | Get profile for editing              |
| PUT    | `/api/admin/profile`           | Update profile                       |
| GET    | `/api/admin/projects`          | List all projects (including drafts) |
| POST   | `/api/admin/projects`          | Create new project                   |
| PUT    | `/api/admin/projects/[id]`     | Update project                       |
| DELETE | `/api/admin/projects/[id]`     | Delete project                       |
| POST   | `/api/admin/projects/reorder`  | Reorder projects                     |
| GET    | `/api/admin/technologies`      | List all technologies                |
| POST   | `/api/admin/technologies`      | Create new technology                |
| PUT    | `/api/admin/technologies/[id]` | Update technology                    |
| DELETE | `/api/admin/technologies/[id]` | Delete technology                    |

### 3.3 Authentication Routes

| Method | Route                     | Description                     |
| ------ | ------------------------- | ------------------------------- |
| POST   | `/api/auth/[...nextauth]` | NextAuth handlers (all methods) |
| POST   | `/api/auth/register`      | Register first admin user       |

### 3.4 Route Protection Pattern

```typescript
// Example: Protected API route
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Continue with data fetching...
}
```

---

## 4. Authentication & Security

### 4.1 Authentication Provider

**NextAuth.js** with Credentials provider.

### 4.2 Authentication Flow

```
1. User visits /login
2. Enters email/password
3. System validates credentials against hashed password
4. On success: creates session → redirects to /admin
5. On failure: shows error message
```

### 4.3 Route Protection

**Middleware** (`middleware.ts`):

```typescript
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin/:path*"],
};
```

All routes under `/admin` automatically require authentication.

### 4.4 Security Best Practices

| Practice            | Implementation                      |
| ------------------- | ----------------------------------- |
| Password Hashing    | bcrypt                              |
| Session Security    | HTTP-only cookies                   |
| CSRF Protection     | Built-in NextAuth                   |
| XSS Prevention      | React auto-escaping                 |
| SQL Injection       | Drizzle ORM (parameterized queries) |
| Environment Secrets | Never commit .env                   |

### 4.5 Auth Configuration

```typescript
// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!user) return null;

        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
```

---

## 5. Environment Variables

### 5.1 Required Variables

| Variable               | Description                  | Example               |
| ---------------------- | ---------------------------- | --------------------- |
| `TURSO_CONNECTION_URL` | Database connection string   | `libsql://*.turso.io` |
| `TURSO_AUTH_TOKEN`     | Turso authentication token   | `eyJ...`              |
| `CLOUDINARY_URL`       | Cloudinary connection string | `cloudinary://...`    |
| `AUTH_SECRET`          | NextAuth secret (32+ chars)  | Random string         |

### 5.2 Optional Variables

| Variable          | Description         | Default |
| ----------------- | ------------------- | ------- |
| `AUTH_TRUST_HOST` | Trust proxy headers | `false` |

### 5.3 Example `.env` File

```
TURSO_CONNECTION_URL=libsql://portfolio-galodurante.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
CLOUDINARY_URL=cloudinary://791954623189462:z49zEledpbTlKf0jtD...@portfolio-galo
AUTH_SECRET=your-random-32-character-secret-here
```

**Important**: Never commit `.env` to version control.

---

## 6. File Structure

```
next-portfolio/
├── .env                          # Environment variables (not committed)
├── .eslint.config.mjs            # ESLint configuration
├── .gitignore                   # Git ignore rules
├── AGENTS.md                    # Developer guidelines
├── components.json              # shadcn configuration
├── drizzle.config.ts            # Drizzle configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
│
├── app/                         # Next.js App Router
│   ├── globals.css              # Global styles (Tailwind v4)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Public home page
│   ├── (admin)/                 # Admin route group (protected)
│   │   └── admin/
│   │       ├── layout.tsx       # Admin layout (with sidebar)
│   │       └── page.tsx         # Admin dashboard
│   ├── (auth)/                  # Auth route group
│   │   └── login/
│   │       └── page.tsx         # Login page
│   └── api/                     # API routes
│       ├── auth/[...nextauth]/  # NextAuth handlers
│       ├── admin/               # Admin API routes
│       └── public/              # Public API routes
│
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── admin/                   # Admin-specific components
│   │   ├── admin-sidebar.tsx
│   │   ├── project-form.tsx
│   │   └── technology-form.tsx
│   └── public/                  # Public-facing components
│       ├── hero-section.tsx
│       ├── project-card.tsx
│       └── tech-badge.tsx
│
├── db/                          # Database layer
│   ├── index.ts                 # Database connection
│   ├── schema.ts                # Table definitions
│   └── migrations/              # Migration files
│
├── docs/
│   ├── PRD.md                   # Product Requirements
│   └── architecture.md          # This file
│
├── lib/                         # Utilities & configurations
│   ├── utils.ts                 # cn() helper
│   ├── auth.ts                  # NextAuth configuration
│   ├── cloudinary.ts            # Cloudinary helpers
│   └── constants.ts             # App constants
│
├── hooks/                       # Custom React hooks
│   ├── use-auth.ts
│   └── use-media-upload.ts
│
└── public/                      # Static assets
    ├── images/
    └── fonts/
```

## 6.1 Typography & Page Titles

Overview: Use a single, efficient typography strategy across the app by loading Inter via Next.js font optimization and applying it once at the App Root layout. Avoid per-component font declarations; rely on layout to enforce typography with minimal CSS.

How to implement

- Typography
  - Use Next.js built-in font optimizer (next/font) to load Inter.
  - Apply Inter at the Root Layout (app/layout.tsx) by passing the font's className to the root <html> element, ensuring all child components inherit the font.
  - Do not scatter font-family declarations in individual components.
  - If weights beyond base are needed, configure via the font import and use fontWeight in CSS where necessary.
  - If you need alternate fonts, switch font choice globally in one place; avoid duplicative font rules.
  - Prefer semantic tokens or CSS variables for font sizes and line-heights if needed, declared in a single place (globals.css) only for base tokens, not per component.
  - Leverage font-display: swap and the font-loading optimization that Next.js provides.

- Page Titles per Route
  - Use per-page metadata to set the document title. This ensures the tab title matches the route and intent.
  - For static routes:
    - In each page/component under app, export:
      export const metadata = { title: "Login | Portfolio Galo Durante" };
  - For dynamic or shared layouts:
    - You can also implement generateMetadata in dynamic routes to customize the title based on params.
  - Examples:
    - app/(auth)/login/page.tsx
      export const metadata = { title: "Login | Portfolio Galo Durante" };
    - app/(admin)/admin/page.tsx
      export const metadata = { title: "Admin Dashboard | Portfolio Galo Durante" };

- Rationale
  - Consistency: One source of truth for typography and title metadata reduces drift.
  - Efficiency: Fonts loaded once; no cascading CSS overrides; easier maintenance.

See also: The font strategy aligns with the global typography approach described in the "Typography Strategy" section above.

---

## 7. Components

### 7.1 UI Components (shadcn/ui)

Located in `components/ui/`:

| Component      | Purpose                                                     |
| -------------- | ----------------------------------------------------------- |
| `button.tsx`   | Button with variants (default, outline, ghost, destructive) |
| `input.tsx`    | Text input                                                  |
| `textarea.tsx` | Multi-line text input                                       |
| `select.tsx`   | Dropdown select                                             |
| `card.tsx`     | Content container                                           |
| `dialog.tsx`   | Modal dialog                                                |
| `form.tsx`     | Form wrapper                                                |
| `label.tsx`    | Form label                                                  |
| `avatar.tsx`   | User avatar                                                 |
| `switch.tsx`   | Toggle switch                                               |
| `badge.tsx`    | Status/tag badge                                            |

### 7.2 Admin Components

Located in `components/admin/`:

| Component             | Purpose                     |
| --------------------- | --------------------------- |
| `admin-sidebar.tsx`   | Navigation sidebar          |
| `admin-header.tsx`    | Top bar with user info      |
| `project-list.tsx`    | Projects table/list         |
| `project-form.tsx`    | Create/edit project form    |
| `technology-list.tsx` | Technologies table/list     |
| `technology-form.tsx` | Create/edit technology form |
| `profile-form.tsx`    | Profile edit form           |
| `media-uploader.tsx`  | Cloudinary upload widget    |

### 7.3 Public Components

Located in `components/public/`:

| Component                  | Purpose                 |
| -------------------------- | ----------------------- |
| `hero-section.tsx`         | Landing hero area       |
| `about-section.tsx`        | About/bio section       |
| `projects-section.tsx`     | Projects showcase       |
| `project-card.tsx`         | Individual project card |
| `technologies-section.tsx` | Tech stack display      |
| `tech-badge.tsx`           | Technology tag          |
| `contact-section.tsx`      | Contact information     |
| `footer.tsx`               | Site footer             |

### 7.4 Component Patterns

**Server Component** (default):

```typescript
export async function ProjectList() {
  const projects = await db.query.projects.findMany();
  return <div>{projects.map(p => <ProjectCard key={p.id} project={p} />)}</div>;
}
```

**Client Component** (when needed):

```typescript
"use client";
export function ProjectForm() {
  const [loading, setLoading] = useState(false);
  // client-side logic
}
```

**With Variants (cva)**:

```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "variant-classes", outline: "outline-classes" },
    size: { sm: "size-sm", lg: "size-lg" },
  },
  defaultVariants: { variant: "default", size: "md" },
});
```

---

## 8. Coding Standards

### 8.1 Code Splitting

A file or component should not be too large. Separate into independent files:

| Content         | Location                        |
| --------------- | ------------------------------- |
| Zod schemas     | `lib/schemas/`                  |
| Form components | `components/[feature]-form.tsx` |
| Page            | `app/.../page.tsx`              |

**Incorrect example** (everything in one file):

```
app/(auth)/login/page.tsx
├── Schema Zod
├── LoginForm
├── LoginFormFallback
└── LoginPage
```

**Correct example** (separated):

```
lib/schemas/login.ts           # Zod schema
components/ui/login-form.tsx    # Component with react-hook-form
app/(auth)/login/page.tsx       # Page using the component
```

### 8.2 Forms

All forms must follow this structure:

- **State management**: `react-hook-form`
- **Validation**: `zod` with `@hookform/resolvers/zod`
- **Components**: shadcn/ui (`Input`, `Label`, etc.)
- **Typing**: Strict, no `any`

**File structure:**

```
lib/schemas/           # Zod validation schemas
├── login.ts
├── register.ts
├── profile.ts
└── project.ts
```

### 8.3 Correct Form Example

```typescript
// lib/schemas/login.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

```typescript
// components/ui/login-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/schemas/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    // handle submission
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Label htmlFor="email">Email</Label>
      <Input id="email" {...form.register("email")} />
      {form.formState.errors.email && (
        <p>{form.formState.errors.email.message}</p>
      )}
      {/* ... */}
    </form>
  );
}
```

### 8.4 Important Rules

1. **NEVER** put Zod schemas in the same file as the component
2. **NEVER** use `any` - use `unknown` when necessary
3. **ALWAYS** explicitly type functions and parameters
4. **ALWAYS** use path aliases `@/` for imports

---

## Appendix: Quick Reference

### Database Commands

```bash
npx drizzle-kit generate  # Generate migrations
npx drizzle-kit push      # Push schema to database
npx drizzle-kit studio    # Open database studio
```

### Add shadcn Component

```bash
npx shadcn@latest add button
```

### Auth Setup

1. Configure `lib/auth.ts` with NextAuth options
2. Create API route at `app/api/auth/[...nextauth]/route.ts`
3. Add middleware for route protection
4. Set `AUTH_SECRET` in environment

### Cloudinary Setup

1. Add `CLOUDINARY_URL` to `.env`
2. Configure `lib/cloudinary.ts`
3. Use upload component in admin forms

---

_Last Updated: March 2026_
