import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Update the formatCurrency function to include comma formatting
export function formatCurrency(
  amount: number,
  options: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

// Add a new function to format numbers with commas
export function formatNumberWithCommas(value: string | number): string {
  // Convert to string and remove any non-digit characters except decimal point
  const numStr = value.toString().replace(/[^\d.]/g, "");

  // Split into integer and decimal parts
  const parts = numStr.split(".");

  // Format integer part with commas
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Join back with decimal part if it exists
  return parts.join(".");
}
