# Project Vintage

Collector car analytics platform — comparable sales intelligence and originality verification for serious Porsche enthusiasts.

> **See [CLAUDE.md](./CLAUDE.md) for the project source of truth** — product definition, architectural rules, coding standards, data source policy, and V1 scope.

---

## Local Setup

```bash
# 1. Clone the repository
git clone <repo-url> project-vintage
cd project-vintage

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Open .env.local and fill in values — see .env.example for descriptions

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Production build |
| `npm run start` | Start production server (after build) |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript type check (`tsc --noEmit`) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14, App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| File Storage | Cloudflare R2 |
| Hosting | Vercel |
| Email | Resend |
| Payments | Stripe |
| Error Tracking | Sentry |
| Analytics | PostHog |

---

## Folder Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full annotated directory tree and key separation points.

```
app/          Next.js App Router pages and API routes
components/   Shared UI components
lib/          Core application logic (Supabase clients, comp engine, parsers, utils)
scrapers/     Isolated listing scrapers — scheduled jobs only, no request-path imports
emails/       React Email templates (Resend)
supabase/     Local dev config and SQL migrations
tests/        Unit and normalization tests
```
