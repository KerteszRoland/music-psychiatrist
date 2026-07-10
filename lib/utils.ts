import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function confidenceColor(value: number): string {
  if (value >= 0.8) return "bg-emerald-500";
  if (value >= 0.6) return "bg-amber-500";
  return "bg-slate-400";
}
