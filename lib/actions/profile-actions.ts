"use server";

import { createProfileSchema } from "@/lib/schemas/profile";
import { updateUserData } from "@/lib/services/user";
import { AppError } from "@/lib/errors/app-error";
import { UpdateProfileResult } from "@/lib/types/profile";

import { getTranslations } from "next-intl/server";

export async function updateProfile(data: unknown, userId: string): Promise<UpdateProfileResult> {
  const t = await getTranslations("AdminProfile.form.submit.error");
  const schema = createProfileSchema(t);

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();

    return {
      success: false,
      message: t("invalidForm"),
      code: "VALIDATION_ERROR",
      errors: {
        fieldErrors: flattened.fieldErrors,
        formErrors: flattened.formErrors,
      },
    };
  }

  try {
    await updateUserData(parsed.data, userId);

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        success: false,
        message: t(error.code),
        code: error.code,
      };
    }

    return {
      success: false,
      message: t("UNKNOWN_ERROR"),
      code: "UNKNOWN_ERROR",
    };
  }
}
