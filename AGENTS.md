# AGENTS.md - Developer Guidelines

This document provides guidelines for agents working on this Next.js portfolio CMS.

## Project Overview

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Database**: Turso (libSQL) with Drizzle ORM
- **Auth**: NextAuth.js
- **Media**: Cloudinary for image uploads
- **Icons**: Lucide React

## Available Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server

# Linting & Formatting
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run format:check # Check formatting without changes

# Database (Drizzle)
npx drizzle-kit generate  # Generate migrations
npx drizzle-kit push     # Push schema to database
npx drizzle-kit studio   # Open database studio
```

## Code Style Guidelines

### Imports

Use path alias `@/*` for all imports (configured in tsconfig.json):

```typescript
// Order: external → internal → styles
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

Use named exports for components and utilities.

### TypeScript

- Strict mode enabled in tsconfig.json
- Use explicit types for function parameters and return types
- Use `type` for unions, intersections, and type aliases
- Use `interface` for object shapes that may be extended
- Avoid `any`; use `unknown` when type is truly unknown

### Naming Conventions

| Type               | Convention           | Example                         |
| ------------------ | -------------------- | ------------------------------- |
| Files (utils)      | kebab-case           | `utils.ts`, `date-formatter.ts` |
| Files (components) | PascalCase           | `Button.tsx`, `HeroSection.tsx` |
| Components         | PascalCase           | `Button`, `ProjectCard`         |
| Functions          | camelCase            | `formatDate`, `getProjects`     |
| Constants          | SCREAMING_SNAKE_CASE | `MAX_UPLOAD_SIZE`               |
| Variables          | camelCase            | `projectList`, `isLoading`      |

### Formatting (Prettier)

```json
// .prettierrc recommended config
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

- Run `npm run format` before committing
- Use consistent spacing in JSX props
- Sort imports with ESLint or manual organization

### React/Next.js Patterns

Use Server Components by default; add `"use client"` only when needed:

```typescript
// Server Component (default)
export async function ProjectList() {
  const projects = await db.query.projects.findMany();
  return <div>{projects.map(p => <ProjectCard key={p.id} project={p} />)}</div>;
}

// Client Component (when needed)
"use client";
export function ProjectForm() {
  const [loading, setLoading] = useState(false);
  // ...
}
```

Component structure with TypeScript:

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

### Component Variants (cva)

Use `class-variance-authority` for variants:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "variant-classes", outline: "outline-classes" },
    size: { sm: "size-sm", lg: "size-lg" },
  },
  defaultVariants: { variant: "default", size: "md" },
});
```

### Tailwind CSS v4

Use `@theme` for semantic tokens in `globals.css`:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-muted: var(--muted);
}
```

- Use utility classes; avoid custom CSS unless necessary
- Use semantic color tokens: `bg-primary`, `text-muted-foreground`
- Dark mode: `dark:bg-zinc-900` format
- Keep classes organized logically in className

### shadcn/ui (radix-nova style)

This project uses shadcn/ui with the "radix-nova" style:

```bash
npx shadcn@latest add button
```

Key patterns:

- Use `data-slot` attribute for component identification
- Use `data-variant` and `data-size` for styling variants
- Icons: use `data-icon` attribute for icon positioning
- Follow semantic color system (no raw Tailwind values in components)

### Error Handling

- Use TypeScript type narrowing for runtime safety
- Handle async errors with try/catch in client components
- Use error boundaries for component-level errors
- Log errors appropriately; never expose sensitive data

### Database (Drizzle ORM)

- Schemas in `db/schema.ts`
- Migrations in `drizzle/` directory
- Access via `db` singleton from `db/index.ts`
- Use `.env` for credentials; never commit secrets

## File Structure

```
├── app/                    # Next.js App Router
│   ├── (admin)/           # Protected admin routes
│   ├── api/               # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Public home page
├── components/           # React components
│   ├── ui/               # shadcn/ui components
│   └── admin/           # Admin-specific components
├── db/                   # Drizzle schema & connection
├── lib/                  # Utilities (utils.ts, auth.ts, cloudinary.ts)
├── public/               # Static assets
├── docs/                 # Documentation (PRD.md)
└── .env                  # Environment variables
```

## Git Conventions

- **NEVER work directly on the `main` branch**
  - Create a branch for each feature/task: `git checkout -b feature/name`
  - Or use prefixes: `task/`, `fix/`, `refactor/`

- **Before finishing a task:**
  1. Run `npm run lint` and `npm run build` to verify there are no errors
  2. DO NOT commit, push, or create a PR without user approval
  3. Inform the user that the task is ready for review

- Use descriptive commit messages
- Never commit `.env` files or secrets

## Agent Skills

Custom agent skills in `.agents/skills/`:

- **shadcn**: Detailed rules for shadcn/ui. See `.agents/skills/shadcn/SKILL.md`

Run `npx shadcn@latest docs <component>` for component documentation.

## Quick Reference

| Task                  | Command                             |
| --------------------- | ----------------------------------- |
| Start dev             | `npm run dev`                       |
| Build                 | `npm run build`                     |
| Lint                  | `npm run lint`                      |
| Format                | `npm run format`                    |
| Add component         | `npx shadcn@latest add [component]` |
| Generate DB migration | `npx drizzle-kit generate`          |
| Push DB changes       | `npx drizzle-kit push`              |
