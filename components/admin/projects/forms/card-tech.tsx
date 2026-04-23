"use client";

import { useTranslations } from "next-intl";
import { UseFormRegister, FieldErrors } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Tag } from "lucide-react";
import type { ProjectFormData } from "@/lib/schemas/project";

interface ProjectCardTechProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
}

export function ProjectCardTech({ register, errors }: ProjectCardTechProps) {
  const t = useTranslations("admin.projects.form");

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2">
        <Tag size={20} />
        <div>
          <h2 className="text-lg font-semibold">{t("tech.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("tech.description")}</p>
        </div>
      </div>

      {/* <Field data-invalid={!!errors.technologies}>
        <FieldLabel htmlFor="technologies">{t("tech.fields.technologies.label")}</FieldLabel>
        <Textarea
          id="technologies"
          {...register("technologies")}
          placeholder={t("tech.fields.technologies.placeholder")}
          rows={4}
          onChange={(e) => {
            register("technologies").onChange(e);
          }}
        />
        <FieldDescription>{t("tech.fields.technologies.helper")}</FieldDescription>
      </Field> */}
    </div>
  );
}
