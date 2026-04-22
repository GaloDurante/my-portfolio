import { ErrorCode, ValidationErrors } from "@/lib/types/error";
import { ProjectFormData } from "@/lib/schemas/project";

type baseProjectType =
  | {
      success: false;
      message: string;
      code: "VALIDATION_ERROR";
      errors: ValidationErrors<ProjectFormData>;
    }
  | {
      success: false;
      message: string;
      code: ErrorCode;
    };

export type CreateProjectResult = { success: true; projectId: string } | baseProjectType;

export type UpdateProjectResult = { success: true } | baseProjectType;
