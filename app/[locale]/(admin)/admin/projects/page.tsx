import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getProjectsByUserId } from "@/lib/services/project";

import { Button } from "@/components/ui/button";
import { ProjectList } from "@/components/admin/projects/project-list";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Projects | Portfolio Galo Durante",
  description: "Manage your portfolio projects",
};

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const projects = await getProjectsByUserId(session.user.id);
  const t = await getTranslations("admin.projects");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("welcome")}</p>
        </div>

        <Button asChild className="self-end md:self-auto">
          <Link href="/admin/projects/new">{t("list.buttons.create")}</Link>
        </Button>
      </div>

      <ProjectList projects={projects} userId={session.user.id} />
    </div>
  );
}
