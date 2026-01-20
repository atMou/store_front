"use client";

import { ArrowUpDown, Check, FileText } from "lucide-react";
import React from "react";
import LoadingDots from "../feedback/LoadingDots";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNestedValue = (obj: any, key: string): any => {
  return key
    .split(".")
    .reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
};

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface TableBodyProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  emptyMessage: string;
  sortKey: string | null;
  sortDirection: "asc" | "desc";
  onSort: (key: string) => void;
  expandable: boolean;
  expandedRowId: string | null;
  renderExpandedRow?: (row: T) => React.ReactNode;
  selectedRows: Set<string>;
  onSelectRow: (rowId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => {
  return (
    <div
      className="flex items-center justify-center cursor-pointer"
      onClick={onChange}
    >
      <div
        className={`w-5 h-5 flex items-center justify-center border transition-all ${
          checked ? "bg-black border-black" : "border-black"
        }`}
      >
        {checked && (
          <div className="text-white w-4 h-4 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

const TableBody = <T extends { id: string }>({
  data,
  columns,
  isLoading,
  emptyMessage,
  sortKey,
  sortDirection,
  onSort,
  expandable,
  expandedRowId,
  renderExpandedRow,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onClearSelection,
}: TableBodyProps<T>) => {
  return (
    <table className="w-full border-collapse min-w-[600px]">
      <thead>
        <tr className="bg-gray-50 border-b border-black">
          <th className="px-4 sm:px-4 py-2 text-left">
            <Checkbox
              checked={selectedRows.size === data.length && data.length > 0}
              onChange={onSelectAll}
            />
          </th>
          {columns.map((column) => (
            <th
              key={column.key}
              className={`px-4   text-${
                column.align || "left"
              } text-black font-bold text-xs ${
                column.width ? `w-${column.width}` : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {column.label}
                {column.sortable && (
                  <button
                    onClick={() => onSort(column.key)}
                    className={`p-1 hover:bg-gray-100 ${
                      sortKey === column.key ? "text-black" : "text-gray-400"
                    }`}
                  >
                    <div
                      style={{
                        transform:
                          sortKey === column.key && sortDirection === "desc"
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s",
                      }}
                    >
                      <ArrowUpDown size={14} />
                    </div>
                  </button>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {isLoading ? (
          <tr>
            <td colSpan={columns.length + 1} className="text-center py-16">
              <LoadingDots />
            </td>
          </tr>
        ) : data.length > 0 ? (
          <>
            {data.map((row, rowIndex) => {
              const isSelected = selectedRows.has(row.id);
              return (
                <React.Fragment key={row.id || rowIndex}>
                  <tr
                    className={`transition-colors text-sm text-gray-700 ${
                      isSelected
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 sm:px-6 py-4 relative">
                      {isSelected && (
                        <div className="absolute inset-y-0 left-0 w-1 bg-black" />
                      )}
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onSelectRow(row.id)}
                      />
                    </td>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 sm:px-6 py-4 text-${
                          column.align || "left"
                        }`}
                      >
                        {column.render
                          ? column.render(row)
                          : (getNestedValue(row, column.key) ?? "-")}
                      </td>
                    ))}
                  </tr>
                  {expandable &&
                    expandedRowId === row.id &&
                    renderExpandedRow && (
                      <tr
                        key="expanded-row"
                        className={isSelected ? "bg-gray-50" : ""}
                      >
                        <td colSpan={columns.length + 1} className="p-0">
                          <div className="overflow-hidden">
                            {renderExpandedRow(row)}
                          </div>
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              );
            })}
          </>
        ) : (
          <tr>
            <td colSpan={columns.length + 1} className="text-center py-16">
              <div className="flex flex-col items-center text-gray-700">
                <FileText size={32} className="mb-2 opacity-50" />
                <p className="text-sm">{emptyMessage}</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
      {selectedRows.size > 0 && (
        <tfoot>
          <tr className="bg-gray-50 border-t-2 border-black">
            <td colSpan={columns.length + 1} className="px-4 sm:px-6 py-3">
              <div className="flex items-center justify-between">
                <span className="text-black font-bold text-xs">
                  {selectedRows.size} {selectedRows.size === 1 ? "row" : "rows"}{" "}
                  selected
                </span>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-white border border-black text-black text-xs hover:bg-gray-50 font-medium"
                    onClick={onClearSelection}
                  >
                    Clear selection
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
};

export default TableBody;
