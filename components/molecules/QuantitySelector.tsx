"use client";
import { useCart } from "@/features/cart/hooks";
import useToast from "@/hooks/ui/useToast";
import { Button } from "@/shared/ui/button";
import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  value: number;
  productId: string;
  colorVariantId: string;
  sizeVariantId: string;
};

const QuantitySelector = ({
  value,
  productId,
  colorVariantId,
  sizeVariantId,
}: QuantitySelectorProps) => {
  const { showToast } = useToast();
  const { updateItem, isUpdating } = useCart();

  const handleUpdate = async (newQty: number) => {
    if (newQty < 1 || newQty === value) return;

    const result = await updateItem(
      productId,
      newQty,
      colorVariantId,
      sizeVariantId
    );

    if (!result.success) {
      const errorMessage =
        result.error?.errors?.join(", ") || "Failed to update quantity";
      showToast({ message: errorMessage, type: "error" });
    }
  };

  return (
    <div className="flex items-center gap-0 max-w-fit border border-gray-300 bg-white">
      <Button
        type="button"
        onClick={() => handleUpdate(value + 1)}
        disabled={isUpdating}
        className="h-8 w-8 p-0 flex items-center justify-center transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-none border-r border-gray-300"
      >
        <Plus size={14} strokeWidth={2} />
      </Button>

      <span className="h-8 min-w-10 flex items-center justify-center text-sm font-semibold text-gray-900 px-3">
        {value}
      </span>

      <Button
        type="button"
        onClick={() => handleUpdate(value - 1)}
        disabled={isUpdating || value <= 1}
        className="h-8 w-8 p-0 flex items-center justify-center transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-none border-l border-gray-300"
      >
        <Minus size={14} strokeWidth={2} />
      </Button>
    </div>
  );
};

export default QuantitySelector;
