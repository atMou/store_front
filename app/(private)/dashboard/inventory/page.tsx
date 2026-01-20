"use client";
import Table from "@/components/molecules/Table";
import type { InventoryResult } from "@/features/inventory";
import {
  useInfiniteInventory,
} from "@/features/inventory";
import { Edit, History, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const InventoryDashboard = () => {
  const router = useRouter();
  const [, setSelectedInventory] =
    useState<InventoryResult | null>(null);

  const { inventory, pagination, isLoading, hasNextPage, loadMore } =
    useInfiniteInventory({
      pageSize: 20,
    });

  

  const columns = [
    {
      key: "brand",
      label: "Brand",
      sortable: true,
      render: (row: InventoryResult) => (
        <span className="font-medium">{row.brand}</span>
      ),
    },
    {
      key: "slug",
      label: "Product",
      sortable: true,
      render: (row: InventoryResult) => (
        <span className="text-sm text-gray-600">{row.slug}</span>
      ),
    },
    {
      key: "totalStock",
      label: "Total Stock",
      sortable: true,
      render: (row: InventoryResult) => (
        <span className="font-semibold">{row.totalStock}</span>
      ),
    },
    {
      key: "totalReserved",
      label: "Reserved",
      sortable: true,
      render: (row: InventoryResult) => (
        <span className="text-yellow-600">{row.totalReserved}</span>
      ),
    },
    {
      key: "totalAvailableStock",
      label: "Available",
      sortable: true,
      render: (row: InventoryResult) => (
        <span
          className={
            row.totalAvailableStock <= 20
              ? "text-red-600 font-medium"
              : "text-green-600 font-medium"
          }
        >
          {row.totalAvailableStock}
        </span>
      ),
    },
    {
      key: "colorVariants",
      label: "Colors",
      sortable: false,
      render: (row: InventoryResult) => (
        <div className="flex flex-wrap gap-1">
          {row.colorVariants?.slice(0, 3).map((colorVariant) => (
            <span
              key={colorVariant.id}
              className="inline-block bg-gray-100 px-2 py-1 rounded text-xs"
            >
              {colorVariant.color.name} (
              {colorVariant.sizeVariants?.length ?? 0})
            </span>
          ))}
          {(row.colorVariants?.length ?? 0) > 3 && (
            <span className="text-xs text-gray-500">
              +{(row.colorVariants?.length ?? 0) - 3} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: "sizeVariants",
      label: "Sizes",
      sortable: false,
      render: (row: InventoryResult) => {
        const allSizes =
          row.colorVariants?.flatMap((cv) => cv.sizeVariants ?? []) ?? [];
        return (
          <div className="flex flex-wrap gap-1">
            {allSizes.slice(0, 3).map((variant) => (
              <span
                key={variant.id}
                className="inline-block bg-blue-50 px-2 py-1 rounded text-xs"
              >
                {variant.size.name}: {variant.availableStock}
              </span>
            ))}
            {allSizes.length > 3 && (
              <span className="text-xs text-gray-500">
                +{allSizes.length - 3} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      render: (row: InventoryResult) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            row.totalAvailableStock <= 20
              ? "bg-red-100 text-red-600"
              : row.totalAvailableStock <= 50
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
          }`}
        >
          {row.totalAvailableStock <= 20
            ? "Low Stock"
            : row.totalAvailableStock <= 50
              ? "Medium Stock"
              : "In Stock"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: InventoryResult) => (
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/dashboard/inventory/${row.id}`)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => {
              setSelectedInventory(row);
            }}
            className="text-green-600 hover:text-green-800 flex items-center gap-1"
          >
            <Plus size={16} />
            Quick Update
          </button>
          <button
            onClick={() => {
              setSelectedInventory(row);
            }}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            <History size={16} />
            History
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Inventory Dashboard</h1>
          <p className="text-sm text-gray-500">
            Manage variant stock and restock history
          </p>
        </div>
      </div>

      <Table
        data={inventory}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No inventory available"
        totalPages={Math.ceil(pagination.totalCount / pagination.pageSize)}
        totalResults={pagination.totalCount}
        resultsPerPage={pagination.pageSize}
        currentPage={pagination.currentPage}
      />

      {hasNextPage && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;
