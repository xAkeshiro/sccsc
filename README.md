# The Center (SCCSC): website and careers portal

A redesign of [sccsc.org](https://sccsc.org) for the Sacramento Chinese Community Service Center, with a built-in careers portal where applicants create accounts, apply online and track their status, and HR manages postings and applications.

**Layout:** the site root (`/`) serves a static copy of the Center's current WordPress site. The redesign lives under **`/demo`** (e.g. `/demo/careers`, `/demo/admin`). See [Current WordPress site](#current-wordpress-site).

**Design explorations:** `/v3` is a warmer, more colorful take on the redesign's home page (home page only for now; its links go to the `/demo` pages). Its building blocks are in `src/components/v3.tsx`, and its photos, taken from the current site, are in `public/photos/v3/`.

`/v4` is the **current WordPress home page with more color**: the same page and content, restyled. `npm run v4:build` copies `public/index.html` to `public/v4/index.html` and adds a few markup changes: a preview banner, wavy section edges, two highlighted hero words, and the real counter totals, since the export left the counters stuck at 0. The restyling itself is in `public/v4/v4.css`. It overrides Elementor's own element styles, so any of it could also be applied to the live WordPress site. The fonts are self-hosted in `public/v4/fonts/` under the SIL Open Font License. Re-run the script after refreshing the WordPress export.

**Why the redesign:** see [`docs/site-audit.md`](docs/site-audit.md).

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **Tailwind CSS 4**
- **Better Auth** for email and password accounts. Login is rate-limited in the database, so it works across serverless instances.
- **Drizzle ORM** on **Postgres** (Neon on Vercel). Locally, it falls back to an embedded Postgres ([PGlite](https://pglite.dev)), so there's nothing to install.
- Résumés are stored in Postgres, not in public blob URLs. They're served only to the applicant who uploaded them and to admins.

## Quick start

```bash
npm install
npm run dev          # migrates and seeds the local DB, then starts http://localhost:3000 (redesign at /demo)
```

The first run seeds 5 **sample** job postings and a local-only demo admin:

| | |
|---|---|
| Admin login | `admin@example.com` / `center-admin-demo` (local only; never created when `DATABASE_URL` is set) |
| Applicant | Sign up at `/demo/signup` |

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
  app/demo/(site)/       ← public site: home, programs, families, about, get-involved, contact
  app/demo/(site)/careers/ ← job board → job detail → apply (login required)
  app/demo/(site)/portal/  ← applicant dashboard (status, résumé, withdraw)
  app/demo/(site)/login|signup
  app/demo/admin/        ← HR dashboard: overview, applications pipeline, job postings
  app/demo/jobs.xml/     ← Indeed job feed (open jobs, live)
  app/v3/                ← design exploration: colorful home page (components/v3.tsx)
  lib/job-syndication.ts ← shared Indeed / Google for Jobs job data
  app/api/auth/          ← Better Auth endpoints
  db/schema.ts           ← tables (auth + jobs, applications, résumés, events)
  lib/session.ts         ← data access layer: getCurrentUser / requireUser / requireAdmin
  lib/auth-actions.ts    ← sign in / up / out as server actions (see note in file)
  lib/resume-actions.ts  ← access-checked résumé downloads
scripts/                 ← migrate, seed, create-admin
drizzle/                 ← generated SQL migrations (commit these)
public/                  ← brand/ and photos/ for the redesign, plus the WordPress export (see below)
```

## Deploying to Vercel

### Demo mode (no setup)

Import the repo in Vercel (framework preset: Next.js; defaults are fine) and deploy. With no `DATABASE_URL`, the careers portal runs in **demo mode**:

- It uses an in-memory Postgres (PGlite) that's seeded on startup with the 5 sample jobs and the demo admin (`admin@example.com` / `center-admin-demo`, shown on the sign-in page).
- Everything works: sign up, apply, upload a résumé, and review applications as admin.
- Data resets whenever Vercel recycles the server instance, and each instance has its own copy. So a session can occasionally drop, or a new application might not show up for the admin.
- A banner warns visitors not to upload real résumés.

You can force demo mode locally with `DEMO_MODE=true npm run dev`.

### Full mode (Supabase)

1. **Get the connection string.** In Supabase, open the project and click **Connect** at the top. Choose **Transaction pooler** (port `6543`), copy the URI and replace `[YOUR-PASSWORD]` with the database password. If the password has special characters (`@ : / ? # %`), URL-encode them. If you've lost it, reset it under **Project Settings → Database**.
2. **Add environment variables in Vercel** under **Settings → Environment Variables**, for Production and Preview:
   - `DATABASE_URL`: the pooler URI from step 1
   - `BETTER_AUTH_SECRET`: a random string of 32+ characters (`openssl rand -base64 32`)
   - `NEXT_PUBLIC_SITE_URL`: `https://sccsc.org` (optional for now)
3. **Redeploy** from **Deployments → ⋯ → Redeploy**. The build log should say `✓ Migrations applied to DATABASE_URL`. That creates every table and turns on Row Level Security, so Supabase's public API can't read them; the app connects as the table owner and is unaffected. The yellow banner switches from "Demo site" to "Redesign preview".
4. **Check Supabase → Table Editor.** You should see `jobs`, `applications`, `user` and the other tables, each marked RLS enabled.
5. **Make yourself an admin.** Sign up on the site at `/signup`, then in **Supabase → SQL Editor** run:
   ```sql
   update "user" set role = 'admin' where email = 'you@example.com';
   ```
   Sign out and in again, then open `/demo/admin`. From a terminal, `DATABASE_URL=… ADMIN_PASSWORD=… npm run admin:create -- email "Name"` does the same.
6. **Add job postings** at `/demo/admin/jobs/new`. The real database starts empty. To load the 5 sample postings for a demo, run `DATABASE_URL=… npm run db:seed` from a terminal.

Previews and production share one database unless you add a second Supabase project for previews, which is recommended before real applicants arrive.

Preview deployments trust their own `*.vercel.app` hostnames for auth automatically. For a custom domain, add it to `AUTH_ALLOWED_HOSTS` (or set `BETTER_AUTH_URL`).

### Going live

Until `NEXT_PUBLIC_SITE_LIVE=true`, every page shows a "Redesign preview" banner and sends `noindex` (plus a blocking `robots.txt`), so previews never compete with the real site in search. Set it only when this deployment becomes sccsc.org.

## Job boards: Indeed and Google for Jobs

The site is the **source of truth** for job postings. Other job boards copy from it:

- **Indeed:** `/demo/jobs.xml` is an Indeed-format XML feed of every open job, generated live from the jobs table. Register `https://sccsc.org/demo/jobs.xml` (or `/jobs.xml` once the redesign moves to the root) with Indeed once, through the Center's Indeed employer account or rep. Indeed re-reads it every few hours, so publishing, editing or closing a job in `/demo/admin/jobs` reaches Indeed on its own. Applicants who click "Apply" on Indeed land on our job page and apply here, so every application stays in our pipeline.
- **Google for Jobs:** each open job page includes `JobPosting` structured data, including pay when the pay field can be read as a range, e.g. `$19.00–$21.00/hour`. Closed jobs drop it.
- **Edit jobs on the site, not on Indeed.** Changes made in Indeed's dashboard are overwritten on the next feed read, and a job closed only on Indeed may come back while it's still open here. Use Indeed's dashboard for sponsoring and stats.
- **Volunteer roles are left out of the Indeed feed**, since Indeed doesn't take unpaid postings; they still appear on our board and on Google. Confirm with the Center's Indeed rep.
- **Before launch:** only register the feed once the site is live on the real domain, because job URLs in the feed use `NEXT_PUBLIC_SITE_URL`. Glassdoor (owned by Indeed) usually picks up the same listings.

## Current WordPress site

`public/` holds a static copy of the current sccsc.org, exported with the Simply Static WordPress plugin. It's served at the root: `next.config.ts` rewrites `/` and `/about-us` (WordPress trailing-slash URLs redirect once to the slashless form) to the exported `index.html` files. It's a snapshot and doesn't change when WordPress does.

- **Only referenced files are copied.** The export was 633 MB, mostly unused media library uploads. The copy keeps the ~550 files the pages actually use (about 64 MB), plus Elementor and GiveWP's asset folders.
- **Form uploads are excluded.** `wp-content/uploads/elementor/forms/` in the export held files people submitted through the site's forms, likely résumés. Never commit that folder.
- **Forms and donations don't work** in the static copy: contact and application forms, and the GiveWP donate form, need WordPress. The redesign's careers portal replaces the application form.
- **Some scripts are missing.** Simply Static didn't export files that WordPress loads on demand: Elementor's script chunks (menus, popups, carousels) and WordPress.com platform files (Gutenberg, Jetpack). Pages render, but some interactive widgets may not. To fix it, re-export with those plugin folders under Simply Static's *Additional Files and Directories*.
- **Fixed in the copy:** Elementor had written server paths (`/srv/htdocs/wp-content/…`) into some image URLs; they now point at `/wp-content/…`. The careers page's custom CSS left an `@media` block unclosed, which unstyled the header on desktop (this bug is on the live site too); the copy closes it.
- **Careers buttons go to AppOne:** the job cards on `/careers/` and the Apply Now buttons on each job page link to the Center's AppOne listings (https://jobs.appone.com/Sacramento-Chinese) instead of the site's application form. Reapply this after refreshing the export.
- **Refreshing it:** re-export, then rebuild `public/` the same way. Keep `public/brand/` and `public/photos/`, and don't add a `robots.txt` (Next generates it).

## Launch checklist (content marked `TODO(client)` in code)

- [ ] Real photos with media releases. Homepage hero: put files in `public/photos/` and set their paths in `heroPhotos` in `src/content/site.ts`. Other placeholders take a `src` prop on `PhotoSlot` the same way.
- [x] Official logo: drop it in `public/brand/` and set `org.logo.src` (plus its width and height) in `src/content/site.ts`. Optionally set `invertedSrc` to a white version for the dark footer.
- [ ] Confirm the summer and early-learning program copy (`src/content/site.ts`)
- [ ] Per-school program list for the Families page (95+ sites)
- [ ] Office hours and a general contact form
- [ ] Leadership and board, and history milestones (About page)
- [ ] Donation destination (`org.donateUrl`)
- [ ] Real job postings with pay ranges. California requires pay scales in job postings for employers with 15+ employees.
- [ ] Email notifications for new applications and status changes (hook in `careers/[slug]/apply/actions.ts`; e.g. Resend)
- [ ] Password reset email (Better Auth `sendResetPassword`, needs an email provider)
- [ ] Register the job feed with Indeed after go-live
- [ ] 301 redirects from old WordPress URLs (`/join-our-team/`, `/staff-directory/...`, etc.) in `next.config.ts`
- [ ] Translations for priority family languages
- [ ] Privacy policy covering applicant data and a résumé retention period

## Security notes

- Authorization is checked in the data layer and in every server action (`requireUser` / `requireAdmin`), not just in layouts. Non-admins get a 404 on `/demo/admin`.
- The `role` field can't be set at sign-up (`input: false`). Admins are created only through the CLI script.
- Résumé uploads: PDF, DOC or DOCX only, 3 MB or less. The file's signature bytes are checked, not just its extension or MIME type. Downloads go through an owner-or-admin check in a server action.
- Post-login redirects accept same-site relative paths only.
- Sign-in is limited to 5 per minute and sign-up to 3 per minute per IP.
