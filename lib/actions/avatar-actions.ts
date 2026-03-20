"use server";

import { auth } from "@/lib/auth";
import db from "@/db";
import { user } from "@/db/schema";
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

  const [currentUser] = await db.select().from(user).where(eq(user.id, userId)).limit(1);

  if (!currentUser) throw new Error("User not found");

  if (currentUser.avatarPublicId) {
    await deleteImage(currentUser.avatarPublicId);
  }

  await db
    .update(user)
    .set({
      avatar: result.secure_url,
      avatarPublicId: result.public_id,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId));

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

  const [currentUser] = await db.select().from(user).where(eq(user.id, userId)).limit(1);

  if (!currentUser) throw new Error("User not found");

  if (currentUser.avatarPublicId) {
    await deleteImage(currentUser.avatarPublicId);
  }

  await db
    .update(user)
    .set({
      avatar: null,
      avatarPublicId: null,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId));
}
