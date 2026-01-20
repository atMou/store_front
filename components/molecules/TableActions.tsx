"use client";

import Dropdown from "@/components/atoms/Dropdown";
import { Download } from "lucide-react";
import React, { useState } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface CustomAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedRows: T[]) => void;
  requiresSelection?: boolean;
}

interface TableActionsProps<T extends Record<string, unknown>> {
  data: T[];
  selectedRows: Set<string>;
  columns: Column<T>[];
  showSearchBar: boolean;
  onSearch: (data: { searchQuery: string }) => void;
  allColumns: Column<T>[];
  visibleColumns: Set<string>;
  onToggleColumn: (columnKey: string) => void;
  customActions?: CustomAction<T>[];
}

const TableActions = <T extends { id: string }>({
  data,
  selectedRows,
  columns,
  showSearchBar,
  onSearch,
  allColumns,
  visibleColumns,
  onToggleColumn,
  customActions = [],
}: TableActionsProps<T>) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleExport = () => {
    const rowsToExport =
      selectedRows.size > 0
        ? data.filter((row) => {
            const id = row.id;
            return selectedRows.has(String(id));
          })
        : data;

    const csvContent = [
      columns.map((col) => `"${col.label}"`).join(","),
      ...rowsToExport.map((row) =>
        columns
          .map((col) => {
            const value = col.render
              ? col.render(row)
              : (row as Record<string, unknown>)[col.key];
            return `"${value?.toString().replace(/"/g, '""') || ""}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `table_export_${new Date().toISOString()}.csv`;
    link.click();
  };

  return (
    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        {showSearchBar && (
          <input
            type="text"
            placeholder={isSearchFocused ? "" : "Search..."}
            onChange={(e) => onSearch({ searchQuery: e.target.value })}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="px-4 py-2 border border-black focus:outline-none  focus:ring-black w-full sm:w-auto text-sm caret-black placeholder:text-xs"
          />
        )}
        <Dropdown
          placeholder="Choose columns"
          multiSelect
          options={allColumns.map((col) => ({
            label: col.label,
            value: col.key,
          }))}
          value={Array.from(visibleColumns)}
          onChange={(values) => {
            const newValues = Array.isArray(values) ? values : [values];
            // Toggle columns based on changes
            const currentSet = new Set(visibleColumns);
            const newSet = new Set(newValues);

            allColumns.forEach((col) => {
              if (currentSet.has(col.key) !== newSet.has(col.key)) {
                onToggleColumn(col.key);
              }
            });
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        {customActions.length > 0 && (
          <Dropdown
            placeholder="Actions"
            options={customActions
              .filter(
                (action) => !action.requiresSelection || selectedRows.size > 0
              )
              .map((action) => ({
                label: action.label,
                value: action.label,
              }))}
            onChange={(value) => {
              const action = customActions.find((a) => a.label === value);
              if (action) {
                const selectedData = data.filter((row) =>
                  selectedRows.has(row.id)
                );
                action.onClick(selectedData);
              }
            }}
          />
        )}
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-black text-white hover:bg-black/80 flex items-center gap-2 w-full sm:w-auto text-sm font-medium"
        >
          <Download size={16} />
          Export {selectedRows.size > 0 ? "Selected" : "All"}
        </button>
      </div>
    </div>
  );
};

export default TableActions;
