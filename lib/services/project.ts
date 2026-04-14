import db from "@/db";
import { eq, desc } from "drizzle-orm";
import { projects } from "@/db/schema";

export async function getProjectsByUserId(userId: string) {
  return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.order));
}

export async function getProjectById(projectId: string, userId: string) {
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);

  if (!project || project.userId !== userId) {
    return null;
  }

  return project;
}

export async function getProjectBySlug(slug: string, userId: string) {
  const [project] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);

  if (!project || project.userId !== userId) {
    return null;
  }

  return project;
}
