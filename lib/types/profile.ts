import { ProfileFormData } from "@/lib/schemas/profile";
import { ErrorCode, ValidationErrors } from "@/lib/types/error";

export type UpdateProfileResult =
  | { success: true }
  | {
      success: false;
      message: string;
      code: "VALIDATION_ERROR";
      errors: ValidationErrors<ProfileFormData>;
    }
  | {
      success: false;
      message: string;
      code: ErrorCode;
    };
