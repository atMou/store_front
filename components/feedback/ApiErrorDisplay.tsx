"use client";

import FeedbackDisplay from "./FeedbackDisplay";

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
  const mapVariant = {
    default: "banner",
    compact: "compact",
    inline: "inline",
  } as const;

  return (
    <FeedbackDisplay
      error={error}
      className={className}
      variant={mapVariant[variant]}
      title={title}
      icon={showIcon ? undefined : null}
      mode="error"
    />
  );
}

export default ApiErrorDisplay;
