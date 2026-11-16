# LEARGAS Energy Partners – Website

Corporate website for **LÉARGAS Energy Partners** – wind energy M&A advisory in Vietnam and Southeast Asia.

- **Phase 1** – Landing page + blog with static content (`src/content`).
- **Phase 2** – Blog powered by a **Java Spring Boot** REST API.

## Brand

| Token    | Value     | Usage                  |
| -------- | --------- | ---------------------- |
| `ink`    | `#152e2d` | Text, primary buttons  |
| `forest` | `#173a35` | "Our approach" section |
| `leaf`   | `#c8e79a` | Accent, highlight, CTA |
| `paper`  | `#f7f8f2` | Page background        |
| `sage`   | `#e9eedf` | Markets / blog hero    |
| `mint`   | `#dfebcc` | Contact band           |

Fonts: **Manrope** (headings, wordmark) + **DM Sans** (body). Logo mark: `src/components/shared/logo.tsx`
(also `public/images/logo-mark.svg`, favicon `src/app/icon.svg`).

## Tech stack

| Area      | Choice                                               |
| --------- | ---------------------------------------------------- |
| Framework | Next.js 16 (App Router, Cache Components, Turbopack) |
| Language  | TypeScript (strict)                                  |
| Styling   | Tailwind CSS v4 + shadcn/ui (Base UI)                |
| Forms     | react-hook-form + zod                                |
| Tooling   | ESLint, Prettier, Husky + lint-staged, pnpm          |

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

| Script           | Description                  |
| ---------------- | ---------------------------- |
| `pnpm dev`       | Start dev server             |
| `pnpm build`     | Production build             |
| `pnpm start`     | Run production build         |
| `pnpm lint`      | ESLint                       |
| `pnpm typecheck` | Generate route types + `tsc` |
| `pnpm format`    | Prettier                     |

## Project structure

```
src/
├── app/
│   ├── (marketing)/          # Routes sharing Header + Footer
│   │   ├── page.tsx          # Landing page (composes sections)
│   │   └── blog/             # Phase 2 – reads from Spring Boot
│   ├── api/contact/          # Contact form endpoint
│   ├── layout.tsx            # Root layout, fonts, metadata, Toaster
│   ├── error.tsx | not-found.tsx | loading.tsx
│   └── sitemap.ts | robots.ts | opengraph-image.tsx
├── components/
│   ├── ui/                   # shadcn/ui primitives (generated)
│   ├── layout/               # Header, Footer, MobileNav, Container
│   ├── sections/             # Landing page sections (Hero, Expertise, Markets, …)
│   ├── blog/                 # PostCard, BlogExplorer (filter + search)
│   ├── enquiry/              # "Let's talk" dialog + provider + trigger button
│   └── shared/               # Logo, Eyebrow, Section, ArrowButton
├── config/                   # site.ts, navigation.ts
├── content/                  # Static phase-1 data (home.ts, posts.ts)
├── lib/
│   ├── api/                  # Backend client (server-only)
│   ├── env.ts                # Validated env vars
│   ├── seo.ts                # Metadata helpers
│   └── utils.ts              # cn()
├── hooks/
├── types/                    # Shared types (blog types mirror Spring DTOs)
└── validations/              # zod schemas
```

## Conventions

- Server Components by default; add `"use client"` only for interactive components.
- File names in kebab-case; named exports for components.
- Never read `process.env` directly – use `@/lib/env`.
- All backend calls go through `src/lib/api/client.ts` (`apiFetch`).
- Edit copy in `src/config` and `src/content`, not inside components.
- Add shadcn components with `pnpm dlx shadcn@latest add <name>`.

## Phase 2 – Spring Boot integration

1. Set `API_BASE_URL` (e.g. `http://localhost:8080`) in `.env.local`. While it is empty the
   blog is served from `src/content/posts.ts` with the same types.
2. Backend endpoints expected by `src/lib/api/blog.ts`:
   - `GET /api/posts?page=0&size=12&sort=publishedAt,desc` → Spring Data `Page<PostSummaryDto>`
   - `GET /api/posts/{slug}` → `PostDto` (404 when missing)
   - Errors as `ProblemDetail` (RFC 9457)
3. Keep `src/types/blog.ts` in sync with the Java DTOs.
4. Blog data is cached with `"use cache"` + `cacheTag("posts")`. Add a revalidation
   endpoint (called by Spring after publishing) that runs `revalidateTag("posts")`.
5. Add the image host to `images.remotePatterns` in `next.config.ts`.
6. Optionally forward `/api/contact` (enquiry form) to the backend (see TODO in the route).
