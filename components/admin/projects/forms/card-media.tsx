"use client";

import { useTranslations } from "next-intl";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Image } from "lucide-react";
import type { ProjectFormData } from "@/lib/schemas/project";

interface ProjectCardMediaProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
}

export function ProjectCardMedia({ register, errors }: ProjectCardMediaProps) {
  const t = useTranslations("admin.projects.form");

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2">
        <Image size={20} />
        <div>
          <h2 className="text-lg font-semibold">{t("media.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("media.description")}</p>
        </div>
      </div>

      {/* <FieldGroup>
        <Field data-invalid={!!errors.thumbnail}>
          <FieldLabel htmlFor="thumbnail">{t("media.fields.thumbnail.label")}</FieldLabel>
          <Input
            id="thumbnail"
            type="url"
            {...register("thumbnail")}
            placeholder={t("media.fields.thumbnail.placeholder")}
            onChange={(e) => {
              register("thumbnail").onChange(e);
            }}
          />
          <FieldDescription>{t("media.fields.thumbnail.helper")}</FieldDescription>
        </Field>

        <Field data-invalid={!!errors.images}>
          <FieldLabel htmlFor="images">{t("media.fields.images.label")}</FieldLabel>
          <Textarea
            id="images"
            {...register("images")}
            placeholder={t("media.fields.images.placeholder")}
            rows={4}
            onChange={(e) => {
              register("images").onChange(e);
            }}
          />
          <FieldDescription>{t("media.fields.images.helper")}</FieldDescription>
        </Field>
      </FieldGroup> */}
    </div>
  );
}
