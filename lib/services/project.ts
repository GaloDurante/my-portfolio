import db from "@/db";
import { eq, desc } from "drizzle-orm";
import { projects } from "@/db/schema";

import { AppError, mapDbError } from "@/lib/errors/app-error";
import { type ProjectFormData } from "@/lib/schemas/project";

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

export async function createProject(data: { id: string; userId: string; title: string; slug: string }) {
  const now = new Date().toISOString();

  try {
    return await db.insert(projects).values({
      id: data.id,
      userId: data.userId,
      title: data.title,
      slug: data.slug,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    throw mapDbError(error);
  }
}

export async function updateProjectById(projectId: string, data: Partial<ProjectFormData>) {
  try {
  const [existing] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);

  if (!existing) {
    throw new AppError("NOT_FOUND");
  }

  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (typeof data.featured === "boolean") {
    updateData.featured = data.featured ? 1 : 0;
  }

    return await db.update(projects).set(updateData).where(eq(projects.id, projectId));
  } catch (error) {
    throw mapDbError(error);
  }
}

export async function deleteProjectById(projectId: string, userId: string) {
  const [existing] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);

  if (!existing || existing.userId !== userId) {
    throw new AppError("NOT_FOUND");
  }

  return db.delete(projects).where(eq(projects.id, projectId));
}
