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
  titleClassName?: string;
  direction?: "rtl" | "ltr";
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
  titleClassName,
  direction = "ltr",
}: SectionHeaderProps) => {
  return (
    <div
      dir={direction}
      className={cn(
        "max-w-7xl mx-auto sm:px-6 lg:px-8  px-6 py-2",
        containerClassName
      )}
    >
      <div className={cn("flex items-center gap-2", className)}>
        {icon && <>{icon}</>}
        <div className={cn("flex items-center gap-2 flex-1", headerClassName)}>
          <h2
            className={cn(
              "text-lg font-semibold text-gray-800",
              titleClassName
            )}
          >
            {title}
          </h2>
          {badge && (
            <span
              className={cn(
                "px-3 rounded-full text-xs font-medium",
                badgeVariants[badge.variant || "blue"]
              )}
            >
              {badge.text}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-gray-600 ms-2">{subtitle}</p>}
        {action && <div className="ms-auto">{action}</div>}
      </div>
    </div>
  );
};

export default SectionHeader;
