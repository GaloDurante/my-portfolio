import { z } from "zod";
import { TranslatorType } from "@/lib/types/i18n";

export const createProjectSchema = (t: TranslatorType) =>
  z.object({
    title: z
      .string()
      .min(1, t("createModal.fields.title.errorMessage.minLength"))
      .max(200, t("createModal.fields.title.errorMessage.maxLength")),
    slug: z
      .string()
      .min(1, t("createModal.fields.slug.errorMessage.minLength"))
      .max(200, t("createModal.fields.slug.errorMessage.maxLength"))
      .regex(/^[a-z0-9-]+$/, t("createModal.fields.slug.errorMessage.pattern")),
  });

export type ProjectFormData = z.infer<ReturnType<typeof createProjectSchema>>;
