import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getUserById } from "@/lib/services/user";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UploadImageButton } from "@/components/admin/profile/UploadImageButton";
import { RemoveImageButton } from "@/components/admin/profile/RemoveImageButton";
import { ProfileForm } from "@/components/admin/profile/profileForm";

export const metadata: Metadata = {
  title: "Profile | Portfolio Galo Durante",
  description: "Manage your profile information",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await getUserById(session.user.id);
  const t = await getTranslations("admin.profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("welcome")}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr] xl:grid-cols-[320px_1fr] transition-all duration-300">
        <div className="flex flex-col items-center gap-6 rounded-lg border bg-card p-6 h-fit">
          {currentUser.avatar ? (
            <Avatar className="size-32 xl:size-52">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>
                <span className="text-muted-foreground text-3xl">{currentUser?.name?.[0]?.toUpperCase()}</span>
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="size-32 xl:size-52 rounded-full bg-muted flex items-center justify-center border">
              <span className="text-muted-foreground text-3xl xl:text-4xl">
                {currentUser?.name?.[0]?.toUpperCase()}
              </span>
            </div>
          )}

          <div>
            <p className="text-center">{currentUser.name}</p>
            <p className="text-center text-sm text-muted-foreground">{currentUser.title}</p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            {currentUser.avatar ? <RemoveImageButton /> : <UploadImageButton />}
          </div>
        </div>

        <ProfileForm
          defaultValues={{
            name: currentUser.name || "",
            title: currentUser.title || "",
            email: currentUser.email || "",
            bio: currentUser.bio || "",
            shortBio: currentUser.shortBio || "",
            location: currentUser.location || "",
            website: currentUser.website || "",
            github: currentUser.github || "",
            linkedin: currentUser.linkedin || "",
          }}
          userId={currentUser.id}
        />
      </div>
    </div>
  );
}
