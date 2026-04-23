"use client";

import { useTranslations } from "next-intl";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Tag } from "lucide-react";
import type { ProjectFormData } from "@/lib/schemas/project";

interface ProjectCardSettingsProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  watch: (name: "status" | "featured") => string | boolean | null | undefined;
  setValue: UseFormSetValue<ProjectFormData>;
}

export function ProjectCardSettings({ register, errors, watch, setValue }: ProjectCardSettingsProps) {
  const t = useTranslations("admin.projects.form");

  return (
    // agregar componente reusable para los titulos + icono + descripcion
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2">
        <Tag size={20} />
        <div>
          <h2 className="text-lg font-semibold">{t("settings.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("settings.description")}</p>
        </div>
      </div>

      <FieldGroup>
        <Field data-invalid={!!errors.status}>
          <FieldLabel htmlFor="status">{t("settings.fields.status.label")}</FieldLabel>
          <Select
            value={(watch("status") as string) || ""}
            onValueChange={(value) => {
              setValue("status", value as "draft" | "published", { shouldDirty: true });
            }}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder={t("settings.fields.status.placeholder")} />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="draft">{t("settings.fields.status.draft")}</SelectItem>
              <SelectItem value="published">{t("settings.fields.status.published")}</SelectItem>
            </SelectContent>
          </Select>
          <FieldError>{errors.status?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.order}>
          <FieldLabel htmlFor="order">{t("settings.fields.order.label")}</FieldLabel>
          <Input
            id="order"
            type="number"
            {...register("order", {
              setValueAs: (v) => {
                if (v === "" || v === 0) return 0;
                const parsed = Number(v);
                return isNaN(parsed) ? 0 : parsed;
              },
            })}
            aria-invalid={!!errors.order}
          />
          <FieldError>{errors.order?.message}</FieldError>
          <FieldDescription>{t("settings.fields.order.helper")}</FieldDescription>
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="featured">{t("settings.fields.featured.label")}</FieldLabel>
            <Switch
              id="featured"
              checked={!!watch("featured")}
              onCheckedChange={(checked) => {
                setValue("featured", checked, { shouldDirty: true });
              }}
            />
          </div>
          <FieldDescription>{t("settings.fields.featured.helper")}</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  );
}
