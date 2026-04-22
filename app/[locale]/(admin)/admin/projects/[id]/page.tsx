import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getProjectById } from "@/lib/services/project";

import { ProjectForm } from "@/components/admin/projects/forms/project-form";

export const metadata: Metadata = {
  title: "Edit Project | Portfolio Galo Durante",
  description: "Edit project details",
};

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const project = await getProjectById(id, session.user.id);

  if (!project) {
    notFound();
  }

  const t = await getTranslations("admin.projects.form");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <p className="text-muted-foreground mt-1">{t("label")}</p>
      </div>
      <ProjectForm projectData={project} />
    </div>
  );
}
