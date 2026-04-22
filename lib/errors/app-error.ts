import { type ErrorCode, type DbErrorShape } from "@/lib/types/error";

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode = "UNKNOWN_ERROR",
  ) {
    super(message);
    this.name = "AppError";
  }
}

function findErrorWithCode(error: unknown): DbErrorShape | null {
  let current: unknown = error;
  while (current && typeof current === "object") {
    const err = current as DbErrorShape;
    if (typeof err.code === "string") {
      return err;
    }
    current = err.cause;
  }
  return null;
}

export function mapDbError(error: unknown): AppError {
  const dbError = findErrorWithCode(error);

  if (dbError?.code === "SQLITE_CONSTRAINT" && dbError.message?.includes("projects.slug")) {
    return new AppError("Slug already exists", "SLUG_ALREADY_EXISTS");
  }

  if (dbError?.code === "SQLITE_CONSTRAINT" && dbError.message?.includes("user.email")) {
    return new AppError("Email already exists", "EMAIL_ALREADY_EXISTS");
  }

  return new AppError("Database error", "DB_FAILED");
}
