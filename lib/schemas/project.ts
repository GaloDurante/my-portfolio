import { z } from "zod";
import { TranslatorType } from "@/lib/types/i18n";

const BuildProjectSchema = (t: TranslatorType) =>
  z.object({
    id: z.string(),
    title: z
      .string()
      .min(1, t("basic.fields.title.errorMessage.minLength"))
      .max(200, t("basic.fields.title.errorMessage.maxLength")),
    slug: z
      .string()
      .min(1, t("basic.fields.slug.errorMessage.minLength"))
      .max(200, t("basic.fields.slug.errorMessage.maxLength"))
      .regex(/^[a-z0-9-]+$/, t("basic.fields.slug.errorMessage.pattern")),
    description: z.string().max(4000, t("basic.fields.description.errorMessage.maxLength")).nullable(),
    shortDescription: z.string().max(500, t("basic.fields.shortDescription.errorMessage.maxLength")).nullable(),
    thumbnail: z.string().nullable(),
    images: z.unknown(),
    technologies: z.unknown(),
    demoUrl: z.string().nullable(),
    repoUrl: z.string().nullable(),
    featured: z.boolean().nullable(),
    status: z.enum(["draft", "published"], t("settings.fields.status.errorMessage.invalid")).nullable(),
    order: z.number().int().min(0).nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
  });

export type ProjectFormData = z.infer<ReturnType<typeof BuildProjectSchema>>;

export const createProjectSchema = (t: TranslatorType) =>
  BuildProjectSchema(t).pick({
    title: true,
    slug: true,
  });

export type CreateProjectFormData = z.infer<ReturnType<typeof createProjectSchema>>;

export const updateProjectBasicSchema = (t: TranslatorType) =>
  BuildProjectSchema(t).pick({
    title: true,
    slug: true,
    description: true,
    shortDescription: true,
  });

export type UpdateProjectBasicFormData = z.infer<ReturnType<typeof updateProjectBasicSchema>>;
