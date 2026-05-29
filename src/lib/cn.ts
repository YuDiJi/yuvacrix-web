import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes safely, resolving conflicts.
 * Use this instead of template literals when classes may conflict.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-brand", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
