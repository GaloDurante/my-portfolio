import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import db from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UploadImageButton } from "@/components/admin/profile/UploadImageButton";
import { RemoveImageButton } from "@/components/admin/profile/RemoveImageButton";
import { User } from "lucide-react";

export const metadata: Metadata = {
  title: "Profile | Portfolio Galo Durante",
  description: "Manage your account settings",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1);

  return (
    <div className="min-h-screen space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground mt-2">
          {`Manage your public presence and professional identity within the CMS.`}
        </p>
      </div>

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
  );
}
