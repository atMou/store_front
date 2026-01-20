/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/apiErrorHandler.ts

export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * Standard .NET ProblemDetails (RFC 7807)
 */
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  Errors?: string[];
  errors?: Record<string, string[]>;
}

export interface ValidationFieldError {
  field: string;
  errors: string[];
}

export type MissingFieldsErrors = ValidationFieldError[];

export interface ParsedApiError {
  status: number;
  title: string;
  detail: string;
  messages: string[];
  fieldErrors?: Record<string, string[]>; // Optional: for form libraries (react-hook-form, zod, etc.)
}

function isRtkQueryError(error: unknown): error is {
  status: number;
  data: unknown;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "data" in error
  );
}

/**
 * Type guard for ProblemDetails
 */
function isProblemDetails(data: unknown): data is ProblemDetails {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as any).status !== undefined
  );
}

/**
 * Type guard for validation errors array
 */
function isMissingFieldsErrors(data: unknown): data is MissingFieldsErrors {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "field" in item &&
        "errors" in item &&
        Array.isArray((item as any).errors)
    )
  );
}

/**
 * Main error parser – robust and handles all your .NET error cases
 */
export function parseApiError(error: unknown): ParsedApiError {
  // Defaults
  let status = HttpStatusCode.INTERNAL_SERVER_ERROR as number;
  let title = "An error occurred";
  let detail = "Please try again later.";
  let messages: string[] = [];
  const fieldErrors: Record<string, string[]> = {};

  try {
    // Normalize RTK Query error shape
    if (isRtkQueryError(error)) {
      status = error.status;
      error = error.data;
    }

    // Unwrap common `{ error: ... }` wrapper
    if (error && typeof error === "object" && "error" in (error as any)) {
      const inner = (error as any).error;
      if (typeof inner === "string") {
        try {
          error = JSON.parse(inner);
        } catch {
          error = { detail: inner, Errors: [inner] };
        }
      } else {
        error = inner;
      }
    }

    // If it's already ProblemDetails
    if (isProblemDetails(error)) {
      status = error.status ?? status;
      title = error.title ?? title;
      detail = error.detail ?? detail;
      const serverErrors = (error as any).Errors || (error as any).errors;
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        messages = serverErrors;
      } else if (serverErrors && typeof serverErrors === "object") {
        Object.entries(serverErrors).forEach(([field, list]) => {
          if (Array.isArray(list)) {
            fieldErrors[field] = list;
            messages.push(...list);
          }
        });
      }
      if (messages.length === 0 && error.detail) {
        messages = [error.detail];
      }
    }
    // Simple { detail, errors } object
    else if (
      error &&
      typeof error === "object" &&
      ("detail" in (error as any) ||
        "errors" in (error as any) ||
        "Errors" in (error as any))
    ) {
      const e = error as any;
      title = e.title || title;
      detail = e.detail || detail;
      const errs = e.errors || e.Errors;
      if (Array.isArray(errs) && errs.length > 0) {
        messages = errs;
      } else if (detail) {
        messages = [detail];
      }
    }
    // Validation array [{ field, errors }]
    else if (isMissingFieldsErrors(error)) {
      error.forEach(({ field, errors: fieldMsgs }) => {
        fieldErrors[field] = fieldMsgs;
        messages.push(...fieldMsgs);
      });
      title = "Missing or invalid fields";
      detail = "Please check the form and try again.";
    }
    // JS Error
    else if (error instanceof Error) {
      messages = [error.message];
      title = "Network Error";
      detail = "Failed to connect to the server.";
    }

    if (messages.length === 0) {
      messages = ["An unexpected error occurred. Please try again."];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    messages = ["An unexpected error occurred. Please try again."];
    title = "Parse Error";
  }

  return {
    status,
    title,
    detail,
    messages,
    ...(Object.keys(fieldErrors).length > 0 && { fieldErrors }),
  };
}

export function getErrors(error: unknown): {
  detail: string;
  errors: string[];
} {
  const parsed = parseApiError(error);
  return { detail: parsed.detail, errors: parsed.messages };
}

export const isApiError = (error: unknown, status: number): boolean =>
  parseApiError(error).status === status;

export const isValidationError = (error: unknown) =>
  isApiError(error, HttpStatusCode.BAD_REQUEST) ||
  isApiError(error, HttpStatusCode.UNPROCESSABLE_ENTITY);

export const isNotFound = (error: unknown) =>
  isApiError(error, HttpStatusCode.NOT_FOUND);

export const isUnauthorized = (error: unknown) =>
  isApiError(error, HttpStatusCode.UNAUTHORIZED);

export const isConflict = (error: unknown) =>
  isApiError(error, HttpStatusCode.CONFLICT);

export const isServerError = (error: unknown) =>
  parseApiError(error).status >= 500;
