import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Placeholder cn function (commonly used with shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}