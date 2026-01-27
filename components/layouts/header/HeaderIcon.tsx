"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import React from "react";

type HeaderIconProps = {
  icon: React.ReactNode;
  badgeCount?: number;
  maxBadgeCount?: number;
  children?: React.ReactNode;
  onClick?: () => void;
  label?: string;
  className?: string;
  badgeClassName?: string;
};

const HeaderIcon = ({
  icon,
  badgeCount = 0,
  maxBadgeCount = 99,
  children,
  onClick,
  label,
  className,
  badgeClassName,
}: HeaderIconProps) => {
  const displayCount =
    badgeCount > maxBadgeCount ? `+${maxBadgeCount}` : badgeCount;

  return (
    <div className={cn("relative inline-block z-100 group", className)}>
      <Button
        variant="plain"
        onClick={onClick}
        className="text-gray-800 flex items-center 
          border-transparent border-2 border-b-0
          group-hover:border-gray-800
          group-hover:bg-white
          relative z-70
          transition-colors duration-100 rounded-none
          px-2 py-2 h-auto mn-w-0
        "
        aria-label={label}
      >
        <div className="relative">
          {badgeCount > 0 && (
            <span
              className={cn(
                "absolute -top-2 -right-2.5 flex justify-center items-center h-4 min-w-[1rem] px-0.5 text-[10px] font-bold text-white bg-red-600 rounded-full",
                badgeClassName
              )}
            >
              {displayCount}
            </span>
          )}
          {icon}
        </div>
        {label && <span className="sr-only">{label}</span>}
      </Button>

      {children}
    </div>
  );
};

export default HeaderIcon;
