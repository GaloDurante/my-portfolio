export type ErrorCode =
  | "UNKNOWN_ERROR"
  | "USER_NOT_FOUND"
  | "DB_FAILED"
  | "PROJECT_NOT_FOUND"
  | "SLUG_ALREADY_EXISTS"
  | "EMAIL_ALREADY_EXISTS";

export type ValidationErrors<T> = {
  fieldErrors: Partial<Record<keyof T, string[]>>;
  formErrors: string[];
};

export type DbErrorShape = { code?: string; message?: string; cause?: unknown };
