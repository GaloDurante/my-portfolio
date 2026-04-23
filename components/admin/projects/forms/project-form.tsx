"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";

import { buildProjectSchema, type ProjectFormData } from "@/lib/schemas/project";
import { updateProjectAction } from "@/lib/actions/project-actions";
import { applyServerValidationErrors } from "@/lib/utils";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Save, RotateCcw } from "lucide-react";

import {
  ProjectCardBasic,
  ProjectCardDates,
  ProjectCardLinks,
  ProjectCardMedia,
  ProjectCardSettings,
  ProjectCardTech,
} from "@/components/admin/projects/forms";

interface ProjectFormProps {
  projectData: ProjectFormData;
}

export function ProjectForm({ projectData }: ProjectFormProps) {
  const t = useTranslations("admin.projects.form");
  const schema = buildProjectSchema(t);
  const router = useRouter();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: projectData.id,
      title: projectData.title,
      slug: projectData.slug,
      description: projectData.description,
      shortDescription: projectData.shortDescription,
      thumbnail: projectData.thumbnail,
      images: projectData.images,
      technologies: projectData.technologies,
      demoUrl: projectData.demoUrl,
      repoUrl: projectData.repoUrl,
      featured: projectData.featured,
      status: projectData.status,
      order: projectData.order,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await updateProjectAction(projectData.id, data);

    if (!result.success) {
      if (result.code === "VALIDATION_ERROR") {
        applyServerValidationErrors(form, result.errors.fieldErrors);
        return;
      }

      toast.error(t("submit.error.title"), {
        description: result.message,
      });
      return;
    }

    toast.success(t("submit.success.title"), {
      description: t("submit.success.description"),
    });
    form.reset(data);
    router.refresh();
  });

  const isPending = form.formState.isSubmitting;
  const isDirty = form.formState.isDirty;

  const handleDiscard = () => {
    form.reset();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{projectData.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("label")}</p>
          </div>

          <div className="flex items-center gap-2">
            {isDirty && (
              <>
                <Button type="button" variant="outline" onClick={handleDiscard}>
                  <RotateCcw size={16} data-icon="inline-start" />
                  {t("buttons.discard")}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Spinner data-icon="inline-start" />}
                  <Save size={16} data-icon="inline-start" />
                  {t("buttons.save")}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <ProjectCardBasic register={form.register} errors={form.formState.errors} setValue={form.setValue} />
            <ProjectCardLinks register={form.register} errors={form.formState.errors} />
            <ProjectCardMedia register={form.register} errors={form.formState.errors} />
          </div>

          <div className="space-y-6">
            <ProjectCardSettings
              register={form.register}
              errors={form.formState.errors}
              watch={form.watch}
              setValue={form.setValue}
            />
            <ProjectCardDates register={form.register} errors={form.formState.errors} />
            <ProjectCardTech register={form.register} errors={form.formState.errors} />
          </div>
        </div>
      </div>
    </form>
  );
}
