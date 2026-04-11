"use server";

import { profileSchema } from "@/lib/schemas/profile";
import { updateUserData } from "@/lib/services/user";
import { AppError } from "@/lib/errors/app-error";
import { UpdateProfileResult } from "@/lib/types/profile";

export async function updateProfile(data: unknown, userId: string): Promise<UpdateProfileResult> {
  const parsed = profileSchema.safeParse(data);

  if (!parsed.success) {
    const flattened = parsed.error.flatten();

    return {
      success: false,
      message: "Invalid form data",
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
        message: error.message,
        code: error.code,
      };
    }

    return {
      success: false,
      message: "Unexpected server error",
      code: "UNKNOWN_ERROR",
    };
  }
}
