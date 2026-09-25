# sccsc.org site audit (Sept 2026)

**Client:** Sacramento Chinese Community Service Center ("The Center", SCCSC)
**Scope:** Why the current site may not be working for them, and what the rebuild in this repo changes.

> **Method note:** The build environment couldn't load sccsc.org directly (its network policy blocked the domain), so this audit comes from the site's search-indexed pages, URL structure and page titles, plus third-party listings (Glassdoor, Indeed, LinkedIn, directory sites). It does **not** yet cover the visual design, mobile layout, page speed or accessibility. See "Still to verify" at the end.

## What the organization actually is today

- Founded in 1978 to support newly arrived Chinese immigrants. Now serves many communities, including Hmong, Mien, Vietnamese, Ukrainian and Russian families.
- **Runs expanded learning at 95+ school sites and serves 13,000+ students a day** across four districts: Sacramento City, Twin Rivers, Natomas and Elk Grove Unified.
- Also runs youth workforce development (with Sacramento Works), hosts AARP Foundation Experience Corps (volunteer reading tutors aged 50+), and places AmeriCorps VISTA members.
- **A large, mostly hourly workforce** (Team Leaders, coordinators, program managers). Public job boards list 16+ openings at a time. Glassdoor puts the average hire at about 8 days, with quick Zoom interviews.

In practice, SCCSC is now one of the region's largest after-school providers and a high-volume employer. The website should be built around that.

## Why the current site likely isn't working for them

### 1. The site doesn't handle hiring, their biggest operational need
- The "Join Our Team" page tells candidates to email **careers@sccsc.org** or apply through Indeed or Glassdoor. There's also a separate `/team-leader/now-hiring/` landing page.
- As a result:
  - Applicants leave the site for third-party boards, where SCCSC competes with other employers' ads and sits beside its 3.5★ Glassdoor rating.
  - HR works from inbox attachments and several job boards, with no single pipeline.
  - Candidates can't see their application status.
  - Leadership can't easily answer "how many applicants do we have for Natomas Team Leaders?"
- This lines up with the client's ask for **a portal where people can log in and apply directly**.

### 2. The site is organized around the org chart, not around visitors
The URL structure shows how content is filed:

| URL | What it reveals |
|---|---|
| `/staff-directory/contact-scusd/` | Contact info for parents is filed under a *staff directory* |
| `/staff-directory/contact-aos/` | Program contact pages named by internal acronym ("AOS" = Academy of Scholars) |
| `/team-leader/now-hiring/` | A hiring page separate from `/join-our-team/` |
| `/americorps-vista/` | A service program at the site root |
| `/join-our-team/experience-corps-volunteers/` | A volunteer "onboarding portal" nested under jobs |

A parent who wants to know whether there's a program at their child's school has to know their district's acronym and look in a "staff directory." The site has four main audiences (families, job seekers, volunteers, donors and partners), and none of them has a clear path.

### 3. The web presence is split up
- The main WordPress site is joined by a **separate Wix site** (`ccaaexpandedlearning.wixsite.com/sccscafterschool`) for the Twin Rivers / Creative Connections Arts Academy program.
- Old uploads (for example `wp-content/uploads/2021/04/4thR-Transition-FAQs.pdf`) are still indexed.
- That means different looks and messages depending on where people land, and more sites for staff to maintain.

### 4. The identity doesn't match the work (probably the "vibe" problem)
- The heritage is real and worth honoring. But today's organization is mainly a lively, multicultural youth-programs provider, and most visitors are parents and job applicants.
- The organization already goes by **"The Center"** on LinkedIn and Indeed, while the site leads with the full legacy name.
- If the site reads like a traditional social-services agency brochure, it undersells what happens every afternoon at 95+ schools. *(This is a hypothesis to confirm with the client. Ask what "vibe" they're after and show them the rebuild.)*

### 5. The details are inconsistent, a sign of piecemeal updates
- Some page titles are tuned for search ("Expanded Learning Programs Sacramento | After-School Programs | SCCSC"). Others are WordPress defaults ("Join Our Team – Sacramento Chinese Community Service Center", "Now-Hiring – …").
- The name varies across the web: "SCCSC," "The Center," "The Center (SCCSC)," and the full name.
- A `site:sccsc.org` search returns very few pages, so search coverage is thin.

## Found in the site export

A Simply Static export of the WordPress site (September 2026) turned up a few concrete problems:

- **Broken careers page header on desktop.** A custom CSS snippet on the Careers page opens `@media (max-width: 767px) {` and never closes it. Every style after it, including the site header, then only applies on phones, so desktop visitors get a stacked, unstyled header with green Elementor-default buttons. It's on the page candidates are most likely to land on.
- **Broken image paths.** Elementor saved some image URLs as server paths (`/srv/htdocs/wp-content/…`), which don't load outside WordPress.com's servers.
- **Applicant files stored in the web uploads folder.** Around 430 files submitted through the site's forms, likely résumés, sit in `wp-content/uploads/elementor/forms/`, the public uploads directory. They're only hidden by their random file names. The redesign keeps résumés in the database and serves them only to the applicant and admins.
- **A heavy media library.** The export was 633 MB, but the pages use about 50 MB of it. Some photos are 8–11 MB originals.
- **Stack sprawl.** Elementor and Elementor Pro, GiveWP, Rank Math, a static-export plugin and a migration plugin, on WordPress.com hosting, plus Jetpack and Gutenberg.

## What the rebuild changes

| Problem | Rebuild |
|---|---|
| Hiring routed off-site to email and Indeed | **First-party careers portal**: job board, applicant accounts, online application with résumé upload, applicant status tracking, admin review pipeline and job posting management |
| Org-chart structure | **Audience-first navigation**: Programs · Families · Careers · Get Involved · About, plus a "How can we help you today?" section on the homepage |
| Parents can't find their program | **Families page** organized by district, with a clear "what a day looks like" |
| Split presence | One site. The Wix program page and stray PDFs can be folded in and redirected. |
| Identity mismatch | Leads with kids and belonging ("after the bell"). Uses "The Center" as the everyday name. Heritage is kept in a story section, "Since 1978," and a subtle lattice motif. |
| Inconsistent details | Every org fact lives in `src/content/site.ts`. Consistent page titles and metadata. Sitemap and robots. |
| Hiring pitch buried | A hiring band on the homepage plus a dedicated careers page that lists the perks (flexible shifts, work in your own community, bilingual staff welcome) |

## Still to verify (once sccsc.org is reachable or the client shares access)

- [ ] Visual review of the current site on desktop and phone (screenshots for the pitch deck)
- [ ] Page speed and Core Web Vitals (PageSpeed Insights)
- [ ] Accessibility scan (contrast, headings, form labels)
- [ ] Whether any content is translated (it should be, for the families they serve)
- [ ] Full list of current pages, to build a 301 redirect map
- [ ] Analytics: top landing pages and where job applicants come from today
- [ ] Which ATS or HR system (if any) the portal should hand hires off to

## Questions for the client

1. What does "doesn't fit our vibe" mean to them? Who's the primary audience they picture?
2. Do they want to lead with "The Center" as the brand, keeping the full name as the legal name?
3. Who at HR will manage postings and applications? Do they need email notifications, and to whom?
4. Do they have program photos with media releases? (This is the single biggest visual upgrade.)
5. Which languages matter most for families (Spanish, Cantonese, Hmong, Vietnamese…)?
6. Do they want per-school program listings (95+ sites) on the Families page?
