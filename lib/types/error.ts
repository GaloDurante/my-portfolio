export type ErrorCode = "UNKNOWN_ERROR" | "USER_NOT_FOUND" | "DB_UPDATE_FAILED";

export type ValidationErrors<T> = {
  fieldErrors: Partial<Record<keyof T, string[]>>;
  formErrors: string[];
};
