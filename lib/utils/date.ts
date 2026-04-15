import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import type { Locale } from "date-fns";

interface FormatSmartDateOptions {
  locale: Locale;
  thresholdInDays?: number;
}

export function formatSmartDate(date: Date | string, { locale, thresholdInDays = 7 }: FormatSmartDateOptions): string {
  const parsed = typeof date === "string" ? new Date(date) : new Date(date);

  if (isNaN(parsed.getTime())) {
    return "-";
  }

  const now = new Date();
  const daysDiff = differenceInDays(now, parsed);

  if (daysDiff < thresholdInDays) {
    return formatDistanceToNow(parsed, {
      addSuffix: true,
      locale,
    });
  }

  return format(parsed, "PPP", { locale });
}
