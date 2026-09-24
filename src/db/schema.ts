import {
  bigint,
  boolean,
  customType,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*  Better Auth tables (field names must match Better Auth's core schema)     */
/* -------------------------------------------------------------------------- */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  // "applicant" | "admin" — set server-side only (see `input: false` in lib/auth.ts)
  role: text("role").notNull().default("applicant"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Database-backed rate limiting so login throttling works across serverless instances.
export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

/* -------------------------------------------------------------------------- */
/*  Careers portal                                                            */
/* -------------------------------------------------------------------------- */

const bytea = customType<{ data: Uint8Array; driverData: Uint8Array }>({
  dataType() {
    return "bytea";
  },
});

export const JOB_STATUSES = ["draft", "open", "closed"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    employmentType: text("employment_type").notNull(),
    location: text("location").notNull(),
    district: text("district"),
    payRange: text("pay_range"),
    schedule: text("schedule"),
    summary: text("summary").notNull(),
    description: text("description").notNull().default(""),
    responsibilities: text("responsibilities").array().notNull().default([]),
    qualifications: text("qualifications").array().notNull().default([]),
    status: text("status").$type<JobStatus>().notNull().default("draft"),
    postedAt: timestamp("posted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("jobs_status_idx").on(t.status)],
);

export const applicantProfiles = pgTable("applicant_profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  phone: text("phone"),
  city: text("city"),
  educationLevel: text("education_level"),
  languages: text("languages").array().notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const resumes = pgTable("resumes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  data: bytea("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const APPLICATION_STATUSES = [
  "submitted",
  "reviewing",
  "interview",
  "offer",
  "hired",
  "not_selected",
  "withdrawn",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "restrict" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: text("status").$type<ApplicationStatus>().notNull().default("submitted"),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    city: text("city"),
    preferredDistricts: text("preferred_districts").array().notNull().default([]),
    availability: text("availability").array().notNull().default([]),
    earliestStart: text("earliest_start"),
    educationLevel: text("education_level"),
    languages: text("languages").array().notNull().default([]),
    coverNote: text("cover_note"),
    resumeId: uuid("resume_id").references(() => resumes.id, { onDelete: "set null" }),
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("applications_job_user_idx").on(t.jobId, t.userId),
    index("applications_status_idx").on(t.status),
  ],
);

export const applicationEvents = pgTable(
  "application_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    status: text("status").$type<ApplicationStatus>().notNull(),
    actorId: text("actor_id").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("application_events_app_idx").on(t.applicationId)],
);

export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
