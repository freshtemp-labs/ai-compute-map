import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge multiple class names using clsx and tailwind-merge.
 * Handles conditional classes, falsy values, and Tailwind CSS conflicts.
 *
 * @param inputs - Class values (strings, objects, arrays, falsy values)
 * @returns Merged and deduplicated class string
 *
 * @example
 * cn('text-red-500', condition && 'bg-blue-500', { 'active': isActive })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
