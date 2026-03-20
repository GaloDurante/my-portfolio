import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import db from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UploadImageButton } from "@/components/admin/settings/UploadImageButton";
import { RemoveImageButton } from "@/components/admin/settings/RemoveImageButton";
import { User } from "lucide-react";

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
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Settings</h1>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Profile Picture</h2>
          <p className="mb-6 text-muted-foreground">Upload a profile picture to personalize your account.</p>

          <div className="flex items-center gap-6">
            {currentUser.avatar ? (
              <>
                <Avatar className="size-32">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <RemoveImageButton />
              </>
            ) : (
              <>
                <div className="size-32 rounded-full bg-muted flex items-center justify-center border">
                  <User size={42} className="text-muted-foreground" />
                </div>
                <UploadImageButton />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
