import { clsx } from "clsx";
import { format, isValid, parse } from "date-fns";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLocaltoUtc(date: string, formatLable: string) {
  try {
    const localDate = new Date(date)

    const utcDate = new Date(
      localDate.getUTCFullYear(),
      localDate.getUTCMonth(),
      localDate.getUTCDate(),
      localDate.getUTCHours(),
      localDate.getUTCMinutes(),
      localDate.getUTCSeconds()
    )

    const readable = format(utcDate, formatLable);
    return readable;
  } catch (err) {
    console.error(err);
    return date;
  }
}

export function chartDateFormatter(label: string) {
  try {
    const localDate = new Date(label)

    const utcDate = new Date(
      localDate.getUTCFullYear(),
      localDate.getUTCMonth(),
      localDate.getUTCDate(),
      localDate.getUTCHours(),
      localDate.getUTCMinutes(),
      localDate.getUTCSeconds()
    )

    const readable = format(utcDate, "MMMM d, yyyy, h:mm a");
    return readable;
  } catch (err) {
    console.error(err);
    return label;
  }
}

type HexColor = `#${string}`;
export function addOpacity(hexColor: HexColor, opacityPercent: number) {
  const opacity = Math.round((opacityPercent / 100) * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
  return hexColor + opacity;
}

export function safeDateFormate(
  dateInput: string | number | Date | null,
  outputFormat = "dd-MM-yyyy",
  inputFormat = "dd-MM-yyyy"
): string | null {
  if (!dateInput) return null;

  let date: Date;

  if (
    typeof dateInput === "string" &&
    inputFormat !== "iso" &&
    !dateInput.includes("T")
  ) {
    date = parse(dateInput, inputFormat, new Date());
  } else {
    date = new Date(dateInput);
  }

  return isValid(date) ? format(date, outputFormat) : null;
}
