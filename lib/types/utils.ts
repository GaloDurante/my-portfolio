import { ErrorCode } from "@/lib/types/error";

export type DeleteResult =
  | { success: true }
  | {
      success: false;
      message: string;
      code: ErrorCode;
    };
