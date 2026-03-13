"use server";

import { auth } from "@/lib/auth";
import db from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

export async function uploadAvatar(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  const publicId = `portfolio/avatars/${crypto.randomUUID()}`;

  const result = await uploadImage(file, "portfolio/avatars", {
    publicId,
    width: 400,
    height: 400,
    crop: "fill",
  });

  const userId = session.user.id;

  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

  if (profile?.avatarPublicId) {
    await deleteImage(profile.avatarPublicId);
  }

  if (profile) {
    await db
      .update(profiles)
      .set({
        avatar: result.secure_url,
        avatarPublicId: result.public_id,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId));
  } else {
    await db.insert(profiles).values({
      id: crypto.randomUUID(),
      userId,
      avatar: result.secure_url,
      avatarPublicId: result.public_id,
    });
  }

  return {
    url: result.secure_url,
  };
}

export async function deleteAvatar() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

  if (!profile) return;

  if (profile.avatarPublicId) {
    await deleteImage(profile.avatarPublicId);
  }

  await db
    .update(profiles)
    .set({
      avatar: null,
      avatarPublicId: null,
      updatedAt: new Date(),
    })
    .where(eq(profiles.userId, userId));
}
