import { cn } from "@/shared/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  iconSize?: number;
  variant?: "default" | "compact";
}

const EmptyState = ({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
  className,
  iconSize = 64,
  variant = "default",
}: EmptyStateProps) => {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        isCompact ? "py-8" : "min-h-screen bg-gray-50",
        className
      )}
    >
      <div className="text-center">
        {Icon && (
          <Icon
            size={iconSize}
            className={cn(
              "mx-auto mb-4",
              isCompact ? "text-gray-300" : "text-gray-400"
            )}
          />
        )}
        <h2
          className={cn(
            "font-semibold text-gray-700 mb-2",
            isCompact ? "text-lg" : "text-2xl"
          )}
        >
          {title}
        </h2>
        {message && (
          <p
            className={cn("text-gray-500", isCompact ? "text-sm mb-4" : "mb-6")}
          >
            {message}
          </p>
        )}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
