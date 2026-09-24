const DEFAULT_SITE_URL = "https://sccsc.org";

/**
 * Canonical site origin. Tolerates the env var being blank (as Vercel stores unset-but-declared
 * vars), missing a protocol ("sccsc.org"), or malformed — any of which would otherwise crash the build.
 */
export function siteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return new URL(DEFAULT_SITE_URL);
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}
