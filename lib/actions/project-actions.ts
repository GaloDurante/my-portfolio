"use server";

import { deleteProjectById } from "@/lib/services/project";
import { AppError } from "@/lib/errors/app-error";
import { DeleteResult } from "@/lib/types/utils";

import { getTranslations } from "next-intl/server";

export async function deleteProjectAction(projectId: string, userId: string): Promise<DeleteResult> {
  const t = await getTranslations("AdminProjects.form.submit.error");

  try {
    await deleteProjectById(projectId, userId);

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
