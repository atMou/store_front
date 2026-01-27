import { cn } from "@/shared/lib/utils";
import { LucideIcon } from "lucide-react";
import FeedbackDisplay from "./FeedbackDisplay";

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
  icon,
  title,
  message,
  actionLabel,
  onAction,
  className,
  variant = "default",
}: EmptyStateProps) => {
  const isCompact = variant === "compact";

  return (
    <FeedbackDisplay
      icon={icon}
      title={title}
      message={message}
      action={
        actionLabel && onAction
          ? { label: actionLabel, onClick: onAction }
          : undefined
      }
      mode="empty"
      variant="full-page"
      className={cn(isCompact ? "min-h-0! py-12" : "min-h-[80vh]", className)}
    />
  );
};

export default EmptyState;
