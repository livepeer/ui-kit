import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Booleanish } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function coerceToBoolean(
  value: Booleanish | undefined,
  defaultValue: boolean,
): boolean {
  switch (value) {
    case "1":
    case "":
    case "true":
      return true;
    case "0":
    case "false":
      return false;
    default:
      return defaultValue;
  }
}
