/**
 * Single source of truth for organization facts used across the site.
 *
 * Everything here was taken from SCCSC's public web presence (sccsc.org page titles/snippets,
 * public job postings, and directory listings) in Sept 2026. Items marked `TODO(client)` need
 * confirmation from the client before launch.
 */

export const org = {
  name: "Sacramento Chinese Community Service Center",
  shortName: "The Center",
  acronym: "SCCSC",
  founded: 1978,
  phone: "(916) 442-4228",
  phoneHref: "tel:+19164424228",
  address: {
    street: "1760 Creekside Oaks Dr, Suite 200",
    city: "Sacramento",
    state: "CA",
    zip: "95833",
  },
  emails: {
    careers: "careers@sccsc.org",
    volunteers: "volunteers@sccsc.org",
  },
  executiveDirector: "Henry Kloczkowski",
  /**
   * Official logo. Drop the file in public/brand/ and set `src` (e.g. "/brand/sccsc-logo.png")
   * plus its pixel size; until then the header shows a text wordmark.
   * TODO(client): supply the logo file (SVG preferred, or a PNG at least 400px wide).
   */
  logo: { src: "/brand/sccsc-logo.png" as string | null, width: 475, height: 127, invertedSrc: null as string | null },
  social: {
    facebook: "https://www.facebook.com/SacChinese/",
    linkedin: "https://www.linkedin.com/company/sacramento-chinese-community-service-center",
  },
  // TODO(client): confirm the preferred donation destination.
  donateUrl: "https://www.bigdayofgiving.org/organization/sccsc",
  mission:
    "To assist immigrants, refugees and other under-served individuals in the greater Sacramento area to achieve economic self-sufficiency, social empowerment, and cultural appreciation by providing quality educational, vocational, human services and health programs.",
  origin:
    "Founded in 1978 to support newly arrived Chinese immigrants navigating the challenges of immigration and cultural adaptation.",
  communities: ["Chinese", "Hmong", "Mien", "Vietnamese", "Ukrainian", "Russian"],
} as const;

/**
 * Homepage hero photos. Upload the files to public/photos/ and set each `src` to its path,
 * e.g. "/photos/hero-1.jpg". Leave `src` as null to show a placeholder. The `alt` text is read
 * aloud by screen readers, so describe what's in the actual photo.
 * TODO(client): use photos with signed media releases for every child pictured.
 */
export const heroPhotos = [
  // Tall photo on the left (portrait, about 4:5, e.g. 1200×1500).
  { src: "/photos/example-3.jpg" as string | null, alt: "Three smiling students in aprons at a school event" },
  // Top-right square (e.g. 1000×1000).
  { src: "/photos/example-1.jpg" as string | null, alt: "A Team Leader helping students with an activity at a classroom table" },
  // Bottom-right square (e.g. 1000×1000).
  { src: "/photos/example-2.png" as string | null, alt: "A staff member smiling as she talks with students at a lunch table" },
];

export const stats = [
  { value: "13,000+", label: "students served every school day" },
  { value: "95+", label: "school sites across the region" },
  { value: "4", label: "school district partners" },
  { value: `${new Date().getFullYear() - org.founded}`, label: `years serving Sacramento (since ${org.founded})` },
] as const;

export const districts = [
  {
    id: "scusd",
    name: "Sacramento City Unified",
    short: "SCUSD",
    blurb: "Before- and after-school programs at elementary, middle and high school campuses across the city.",
  },
  {
    id: "trusd",
    name: "Twin Rivers Unified",
    short: "TRUSD",
    blurb: "After-school enrichment in North Sacramento, including an arts-focused partnership with Creative Connections Arts Academy.",
  },
  {
    id: "nusd",
    name: "Natomas Unified",
    short: "NUSD",
    blurb: "A core program provider since 2018 — about 600 students across 4 sites through LEAP Academy.",
  },
  {
    id: "egusd",
    name: "Elk Grove Unified",
    short: "EGUSD",
    blurb: "Partners since the 2000s, growing alongside one of the region's most diverse communities.",
  },
] as const;

export type DistrictId = (typeof districts)[number]["id"];

// TODO(client): the summer and early-learning copy below is placeholder — confirm details with program staff.
export const programs = [
  {
    id: "expanded-learning",
    name: "Expanded Learning",
    tagline: "Before school, after school, every school day",
    audience: "TK–12 students",
    description:
      "Innovative, youth-driven out-of-school-time programs built on school–community partnerships, family engagement, and project-based enrichment. Students get homework help, hands-on projects, recreation and a safe place to belong.",
    points: ["Before-school care", "After-school enrichment & homework help", "Project-based learning", "Family engagement"],
    color: "jade",
  },
  {
    id: "summer",
    name: "Summer Programs",
    tagline: "No summer slide",
    audience: "TK–12 students",
    description:
      "Summer learning that keeps kids curious, active and connected while school is out.",
    points: ["Enrichment", "Academic support", "Recreation"],
    color: "sun",
  },
  {
    id: "early-learning",
    name: "Early Learning",
    tagline: "A strong start",
    audience: "Early learners & families",
    description:
      "Programs that help the youngest learners build the social, emotional and early-literacy skills they need to thrive in school.",
    points: ["School readiness", "Social–emotional growth", "Family partnership"],
    color: "sky",
  },
  {
    id: "youth-workforce",
    name: "Youth Workforce Development",
    tagline: "First jobs, real skills",
    audience: "Youth ages 16–24",
    description:
      "In partnership with Sacramento Works: job training and paid work experience for in-school youth, with mentoring and support along the way.",
    points: [
      "Career development",
      "Résumé writing & interview skills",
      "Work experience",
      "Occupational skills training",
      "Mentoring, guidance & counseling",
    ],
    color: "vermilion",
  },
  {
    id: "experience-corps",
    name: "AARP Foundation Experience Corps",
    tagline: "Older adults, young readers",
    audience: "Volunteers 50+ and young readers",
    description:
      "We host Experience Corps Sacramento, which recruits and trains adults over 50 to become volunteer reading tutors for struggling readers.",
    points: ["Trained volunteer tutors", "Reading support", "Intergenerational connection"],
    color: "jade",
  },
] as const;

export const mainNav = [
  { href: "/demo/programs", label: "Programs" },
  { href: "/demo/families", label: "Families" },
  { href: "/demo/careers", label: "Careers" },
  { href: "/demo/get-involved", label: "Get Involved" },
  { href: "/demo/about", label: "About" },
] as const;

/** Options surfaced on the application form. */
export const applicationOptions = {
  availability: [
    "Weekday mornings (before school)",
    "Weekday afternoons (after school)",
    "Full days (summer / intersession)",
    "Weekends / special events",
  ],
  education: [
    "High school diploma or GED",
    "Some college (fewer than 48 units)",
    "48+ college units",
    "Para-Educator Certificate",
    "Associate degree",
    "Bachelor's degree or higher",
  ],
  languages: ["English", "Spanish", "Cantonese", "Mandarin", "Hmong", "Mien", "Vietnamese", "Ukrainian", "Russian"],
} as const;

export const jobCategories = {
  "expanded-learning": "Expanded Learning",
  "program-leadership": "Program Leadership",
  administration: "Administration",
  service: "AmeriCorps & Service",
  volunteer: "Volunteer",
} as const;

export const employmentTypes = {
  "part-time": "Part-time",
  "full-time": "Full-time",
  seasonal: "Seasonal",
  "service-term": "Service term",
  volunteer: "Volunteer",
} as const;

export function isLive() {
  return process.env.NEXT_PUBLIC_SITE_LIVE === "true";
}
