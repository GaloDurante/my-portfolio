import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AvatarUploader } from "@/components/admin/AvatarUploader";

import db from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Settings | Portfolio Galo Durante",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1);

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Settings</h1>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Profile Picture</h2>

          <p className="mb-6 text-muted-foreground">Upload a profile picture to personalize your account.</p>

          <AvatarUploader value={currentUser?.avatar} />
        </div>
      </div>
    </div>
  );
}
