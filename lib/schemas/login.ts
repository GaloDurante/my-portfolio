import { z } from "zod";
import { TranslatorType } from "@/lib/types/i18n";

export const createLoginSchema = (t: TranslatorType) =>
  z.object({
    email: z.string().email(t("fields.email.errorMessage.invalid")),
    password: z
      .string()
      .min(8, t("fields.password.errorMessage.minLength"))
      .max(100, t("fields.password.errorMessage.maxLength"))
      .regex(/[A-Z]/, t("fields.password.errorMessage.uppercase"))
      .regex(/[a-z]/, t("fields.password.errorMessage.lowercase"))
      .regex(/[0-9]/, t("fields.password.errorMessage.number")),
  });

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
