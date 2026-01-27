"use client";

import { getErrors } from "@/shared/lib/httpStatusCodes";
import { cn } from "@/shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  LucideIcon,
  Search,
  X,
} from "lucide-react";
import React from "react";

export type FeedbackVariant =
  | "inline"
  | "compact"
  | "banner"
  | "card"
  | "full-page";
export type FeedbackMode = "error" | "empty" | "info" | "success" | "warning";

interface ActionProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline" | "ghost";
}

export interface FeedbackDisplayProps {
  /**
   * The error object to parse. If provided, mode defaults to "error"
   */
  error?: unknown;

  /**
   * Override title. For errors, auto-generated if not provided.
   */
  title?: string;

  /**
   * Override message. For errors, auto-generated if not provided.
   */
  message?: string;

  /**
   * Visual style of the component
   * @default "card" for empty mode, "banner" for error mode
   */
  variant?: FeedbackVariant;

  /**
   * Semantic mode
   * @default "error" if error prop is present, "empty" otherwise
   */
  mode?: FeedbackMode;

  /**
   * Custom icon to override default mode icon. Pass null to hide icon.
   */
  icon?: LucideIcon | null;

  /**
   * Action button configuration
   */
  action?: ActionProps;

  /**
   * Dismiss handler
   */
  onDismiss?: () => void;

  /**
   * Additional classes
   */
  className?: string;

  /**
   * Whether to show detailed error list for API errors
   * @default true
   */
  showDetails?: boolean;
}

const MODES = {
  error: {
    icon: AlertCircle,
    styles: {
      wrapper: "bg-red-50 border-red-200",
      icon: "text-red-600",
      title: "text-red-800",
      text: "text-red-700",
      border: "border-red-500", // For left-border variants
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
  },
  empty: {
    icon: Search,
    styles: {
      wrapper: "bg-gray-50 border-gray-200",
      icon: "text-gray-400",
      title: "text-gray-700",
      text: "text-gray-500",
      border: "border-gray-400",
      button: "bg-slate-900 hover:bg-slate-800 text-white",
    },
  },
  info: {
    icon: Info,
    styles: {
      wrapper: "bg-blue-50 border-blue-200",
      icon: "text-blue-600",
      title: "text-blue-800",
      text: "text-blue-700",
      border: "border-blue-500",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  },
  success: {
    icon: CheckCircle2,
    styles: {
      wrapper: "bg-green-50 border-green-200",
      icon: "text-green-600",
      title: "text-green-800",
      text: "text-green-700",
      border: "border-green-500",
      button: "bg-green-600 hover:bg-green-700 text-white",
    },
  },
  warning: {
    icon: AlertCircle,
    styles: {
      wrapper: "bg-amber-50 border-amber-200",
      icon: "text-amber-600",
      title: "text-amber-800",
      text: "text-amber-700",
      border: "border-amber-500",
      button: "bg-amber-600 hover:bg-amber-700 text-white",
    },
  },
};

const Wrapper = ({
  children,
  className: c,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <AnimatePresence>
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
      }}
      transition={{ duration: 0.2 }}
      className={c}
      role="alert"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

export default function FeedbackDisplay({
  error,
  title: titleProp,
  message: messageProp,
  variant,
  mode: modeProp,
  icon: IconProp,
  action,
  onDismiss,
  className,
  showDetails = true,
}: FeedbackDisplayProps) {
  // Determine effective mode
  const mode: FeedbackMode = modeProp || (error ? "error" : "empty");

  // Parse error if present
  let errorTitle = "";
  let errorDetail = "";
  let errorMessages: string[] = [];

  if (mode === "error" && error) {
    const parsed = getErrors(error);
    errorTitle = "Error"; // Default title as getErrors doesn't return title
    errorDetail = parsed.detail;
    errorMessages = parsed.errors || [];
  }

  // Determine effective variant
  // If variant is "full-page", use it. Otherwise calculate default based on mode.
  const effectiveVariant: FeedbackVariant =
    variant || (mode === "error" ? "banner" : "card");

  // Determine final content
  const title =
    titleProp ||
    errorTitle ||
    (mode === "error" ? "Something went wrong" : "No data found");
  const message = messageProp || errorDetail;
  const details = mode === "error" ? errorMessages : [];

  // Get mode styles
  const styles = MODES[mode];
  // Determine Icon:
  // If IconProp is null, no icon.
  // If IconProp is undefined, use default.
  // If IconProp is provided, use it.
  const Icon = IconProp === null ? null : IconProp || styles.icon;

  if (!error && mode === "error" && !titleProp && !messageProp) {
    return null; // Don't render empty error state if no content provided
  }

  // Render Logic based on Variant

  if (effectiveVariant === "inline") {
    return (
      <div
        className={cn(
          "text-sm flex flex-col gap-1",
          styles.styles.text,
          className
        )}
      >
        {(title || message) && (
          <div className="flex items-center gap-2 font-medium">
            {/* Small icon for inline */}
            {Icon && (
              <Icon size={16} className={cn("shrink-0", styles.styles.icon)} />
            )}
            <span>{message || title}</span>
          </div>
        )}
        {showDetails && details.length > 0 && details[0] !== message && (
          <ul className="list-disc pl-8 space-y-1 text-xs opacity-90">
            {details.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (effectiveVariant === "compact") {
    // Like ApiErrorDisplay compact - minimal UI
    return (
      <div className={cn("text-sm space-y-1", styles.styles.text, className)}>
        <div className="flex items-center gap-2 font-medium">
          {Icon && (
            <Icon size={16} className={cn("shrink-0", styles.styles.icon)} />
          )}
          <span>{title}</span>
        </div>
        {message && <p className="pl-6 text-xs">{message}</p>}
        {showDetails && details.length > 0 && (
          <ul className="list-disc pl-10 text-xs space-y-0.5 opacity-90">
            {details.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (effectiveVariant === "full-page") {
    return (
      <div
        className={cn(
          "min-h-[60vh] flex flex-col items-center justify-center p-8 text-center",
          styles.styles.wrapper.split(" ")[0],
          className
        )}
      >
        {Icon && (
          <div
            className={cn(
              "p-4 rounded-full bg-white mb-6 shadow-sm ring-1 ring-inset",
              styles.styles.wrapper.split(" ")[1] || "ring-gray-200"
            )}
          >
            <Icon size={48} className={styles.styles.icon} />
          </div>
        )}
        <h2 className={cn("text-2xl font-bold mb-3", styles.styles.title)}>
          {title}
        </h2>
        {message && (
          <p className={cn("text-lg max-w-md mb-8", styles.styles.text)}>
            {message}
          </p>
        )}

        {showDetails && details.length > 0 && (
          <div
            className={cn(
              "text-left bg-white/50 p-4 rounded-lg mb-8 max-w-lg w-full text-sm border",
              styles.styles.border.replace("border-l-4", "border")
            )}
          >
            <ul className={cn("list-disc pl-5 space-y-1", styles.styles.text)}>
              {details.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-4">
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                "px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm",
                styles.styles.button
              )}
            >
              {action.label}
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-6 py-2.5 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    );
  }

  const isBanner = effectiveVariant === "banner";
  const baseClasses = isBanner
    ? cn(
        "p-4 border-l-4 rounded-r-lg shadow-sm w-full",
        styles.styles.wrapper,
        styles.styles.border
      )
    : cn("p-6 rounded-xl border shadow-sm w-full", styles.styles.wrapper);

  return (
    <Wrapper className={cn(baseClasses, className)}>
      <div className="flex items-start gap-4">
        {Icon && (
          <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", styles.styles.icon)} />
        )}

        <div className="flex-1 space-y-1">
          <h3 className={cn("font-semibold text-sm", styles.styles.title)}>
            {title}
          </h3>

          {message && (
            <p className={cn("text-sm", styles.styles.text)}>{message}</p>
          )}

          {showDetails && details.length > 0 && (
            <ul
              className={cn(
                "mt-2 text-xs space-y-1 list-disc pl-4",
                styles.styles.text
              )}
            >
              {details.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )}

          {action && (
            <div className="mt-4">
              <button
                onClick={action.onClick}
                className={cn(
                  "text-sm font-medium hover:underline focus:outline-none flex items-center gap-1",
                  styles.styles.title
                )}
              >
                {action.label} →
              </button>
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              "shrink-0 p-1 rounded hover:bg-white/20",
              styles.styles.text
            )}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </Wrapper>
  );
}
