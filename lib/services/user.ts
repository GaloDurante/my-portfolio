import db from "@/db";
import { eq, count } from "drizzle-orm";
import { user, projects, technologies } from "@/db/schema";

import { ProfileFormData } from "@/lib/schemas/profile";
import { AppError } from "@/lib/errors/app-error";

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

export async function getUserById(userId: string) {
  const [currentUser] = await db.select().from(user).where(eq(user.id, userId)).limit(1);
  return currentUser;
}

export async function updateUserData(data: ProfileFormData, userId: string) {
  try {
    const result = await db.update(user).set(data).where(eq(user.id, userId)).returning();

    if (result.length === 0) {
      throw new AppError("USER_NOT_FOUND");
    }

    return result[0];
  } catch (error) {
    console.error("DB error updating user:", error);

    throw new AppError("DB_UPDATE_FAILED");
  }
}
