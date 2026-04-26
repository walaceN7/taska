import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString: string | undefined): string {
  if (!isoString) return "";

  const date = new Date(isoString);

  const userLocale =
    typeof window !== "undefined" ? navigator.language : "en-US";

  return new Intl.DateTimeFormat(userLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateWithoutTime(isoString: string | undefined): string {
  if (!isoString) return "";

  const date = new Date(isoString);

  const userLocale =
    typeof window !== "undefined" ? navigator.language : "en-US";

  return new Intl.DateTimeFormat(userLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
