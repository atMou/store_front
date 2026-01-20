/**
 * API Utility Functions
 *
 * Shared utilities for API calls to avoid duplication across features
 */

/**
 * Convert camelCase to PascalCase for .NET backend compatibility
 * @param str - The camelCase string to convert
 * @returns PascalCase string
 *
 * @example
 * toPascalCase('pageNumber') // returns 'PageNumber'
 * toPascalCase('minPrice') // returns 'MinPrice'
 */
export const toPascalCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Build query string from object params with PascalCase conversion for .NET backend
 * Filters out undefined, null, and empty string values
 *
 * @param params - Object with query parameters
 * @returns URLSearchParams instance ready to use in API calls
 *
 * @example
 * const params = buildQueryParams({ pageNumber: 1, category: 'Women', minPrice: null });
 * // Returns URLSearchParams with "PageNumber=1&Category=Women"
 */
export const buildQueryParams = (
  params: Record<string, unknown>
): URLSearchParams => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      const backendKey = toPascalCase(key);
      queryParams.append(backendKey, String(value));
    }
  });

  return queryParams;
};
