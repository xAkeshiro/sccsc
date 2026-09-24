import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { Database } from "../../src/db";
import * as schema from "../../src/db/schema";

/** Returns true when a new account was created. */
export async function upsertAdmin(
  db: Database,
  input: { email: string; name: string; password?: string },
  opts: { onlyIfMissing?: boolean } = {},
) {
  const email = input.email.trim().toLowerCase();
  const [existing] = await db.select().from(schema.user).where(eq(schema.user.email, email));

  if (existing) {
    if (opts.onlyIfMissing) return false;
    await db.update(schema.user).set({ role: "admin", updatedAt: new Date() }).where(eq(schema.user.id, existing.id));
    console.log(`✓ Promoted ${email} to admin`);
    return false;
  }

  if (!input.password || input.password.length < 12) {
    throw new Error("Set ADMIN_PASSWORD (12+ characters) to create a new admin account.");
  }
  const id = randomUUID();
  await db.insert(schema.user).values({ id, email, name: input.name, role: "admin", emailVerified: true });
  await db.insert(schema.account).values({
    id: randomUUID(),
    userId: id,
    accountId: id,
    providerId: "credential",
    password: await hashPassword(input.password),
  });
  console.log(`✓ Created admin ${email}`);
  return true;
}
