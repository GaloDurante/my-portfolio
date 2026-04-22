"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { type ProjectFormData } from "@/lib/schemas/project";

import { ProjectNavigation, type ProjectTab } from "./form-navigation";
import { ProjectFormBasic } from "./project-form-basic";
import { Layers, Tag, Link2 } from "lucide-react";
// import { ProjectFormMedia } from "./project-form-media";
// import { ProjectFormDetails } from "./project-form-details";

interface ProjectFormProps {
  projectData: ProjectFormData;
}

export function ProjectForm({ projectData }: ProjectFormProps) {
  const t = useTranslations("admin.projects.form");

  const [activeTab, setActiveTab] = useState<ProjectTab>("basic");

  const handleTabChange = (tab: ProjectTab) => {
    setActiveTab(tab);
  };

  const tabTitles: Record<ProjectTab, string> = {
    basic: t("basic.title"),
    media: t("media.title"),
    details: t("details.title"),
  };

  const tabDescriptions: Record<ProjectTab, string> = {
    basic: t("basic.description"),
    media: t("media.description"),
    details: t("details.description"),
  };

  const renderActiveSection = () => {
    if (!projectData.id) return null;

    switch (activeTab) {
      case "basic":
        return (
          <ProjectFormBasic
            projectId={projectData.id}
            defaultValues={{
              title: projectData.title,
              slug: projectData.slug,
              description: projectData.description,
              shortDescription: projectData.shortDescription,
            }}
          />
        );
      case "media":
      // return <ProjectFormMedia userId={userId} projectId={projectId} />;
      case "details":
      // return <ProjectFormDetails userId={userId} projectId={projectId} />;
      default:
        return null;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <ProjectNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="space-y-6 rounded-lg border bg-card p-6">
        <div className="space-y-1">
          <div className="flex gap-2 items-center">
            {activeTab === "basic" && <Layers size={20} />}
            {activeTab === "media" && <Tag size={20} />}
            {activeTab === "details" && <Link2 size={20} />}
            <h2 className="text-lg font-semibold">{tabTitles[activeTab]}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{tabDescriptions[activeTab]}</p>
        </div>

        {renderActiveSection()}
      </div>
    </div>
  );
}
