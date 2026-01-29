"use client";

import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";

  color?: string;

  className?: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = "md",
  color = "bg-indigo-600",
  className,
}) => {
  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-4 h-4",
  };

  const gapClasses = {
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        gapClasses[size],
        className
      )}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn("rounded-full", sizeClasses[size], color)}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingDots;
