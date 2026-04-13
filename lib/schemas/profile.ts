import { z } from "zod";
import { TranslatorType } from "@/lib/types/i18n";

export const createProfileSchema = (t: TranslatorType) =>
  z.object({
    name: z.string().max(100, t("personalInfo.fields.name.errorMessage.maxLength")).optional(),
    title: z.string().max(200, t("personalInfo.fields.title.errorMessage.maxLength")).optional(),
    email: z.string().email(t("personalInfo.fields.email.errorMessage.invalid")).optional(),
    shortBio: z.string().max(300, t("about.fields.bio.errorMessage.maxLength")).optional(),
    bio: z.string().max(2000, t("about.fields.about.errorMessage.maxLength")).optional(),
    location: z.string().max(100, t("socialLinks.fields.location.errorMessage.maxLength")).optional(),
    website: z.union([z.string().url(t("socialLinks.fields.website.errorMessage.invalid")), z.literal("")]).optional(),
    github: z.union([z.string().url(t("socialLinks.fields.github.errorMessage.invalid")), z.literal("")]).optional(),
    linkedin: z
      .union([z.string().url(t("socialLinks.fields.linkedin.errorMessage.invalid")), z.literal("")])
      .optional(),
  });

export type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>;
