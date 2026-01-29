"use client";

import useQueryParams from "@/hooks/network/useQueryParams";
import React, { useRef, useState } from "react";
import TableActions from "../molecules/TableActions";
import TableBody from "../molecules/TableBody";
import TableHeader from "../molecules/TableHeader";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface CustomAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedRows: T[]) => void;
  requiresSelection?: boolean;
}

interface TableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  showHeader?: boolean;
  showPaginationDetails?: boolean;
  showSearchBar?: boolean;
  totalPages?: number;
  totalResults?: number;
  resultsPerPage?: number;
  currentPage?: number;
  expandable?: boolean;
  expandedRowId?: string | null;
  renderExpandedRow?: (row: T) => React.ReactNode;
  className?: string;
  customActions?: CustomAction<T>[];
}

const Table = <T extends { id: string }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No data available",
  title,
  subtitle,
  onRefresh,
  showHeader = true,
  showSearchBar = true,
  showPaginationDetails = true,
  totalPages,
  totalResults,
  resultsPerPage,
  currentPage,
  expandable = false,
  expandedRowId = null,
  renderExpandedRow,
  className = "",
  customActions = [],
}: TableProps<T>) => {
  const { query, updateQuery } = useQueryParams();

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((col) => col.key))
  );

  const sortInfo = query.sort
    ? (query.sort as string).split(":")
    : [null, "asc"];

  const sortKey = sortInfo[0] || null;

  const sortDirection = (sortInfo[1] as "asc" | "desc") || "asc";

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSort = (key: string) => {
    const newSortDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    const sortValue = `${key}:${newSortDirection}`;
    updateQuery({ sort: sortValue });
  };

  const handleSearch = (data: { searchQuery: string }) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      updateQuery({ searchQuery: data.searchQuery || "" });
    }, 300);
  };

  const handleSelectRow = (rowId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      const allRowIds = data.map((row) => row.id);
      setSelectedRows(new Set(allRowIds));
    }
  };

  const handleClearSelection = () => {
    setSelectedRows(new Set());
  };

  const handleToggleColumn = (columnKey: string) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(columnKey)) {
      if (newVisibleColumns.size > 1) {
        newVisibleColumns.delete(columnKey);
      }
    } else {
      newVisibleColumns.add(columnKey);
    }
    setVisibleColumns(newVisibleColumns);
  };

  if (!Array.isArray(data)) {
    return (
      <div className="text-center py-12 text-sm text-gray-700">
        {emptyMessage}
      </div>
    );
  }

  const filteredColumns = columns.filter((col) => visibleColumns.has(col.key));

  return (
    <div
      className={`w-full bg-white shadow-sm border border-black overflow-hidden ${className}`}
    >
      {showHeader && (
        <TableHeader
          title={title}
          subtitle={subtitle}
          totalResults={totalResults}
          currentPage={currentPage}
          resultsPerPage={resultsPerPage}
          onRefresh={onRefresh}
        />
      )}
      <TableActions
        data={data}
        selectedRows={selectedRows}
        columns={filteredColumns}
        showSearchBar={showSearchBar}
        onSearch={handleSearch}
        allColumns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
        customActions={customActions}
      />
      <div className="w-full overflow-x-auto">
        <TableBody
          data={data}
          columns={filteredColumns}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          expandable={expandable}
          expandedRowId={expandedRowId}
          renderExpandedRow={renderExpandedRow}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
        />
      </div>
      {showPaginationDetails &&
        totalPages !== undefined &&
        currentPage !== undefined && (
          <div className="p-4 border-t border-black">
            <div className="flex justify-between items-center text-xs text-gray-700">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              {totalResults && <span>Total: {totalResults} results</span>}
            </div>
          </div>
        )}
    </div>
  );
};

export default Table;
