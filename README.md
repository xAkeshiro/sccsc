# The Center (SCCSC): website and careers portal

A redesign of [sccsc.org](https://sccsc.org) for the Sacramento Chinese Community Service Center, with a built-in careers portal where applicants create accounts, apply online and track their status, and HR manages postings and applications.

**Why the redesign:** see [`docs/site-audit.md`](docs/site-audit.md).

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **Tailwind CSS 4**
- **Better Auth** for email and password accounts. Login is rate-limited in the database, so it works across serverless instances.
- **Drizzle ORM** on **Postgres** (Neon on Vercel). Locally, it falls back to an embedded Postgres ([PGlite](https://pglite.dev)), so there's nothing to install.
- Résumés are stored in Postgres, not in public blob URLs. They're served only to the applicant who uploaded them and to admins.

## Quick start

```bash
npm install
npm run dev          # migrates and seeds the local DB, then starts http://localhost:3000
```

The first run seeds 5 **sample** job postings and a local-only demo admin:

| | |
|---|---|
| Admin login | `admin@example.com` / `center-admin-demo` (local only; never created when `DATABASE_URL` is set) |
| Applicant | Sign up at `/signup` |

The local database lives in `.data/pglite`. Delete that folder to start fresh. Only one process can open it at a time, so stop `npm run dev` before running scripts against it.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (runs migrations and seeding first) |
| `npm run build` | Applies migrations if `DATABASE_URL` is set, then runs `next build` |
| `npm run typecheck` / `npm run lint` | Type-check / ESLint |
| `npm run db:generate` | Generate a SQL migration after editing `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Migrate and insert sample jobs if the jobs table is empty |
| `npm run admin:create -- <email> "<Name>"` | Create an admin (needs `ADMIN_PASSWORD`, 12+ characters) or promote an existing account |

## Project map

```
src/
  content/site.ts        ← all org facts, stats, programs, districts, nav. Edit copy here.
  app/(site)/            ← public site: home, programs, families, about, get-involved, contact
  app/(site)/careers/    ← job board → job detail → apply (login required)
  app/(site)/portal/     ← applicant dashboard (status, résumé, withdraw)
  app/(site)/login|signup
  app/admin/             ← HR dashboard: overview, applications pipeline, job postings
  app/api/auth/          ← Better Auth endpoints
  app/api/resumes/[id]/  ← access-checked résumé downloads
  db/schema.ts           ← tables (auth + jobs, applications, résumés, events)
  lib/session.ts         ← data access layer: getCurrentUser / requireUser / requireAdmin
scripts/                 ← migrate, seed, create-admin
drizzle/                 ← generated SQL migrations (commit these)
```

## Deploying to Vercel

### Demo mode (no setup)

Import the repo in Vercel (framework preset: Next.js; defaults are fine) and deploy. With no `DATABASE_URL`, the careers portal runs in **demo mode**:

- It uses an in-memory Postgres (PGlite) that's seeded on startup with the 5 sample jobs and the demo admin (`admin@example.com` / `center-admin-demo`, shown on the sign-in page).
- Everything works: sign up, apply, upload a résumé, and review applications as admin.
- Data resets whenever Vercel recycles the server instance, and each instance has its own copy. So a session can occasionally drop, or a new application might not show up for the admin.
- A banner warns visitors not to upload real résumés.

You can force demo mode locally with `DEMO_MODE=true npm run dev`.

### Full mode (real database)

1. **Add a database:** in the project, go to **Storage → Create → Neon (Postgres)** and connect it to all environments. This sets `DATABASE_URL`.
2. **Add environment variables:**
   - `BETTER_AUTH_SECRET`: generate with `openssl rand -base64 32` (**required** once `DATABASE_URL` is set; the portal stays offline without it)
   - `NEXT_PUBLIC_SITE_URL`: e.g. `https://sccsc.org`
3. **Redeploy.** Demo mode switches off automatically, and the build runs `db:migrate` automatically when `DATABASE_URL` is set.
4. **Create the real HR admin** (run from your machine against the production DB):
   ```bash
   DATABASE_URL='<neon url>' ADMIN_PASSWORD='<strong password>' npm run admin:create -- hr@sccsc.org "HR Team"
   ```
5. **Add job postings** at `/admin/jobs/new`. Production builds only migrate and never seed, so the live database starts empty. For a demo, `DATABASE_URL=... npm run db:seed` inserts the 5 sample postings (only when the jobs table is empty). Close them from `/admin/jobs` when you're done.

Preview deployments trust their own `*.vercel.app` hostnames for auth automatically. For a custom domain, add it to `AUTH_ALLOWED_HOSTS` (or set `BETTER_AUTH_URL`).

### Going live

Until `NEXT_PUBLIC_SITE_LIVE=true`, every page shows a "Redesign preview" banner and sends `noindex` (plus a blocking `robots.txt`), so previews never compete with the real site in search. Set it only when this deployment becomes sccsc.org.

## Launch checklist (content marked `TODO(client)` in code)

- [ ] Real photos with media releases. Swap the `PhotoSlot` placeholders for `next/image`.
- [x] Official logo: drop it in `public/brand/` and set `org.logo.src` (plus its width and height) in `src/content/site.ts`. Optionally set `invertedSrc` to a white version for the dark footer.
- [ ] Confirm the summer and early-learning program copy (`src/content/site.ts`)
- [ ] Per-school program list for the Families page (95+ sites)
- [ ] Office hours and a general contact form
- [ ] Leadership and board, and history milestones (About page)
- [ ] Donation destination (`org.donateUrl`)
- [ ] Real job postings with pay ranges. California requires pay scales in job postings for employers with 15+ employees.
- [ ] Email notifications for new applications and status changes (hook in `careers/[slug]/apply/actions.ts`; e.g. Resend)
- [ ] Password reset email (Better Auth `sendResetPassword`, needs an email provider)
- [ ] 301 redirects from old WordPress URLs (`/join-our-team/`, `/staff-directory/...`, etc.) in `next.config.ts`
- [ ] Translations for priority family languages
- [ ] Privacy policy covering applicant data and a résumé retention period

## Security notes

- Authorization is checked in the data layer and in every server action (`requireUser` / `requireAdmin`), not just in layouts. Non-admins get a 404 on `/admin`.
- The `role` field can't be set at sign-up (`input: false`). Admins are created only through the CLI script.
- Résumé uploads: PDF, DOC or DOCX only, 4 MB or less. The file's signature bytes are checked, not just its extension or MIME type. Downloads are sent as attachments with `nosniff` and `no-store`.
- Post-login redirects accept same-site relative paths only.
- Sign-in is limited to 5 per minute and sign-up to 3 per minute per IP.
