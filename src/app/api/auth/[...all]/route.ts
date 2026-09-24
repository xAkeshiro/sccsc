import { getAuth, isPortalConfigured } from "@/lib/auth";

// Resolve the auth instance per request so builds succeed before a database is attached.
function handle(request: Request) {
  if (!isPortalConfigured()) return Response.json({ error: "Careers portal is not configured yet." }, { status: 503 });
  return getAuth().handler(request);
}

export { handle as GET, handle as POST };
