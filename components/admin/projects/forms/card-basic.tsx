"use client";

import { useTranslations } from "next-intl";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Layers, Wand2 } from "lucide-react";
import type { ProjectFormData } from "@/lib/schemas/project";
import { generateSlug } from "@/lib/utils";

interface ProjectCardBasicProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  setValue: UseFormSetValue<ProjectFormData>;
}

export function ProjectCardBasic({ register, errors, setValue }: ProjectCardBasicProps) {
  const t = useTranslations("admin.projects.form");

  const handleAutoGenerate = () => {
    const title = document.getElementById("title") as HTMLInputElement;
    if (title?.value) {
      setValue("slug", generateSlug(title.value), { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2">
        <Layers size={20} />
        <div>
          <h2 className="text-lg font-semibold">{t("basic.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("basic.description")}</p>
        </div>
      </div>

      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="title">{t("basic.fields.title.label")}</FieldLabel>
            <Input
              id="title"
              {...register("title")}
              placeholder={t("basic.fields.title.placeholder")}
              aria-invalid={!!errors.title}
            />
            <FieldError>{errors.title?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.slug}>
            <FieldLabel htmlFor="slug">{t("basic.fields.slug.label")}</FieldLabel>
            <div className="flex items-center gap-2">
              <Input
                id="slug"
                {...register("slug")}
                placeholder={t("basic.fields.slug.placeholder")}
                aria-invalid={!!errors.slug}
              />
              <Button type="button" variant="outline" className="mt-auto text-foreground" onClick={handleAutoGenerate}>
                <Wand2 size={16} data-icon="inline-start" />
                <span className="hidden md:inline">{t("createModal.buttons.autoGenerate")}</span>
              </Button>
            </div>
            <FieldError>{errors.slug?.message}</FieldError>
            <FieldDescription>{t("basic.fields.slug.helper")}</FieldDescription>
          </Field>
        </div>

        <Field data-invalid={!!errors.shortDescription}>
          <FieldLabel htmlFor="shortDescription">{t("basic.fields.shortDescription.label")}</FieldLabel>
          <Textarea
            id="shortDescription"
            {...register("shortDescription")}
            placeholder={t("basic.fields.shortDescription.placeholder")}
            rows={2}
            aria-invalid={!!errors.shortDescription}
          />
          <FieldError>{errors.shortDescription?.message}</FieldError>
          <FieldDescription>{t("basic.fields.shortDescription.helper")}</FieldDescription>
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="description">{t("basic.fields.description.label")}</FieldLabel>
          <Textarea
            id="description"
            {...register("description")}
            placeholder={t("basic.fields.description.placeholder")}
            rows={6}
            aria-invalid={!!errors.description}
          />
          <FieldError>{errors.description?.message}</FieldError>
        </Field>
      </FieldGroup>
    </div>
  );
}
