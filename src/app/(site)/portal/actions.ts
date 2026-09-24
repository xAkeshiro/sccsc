"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { applicationEvents, applications } from "@/db/schema";
import { isUuid } from "@/lib/ids";
import { requireUser } from "@/lib/session";
import { withdrawableStatuses } from "@/lib/status";

export async function withdrawApplication(applicationId: string) {
  const user = await requireUser("/portal");
  if (!isUuid(applicationId)) return;
  const db = getDb();
  const updated = await db
    .update(applications)
    .set({ status: "withdrawn", updatedAt: new Date() })
    .where(
      and(
        eq(applications.id, applicationId),
        eq(applications.userId, user.id),
        inArray(applications.status, withdrawableStatuses),
      ),
    )
    .returning({ id: applications.id });
  if (updated.length) {
    await db.insert(applicationEvents).values({ applicationId, status: "withdrawn", actorId: user.id });
  }
  revalidatePath("/portal");
}
