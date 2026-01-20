/**
 * Date Utility Functions
 *
 * Centralized date formatting utilities to avoid duplication
 */

/**
 * Format date string to localized format
 * @param dateString - ISO date string
 * @param includeTime - Whether to include time in the output
 * @returns Formatted date string
 *
 * @example
 * formatDate('2024-01-15T10:30:00') // 'Jan 15, 2024'
 * formatDate('2024-01-15T10:30:00', true) // 'Jan 15, 2024, 10:30 AM'
 */
export const formatDate = (
  dateString: string,
  includeTime: boolean = false
): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return new Date(dateString).toLocaleDateString("en-US", options);
};

/**
 * Format currency amount
 * @param amount - The amount to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(29.99) // '$29.99'
 * formatCurrency(1500, 'EUR') // '€1,500.00'
 */
export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};
