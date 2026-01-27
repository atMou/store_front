"use client";

import FeedbackDisplay from "./FeedbackDisplay";

import { FeedbackVariant } from "./FeedbackDisplay";

interface ErrorDisplayProps {
  message?: string;
  className?: string;
  title?: string;
  variant?: FeedbackVariant;
}

/**
 * A simple wrapper around FeedbackDisplay for generic error messages.
 * Use ApiErrorDisplay for handling unknown/API errors.
 */
const ErrorDisplay = ({
  message = "An unexpected error occurred",
  className,
  title = "Error",
  variant = "banner",
}: ErrorDisplayProps) => {
  return (
    <FeedbackDisplay
      mode="error"
      variant={variant}
      title={title}
      message={message}
      className={className}
    />
  );
};

export default ErrorDisplay;
