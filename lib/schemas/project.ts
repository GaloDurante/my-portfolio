import { z } from "zod";
import { TranslatorType } from "@/lib/types/i18n";

export const createProjectSchema = (t: TranslatorType) =>
  z.object({
    title: z
      .string()
      .min(1, t("basic.fields.title.errorMessage.minLength"))
      .max(200, t("basic.fields.title.errorMessage.maxLength")),
    slug: z
      .string()
      .min(1, t("basic.fields.slug.errorMessage.minLength"))
      .max(200, t("basic.fields.slug.errorMessage.maxLength"))
      .regex(/^[a-z0-9-]+$/, t("basic.fields.slug.errorMessage.pattern")),
    description: z.string().max(4000, t("basic.fields.description.errorMessage.maxLength")).optional(),
    shortDescription: z.string().max(500, t("basic.fields.shortDescription.errorMessage.maxLength")).optional(),
    thumbnail: z.string().optional(),
    images: z.string().optional(),
    technologies: z.string().optional(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    featured: z.boolean().optional(),
    status: z.enum(["draft", "published"], t("settings.fields.status.errorMessage.invalid")).optional(),
    order: z.number().int().min(0).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  });

export type ProjectFormData = z.infer<ReturnType<typeof createProjectSchema>>;
