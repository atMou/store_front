"use client";

import DateRangePicker from "@/components/molecules/DateRangePicker";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface OrdersTableFiltersProps {
  filters: {
    status: string;
    minPrice: string;
    maxPrice: string;
    startDate: string;
    endDate: string;
    searchTerm: string;
  };
  onFiltersChange: (filters: OrdersTableFiltersProps["filters"]) => void;
  onReset: () => void;
}

const OrdersTableFilters = ({
  filters,
  onFiltersChange,
  onReset,
}: OrdersTableFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    onFiltersChange({
      ...filters,
      startDate: range.from ? range.from.toISOString() : "",
      endDate: range.to ? range.to.toISOString() : "",
    });
  };

  const hasActiveFilters =
    filters.status ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.startDate ||
    filters.endDate ||
    filters.searchTerm;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <span className="font-medium text-gray-900">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${
            isExpanded ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search by order number..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Order Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Min Price
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Max Price
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date Range
              </label>
              <DateRangePicker
                value={{
                  from: filters.startDate
                    ? new Date(filters.startDate)
                    : undefined,
                  to: filters.endDate ? new Date(filters.endDate) : undefined,
                }}
                onChange={handleDateRangeChange}
              />
            </div>
          </div>

          {}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersTableFilters;
