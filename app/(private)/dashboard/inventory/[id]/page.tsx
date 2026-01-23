"use client";
import type { UpdateInventoryFormSchema } from "@/features/inventory";
import {
  useGetInventoryByIdQuery,
  useUpdateInventoryMutation,
} from "@/features/inventory";
import UpdateInventoryForm from "@/features/inventory/components/UpdateInventoryForm";
import useToast from "@/hooks/ui/useToast";
import { TryAsync } from "@/shared";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const UpdateInventoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();

  const {
    data: inventory,
    isLoading,
    isError,
    error,
  } = useGetInventoryByIdQuery(params.id as string, {
    skip: !params.id,
  });

  const [updateInventory, { isLoading: isUpdating }] =
    useUpdateInventoryMutation();

  useEffect(() => {
    console.log("Fetched inventory:", inventory);
  }, [inventory]);

  const handleSubmit = async (data: UpdateInventoryFormSchema) => {
    if (!inventory) return;

    console.log("Submitting inventory update:", data);
    const { error: submitError } = await TryAsync(() =>
      updateInventory(data).unwrap()
    );

    if (submitError) {
      showToast({
        message: submitError.detail || "Failed to update inventory",
        type: "error",
      });
      return;
    }

    showToast({
      message: "Inventory updated successfully",
      type: "success",
    });
    router.push("/dashboard/inventory");
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            {(error as { data?: { detail?: string } })?.data?.detail ||
              "Failed to load inventory"}
          </p>
          <button
            onClick={() => router.push("/dashboard/inventory")}
            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  if (!inventory) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Inventory not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/inventory")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Inventory
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Update Inventory</h1>
        <p className="text-gray-600 mt-1">
          Update stock levels and thresholds for all variants
        </p>
      </div>

      {/* Form */}
      <UpdateInventoryForm
        inventory={inventory}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default UpdateInventoryPage;
