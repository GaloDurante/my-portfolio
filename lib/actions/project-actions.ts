"use server";

import { createProject, updateProjectById, deleteProjectById } from "@/lib/services/project";
import { createProjectSchema, updateProjectBasicSchema } from "@/lib/schemas/project";
import { CreateProjectResult, UpdateProjectResult } from "@/lib/types/project";
import { DeleteResult } from "@/lib/types/utils";
import { AppError } from "@/lib/errors/app-error";
import { nanoid } from "nanoid";

import { getTranslations } from "next-intl/server";

export async function createProjectAction(data: unknown, userId: string): Promise<CreateProjectResult> {
  const t = await getTranslations("admin.projects.form");
  const schema = createProjectSchema(t);

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();

    return {
      success: false,
      message: t("createModal.submit.error.invalidForm"),
      code: "VALIDATION_ERROR",
      errors: {
        fieldErrors: flattened.fieldErrors,
        formErrors: flattened.formErrors,
      },
    };
  }

  try {
    const projectId = nanoid();
    await createProject({
      id: projectId,
      userId,
      title: parsed.data.title,
      slug: parsed.data.slug,
    });

    return { success: true, projectId };
  } catch (error) {
    console.log("test", error);
    if (error instanceof AppError) {
      return {
        success: false,
        message: t(`createModal.submit.error.${error.code}`),
        code: error.code,
      };
    }

    return {
      success: false,
      message: t("createModal.submit.error.UNKNOWN_ERROR"),
      code: "UNKNOWN_ERROR",
    };
  }
}

export async function updateProjectBasicAction(projectId: string, data: unknown): Promise<UpdateProjectResult> {
  const t = await getTranslations("admin.projects.form");
  const schema = updateProjectBasicSchema(t);

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();

    return {
      success: false,
      message: t("submit.error.invalidForm"),
      code: "VALIDATION_ERROR",
      errors: {
        fieldErrors: flattened.fieldErrors,
        formErrors: flattened.formErrors,
      },
    };
  }

  try {
    await updateProjectById(projectId, parsed.data);

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        success: false,
        message: t(`submit.error.${error.code}`),
        code: error.code,
      };
    }

    return {
      success: false,
      message: t("submit.error.UNKNOWN_ERROR"),
      code: "UNKNOWN_ERROR",
    };
  }
}


export async function deleteProjectAction(projectId: string, userId: string): Promise<DeleteResult> {
  const t = await getTranslations("admin.projects.form.submit.error");

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
