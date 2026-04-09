import db from "@/db";
import { user, projects, technologies } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function getAdminDashboardData({ userId }: { userId: string }) {
  const [[currentUser], [projectCount], [techCount]] = await Promise.all([
    db.select().from(user).where(eq(user.id, userId)).limit(1),

    db.select({ count: count() }).from(projects).where(eq(projects.userId, userId)),

    db.select({ count: count() }).from(technologies).where(eq(technologies.userId, userId)),
  ]);

  return {
    currentUser,
    projectCount: projectCount.count,
    techCount: techCount.count,
  };
}
