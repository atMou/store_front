"use client";

import { getErrors } from "@/shared/lib/httpStatusCodes";
import { cn } from "@/shared/lib/utils";
import { AlertCircle, XCircle } from "lucide-react";

interface ApiErrorDisplayProps {
  error: unknown;
  className?: string;
  showIcon?: boolean;
  variant?: "default" | "compact" | "inline";
  title?: string;
}

function ApiErrorDisplay({
  error,
  className,
  showIcon = true,
  variant = "default",
  title,
}: ApiErrorDisplayProps) {
  if (!error) return null;

  const { detail, errors } = getErrors(error);

  if (!errors || errors.length === 0) return null;

  if (variant === "inline") {
    return (
      <div className={cn("space-y-1", className)}>
        {errors.map((msg, idx) => (
          <p key={idx} className="text-xs text-red-600">
            {msg}
          </p>
        ))}
      </div>
    );
  }

  // Compact variant - simple list without border/background
  if (variant === "compact") {
    return (
      <div className={cn("text-red-600 space-y-1", className)}>
        {(title || detail) && (
          <div className="flex items-center gap-2 font-semibold text-sm">
            {showIcon && <XCircle className="h-4 w-4" />}
            <span>{title || detail}</span>
          </div>
        )}
        {errors.length > 0 && (
          <ul className="text-xs pl-6 list-disc space-y-0.5">
            {errors.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Default variant - full bordered box with background
  return (
    <div
      className={cn(
        "border-l-4 border-red-600 bg-red-50 p-3 rounded-r",
        className
      )}
      role="alert"
    >
      <div className="flex gap-3">
        {showIcon && (
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 space-y-1">
          {(title || detail) && (
            <div className="font-semibold text-sm text-red-800">
              {title || detail}
            </div>
          )}
          <div className="space-y-1">
            {errors.map((msg, idx) => (
              <div key={idx} className="text-xs text-red-700">
                {msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiErrorDisplay;
