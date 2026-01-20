import { cn } from "@/shared/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  text: string | number;
  variant?: "blue" | "green" | "purple" | "orange" | "red" | "gray";
}

interface SectionHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  badge?: BadgeProps;
  action?: ReactNode;
  className?: string;
  headerClassName?: string;
  containerClassName?: string;
}

const badgeVariants = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-gray-100 text-gray-700",
};

const SectionHeader = ({
  icon,
  title,
  subtitle,
  badge,
  action,
  className,
  headerClassName,
  containerClassName,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        "px-6 py-4 border-b border-gray-100 bg-gray-50",
        containerClassName
      )}
    >
      <div className={cn("flex items-center gap-2", className)}>
        {icon && <>{icon}</>}
        <div className={cn("flex items-center gap-2 flex-1", headerClassName)}>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          {badge && (
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                badgeVariants[badge.variant || "blue"]
              )}
            >
              {badge.text}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-gray-600 ml-2">{subtitle}</p>}
        {action && <div className="ml-auto">{action}</div>}
      </div>
    </div>
  );
};

export default SectionHeader;
