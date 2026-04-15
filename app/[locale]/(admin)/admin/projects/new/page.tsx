import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ProjectNavigation } from "@/components/admin/projects/project-navigation";

export const metadata: Metadata = {
  title: "New Project | Portfolio Galo Durante",
  description: "Create a new project",
};

export default async function NewProjectPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const t = await getTranslations("admin.projects.form");

  return (
    <div>
      <div className="grid gap-8 md:grid-cols-[180px_1fr] transition-all duration-300">
        <ProjectNavigation />
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground mt-1">{t("description")}</p>
          </div>
          {/* <ProjectForm userId={session.user.id} /> */}
        </div>
      </div>
    </div>
  );
}
