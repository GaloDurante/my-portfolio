import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export function applyServerValidationErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  errors: Partial<Record<keyof T, string[]>>,
) {
  (Object.keys(errors) as Array<keyof T>).forEach((key) => {
    const messages = errors[key];
    if (!messages || messages.length === 0) return;

    form.setError(key as Path<T>, {
      type: "server",
      message: messages[0],
    });
  });
}

export function setThemeCookie(value: string) {
  document.cookie = `theme=${value}; path=/`;
}
