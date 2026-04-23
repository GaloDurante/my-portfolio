"use client";

import { useTranslations } from "next-intl";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Calendar } from "lucide-react";
import type { ProjectFormData } from "@/lib/schemas/project";

interface ProjectCardDatesProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
}

export function ProjectCardDates({ register, errors }: ProjectCardDatesProps) {
  const t = useTranslations("admin.projects.form");

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2">
        <Calendar size={20} />
        <div>
          <h2 className="text-lg font-semibold">{t("dates.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("dates.description")}</p>
        </div>
      </div>

      {/* <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.startDate}>
            <FieldLabel htmlFor="startDate">{t("dates.fields.start.label")}</FieldLabel>
            <Input
              id="startDate"
              type="date"
              {...register("startDate")}
              onChange={(e) => {
                register("startDate").onChange(e);
              }}
            />
          </Field>

          <Field data-invalid={!!errors.endDate}>
            <FieldLabel htmlFor="endDate">{t("dates.fields.end.label")}</FieldLabel>
            <Input
              id="endDate"
              type="date"
              {...register("endDate")}
              onChange={(e) => {
                register("endDate").onChange(e);
              }}
            />
          </Field>
        </div>
      </FieldGroup> */}
    </div>
  );
}
