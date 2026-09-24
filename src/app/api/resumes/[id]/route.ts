import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { resumes } from "@/db/schema";
import { isUuid } from "@/lib/ids";
import { getCurrentUser } from "@/lib/session";

export async function GET(_request: Request, ctx: RouteContext<"/api/resumes/[id]">) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (!isUuid(id)) return new Response("Not found", { status: 404 });

  const [file] = await getDb().select().from(resumes).where(eq(resumes.id, id));
  // Applicants may only download their own résumé; admins may download any.
  if (!file || (file.userId !== user.id && user.role !== "admin")) {
    return new Response("Not found", { status: 404 });
  }

  const safeName = file.fileName.replace(/[^\w.\- ]+/g, "_");
  return new Response(Buffer.from(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Content-Length": String(file.data.byteLength),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
