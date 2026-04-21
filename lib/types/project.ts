import { projects } from "@/db/schema";
import { ErrorCode, ValidationErrors } from "@/lib/types/error";
import { ProjectBasicFormData } from "@/lib/schemas/project/project-basic";

export type ProjectType = typeof projects.$inferSelect;

export type CreateProjectResult =
  | { success: true; projectId: string }
  | {
      success: false;
      message: string;
      code: "VALIDATION_ERROR";
      errors: ValidationErrors<ProjectBasicFormData>;
    }
  | {
      success: false;
      message: string;
      code: ErrorCode;
    };
