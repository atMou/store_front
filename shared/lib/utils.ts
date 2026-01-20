import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getErrors } from "./httpStatusCodes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const Capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const TryAsync = async <T>(
  fn: () => Promise<T>
): Promise<{ data?: T; error?: { detail: string; errors: string[] } }> => {
  try {
    const data = await fn();
    return { data };
  } catch (error) {
    return { error: getErrors(error) };
  }
};

export const getWorkingDaysFromToday = (days: number) => {
  const result = new Date();
  let addedDays = 0;

  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      addedDays++;
    }
  }

  return result;
};

export const formatShippingDate = (date: Date) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = days[date.getDay()];
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${dayName}, ${day}/${month}`;
};
