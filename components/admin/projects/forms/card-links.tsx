"use client";

import { useTranslations } from "next-intl";
import { UseFormRegister, FieldErrors } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Link2 } from "lucide-react";
import type { ProjectFormData } from "@/lib/schemas/project";

interface ProjectCardLinksProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
}

export function ProjectCardLinks({ register, errors }: ProjectCardLinksProps) {
  const t = useTranslations("admin.projects.form");

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2">
        <Link2 size={20} />
        <div>
          <h2 className="text-lg font-semibold">{t("links.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("links.description")}</p>
        </div>
      </div>

      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.demoUrl}>
            <FieldLabel htmlFor="demoUrl">{t("links.fields.demo.label")}</FieldLabel>
            <Input
              id="demoUrl"
              type="url"
              {...register("demoUrl")}
              placeholder={t("links.fields.demo.placeholder")}
              onChange={(e) => {
                register("demoUrl").onChange(e);
              }}
            />
          </Field>

          <Field data-invalid={!!errors.repoUrl}>
            <FieldLabel htmlFor="repoUrl">{t("links.fields.repo.label")}</FieldLabel>
            <Input
              id="repoUrl"
              type="url"
              {...register("repoUrl")}
              placeholder={t("links.fields.repo.placeholder")}
              onChange={(e) => {
                register("repoUrl").onChange(e);
              }}
            />
          </Field>
        </div>
      </FieldGroup>
    </div>
  );
}
