export const toPascalCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

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
