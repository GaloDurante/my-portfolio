import type { ErrorCode } from "@/lib/types/error";

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode = "UNKNOWN_ERROR",
  ) {
    super(message);
    this.name = "AppError";
  }
}
