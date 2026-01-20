"use client";

import { cn } from "@/shared/lib/utils";
import { AlertCircle } from "lucide-react";
import { FieldErrors } from "react-hook-form";

interface FormValidationErrorsProps {
  errors: FieldErrors;
  className?: string;
}

/**
 * FormValidationErrors - Display react-hook-form validation errors
 *
 * @param errors - Form errors from form.formState.errors
 * @param className - Additional CSS classes
 *
 * @example
 * <FormValidationErrors errors={form.formState.errors} />
 */
function FormValidationErrors({
  errors,
  className,
}: FormValidationErrorsProps) {
  const errorEntries = Object.entries(errors);

  if (errorEntries.length === 0) return null;

  return (
    <div
      className={cn(
        "border-l-4 border-red-600 mt-2 bg-red-50 p-2 rounded-r",
        className
      )}
      role="alert"
    >
      <div className="flex gap-2">
        <AlertCircle className="h-3 w-3 text-red-600 shrink-0 mt-1" />
        <div className="flex-1 ">
          <div className="font-semibold text-sm text-red-800">Errors</div>
          <div className="space-y-1">
            {errorEntries.map(([field, errorObj]) => {
              const message = (errorObj as { message?: string })?.message;
              if (!message) return null;

              return (
                <div key={field} className="text-xs text-red-700">
                  <span className="font-medium capitalize">
                    {field.replace(/([A-Z])/g, " $1").trim()}:
                  </span>{" "}
                  {message}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormValidationErrors;
