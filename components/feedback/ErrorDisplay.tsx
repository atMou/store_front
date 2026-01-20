"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import React from "react";

interface ErrorDisplayProps {
  error: { detail: string; errors: string[] } | null;
  onDismiss?: () => void;
  variant?: "inline" | "banner" | "card";
  showDetails?: boolean;
  className?: string;
}

/**
 * ErrorDisplay Component
 *
 * Displays errors returned from TryAsync utility function
 *
 * @param error - Error object with detail and errors array
 * @param onDismiss - Optional callback to dismiss the error
 * @param variant - Display style: "inline" | "banner" | "card"
 * @param showDetails - Whether to show detailed error messages
 * @param className - Additional CSS classes
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  variant = "inline",
  showDetails = true,
  className = "",
}) => {
  if (!error) return null;

  const hasMultipleErrors = error.errors.length > 1;

  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const baseClasses = {
    inline: "rounded-lg border border-red-200 bg-red-50 p-4",
    banner: "rounded-none border-l-4 border-red-500 bg-red-50 p-4 shadow-sm",
    card: "rounded-xl border border-red-200 bg-red-50 p-6 shadow-md",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.2 }}
        className={`${baseClasses[variant]} ${className}`}
        role="alert"
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>

          <div className="flex-1">
            {/* Main error detail */}
            <h3 className="text-sm font-semibold text-red-800">
              {error.detail}
            </h3>

            {/* Detailed error messages */}
            {showDetails && hasMultipleErrors && (
              <ul className="mt-2 space-y-1 text-sm text-red-700">
                {error.errors.map((msg, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-600" />
                    <span>{msg}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Single error message (if not showing as detail) */}
            {showDetails &&
              !hasMultipleErrors &&
              error.errors[0] !== error.detail && (
                <p className="mt-1 text-sm text-red-700">{error.errors[0]}</p>
              )}
          </div>

          {/* Dismiss button */}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="shrink-0 rounded-lg p-1 text-red-600 hover:bg-red-100 transition-colors"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorDisplay;

/**
 * Compact Error Display - Shows only the detail message
 */
export const ErrorDisplayCompact: React.FC<
  Omit<ErrorDisplayProps, "showDetails" | "variant">
> = (props) => {
  return <ErrorDisplay {...props} showDetails={false} variant="inline" />;
};

/**
 * Banner Error Display - Full width banner style
 */
export const ErrorDisplayBanner: React.FC<
  Omit<ErrorDisplayProps, "variant">
> = (props) => {
  return <ErrorDisplay {...props} variant="banner" />;
};
