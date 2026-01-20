"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import { RefreshCw } from "lucide-react";
import React, { useState } from "react";

interface TableHeaderProps {
  title?: string;
  subtitle?: string;
  totalResults?: number;
  currentPage?: number;
  resultsPerPage?: number;
  onRefresh?: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  subtitle,
  totalResults,
  currentPage,
  resultsPerPage,
  onRefresh,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    setIsSpinning(true);
    onRefresh?.();
    setTimeout(() => setIsSpinning(false), 1000);
  };

  return (
    <div className="p-2 sm:px-4 sm:py-1 border-b border-black flex flex-col sm:flex-row justify-between items-start  sm:items-center gap-4">
      {(title || subtitle) && (
        <div>
          {title && <h2 className="font-bold text-lg text-black">{title}</h2>}
          {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
        </div>
      )}

      <p className="text-xs text-gray-700  ">
        Showing {totalResults !== undefined ? totalResults : 0} results
        {currentPage ? ` (Page ${currentPage})` : ""}
        {totalResults !== undefined && totalResults > 0 && resultsPerPage
          ? `, showing ${resultsPerPage} items per page`
          : ""}
      </p>
      <div className="flex items-center  self-end sm:self-auto">
        {onRefresh && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleRefresh}
                className="p-2 cursor-pointer bg-white flex items-center justify-center"
              >
                <RefreshCw
                  size={16}
                  className={`transition-transform duration-1000 ${
                    isSpinning ? "rotate-360" : ""
                  }`}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh data</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default TableHeader;
