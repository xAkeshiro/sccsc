import type { jobs } from "./schema";

/**
 * SAMPLE postings so the careers portal has something to show. Titles and duties are drawn from
 * SCCSC's public job listings; pay and schedules are intentionally left for HR to fill in.
 * Replace (or close) these from /admin before launch.
 */
export const sampleJobs: (typeof jobs.$inferInsert)[] = [
  {
    slug: "expanded-learning-team-leader",
    title: "Expanded Learning Team Leader (After School)",
    category: "expanded-learning",
    employmentType: "part-time",
    location: "School sites across Sacramento, Natomas, Twin Rivers & Elk Grove",
    schedule: "Weekday afternoons during the school year — hours vary by site",
    summary:
      "Be the heart of an after-school program: keep students safe, engaged and inspired while leading activities that make learning fun.",
    description:
      "As a Team Leader you'll lead a group of TK–12 students at one of our partner school sites, shaping positive experiences and building connections with families and your community. It's a great fit if you're considering a career in education, youth development or social services.",
    responsibilities: [
      "Maintain a safe, supportive environment and manage a group of up to 20 students",
      "Plan and lead age-appropriate activities that support social, emotional and academic growth",
      "Provide homework help, enrichment and recreation",
      "Take part in staff meetings and professional development",
    ],
    qualifications: [
      "48 units of college coursework OR a Para-Educator Certificate (requirements may vary by district)",
      "An Associate's degree or higher in Child Development, Education, Social Services, Psychology or a related field is highly desirable",
      "Experience working with children or youth",
      "Bilingual candidates encouraged to apply",
    ],
    status: "open",
  },
  {
    slug: "summer-program-team-leader",
    title: "Summer Program Team Leader",
    category: "expanded-learning",
    employmentType: "seasonal",
    location: "Partner school sites, Sacramento region",
    schedule: "Full days during summer break",
    summary: "Lead a group of students through a summer of enrichment, recreation and learning.",
    description:
      "Our summer programs keep students curious and connected while school is out. Team Leaders guide a consistent group of students through daily activities and help make summer something kids look forward to.",
    responsibilities: [
      "Lead daily enrichment and recreation activities",
      "Supervise students and maintain a safe environment",
      "Communicate with families at pick-up and drop-off",
    ],
    qualifications: [
      "48 units of college coursework OR a Para-Educator Certificate (requirements may vary by district)",
      "Energy, patience and a love of working with kids",
    ],
    status: "open",
  },
  {
    slug: "expanded-learning-program-manager",
    title: "Expanded Learning Program Manager",
    category: "program-leadership",
    employmentType: "full-time",
    location: "Sacramento region (multiple school sites) + Creekside Oaks office",
    summary:
      "Oversee day-to-day quality across a portfolio of expanded learning sites and coach the site teams who run them.",
    description:
      "Program Managers support site staff, partner with school administrators and families, and make sure every program meets our standards for safety, quality and student engagement.",
    responsibilities: [
      "Coach and support site coordinators and Team Leaders",
      "Build relationships with principals and district partners",
      "Monitor program quality, attendance and compliance",
      "Help recruit, onboard and train new staff",
    ],
    qualifications: [
      "Experience supervising youth programs or school-based staff",
      "Bachelor's degree in Education, Child Development, Social Work or a related field preferred",
      "Reliable transportation to travel between school sites",
    ],
    status: "open",
  },
  {
    slug: "americorps-vista-technology-systems",
    title: "AmeriCorps VISTA — Technology Systems",
    category: "service",
    employmentType: "service-term",
    location: "Sacramento (Creekside Oaks office)",
    schedule: "12-month service term",
    summary:
      "Serve a 12-month AmeriCorps VISTA term strengthening the technology systems behind our Experience Corps volunteer program.",
    description:
      "In partnership with AmeriCorps VISTA, this member will help build lasting capacity for the Experience Corps Volunteer Program team, with a focus on technology systems management.",
    responsibilities: [
      "Improve the systems used to recruit, onboard and track volunteers",
      "Document processes so improvements last beyond the service term",
      "Support data collection and reporting",
    ],
    qualifications: ["Eligible to serve as an AmeriCorps VISTA member", "Comfort with technology and learning new tools"],
    status: "open",
  },
  {
    slug: "experience-corps-volunteer-reading-tutor",
    title: "Experience Corps Volunteer Reading Tutor (50+)",
    category: "volunteer",
    employmentType: "volunteer",
    location: "Partner elementary schools, Sacramento region",
    schedule: "School-year commitment; recruitment for the next school year starts in summer",
    summary:
      "Adults over 50: become a trained reading tutor with AARP Foundation Experience Corps and help young students become confident readers.",
    description:
      "Experience Corps Sacramento recruits and trains older adults to tutor students who are struggling with reading. You'll receive training and ongoing support from our team.",
    responsibilities: ["Tutor students in reading on a regular weekly schedule", "Attend volunteer training"],
    qualifications: ["Age 50 or older", "Passion for reading and helping kids succeed"],
    status: "open",
  },
];
