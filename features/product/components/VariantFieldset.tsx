"use client";

import { Trash2 } from "lucide-react";
import { Control, FieldErrors, Path, UseFormSetValue } from "react-hook-form";
import ImageUploader from "../../../components/atoms/ImageUploader";
import {
  ProductFormInput,
  ProductFormSchema,
} from "../validations/ProductFormValidation";
import ColorDropdown from "./ColorDropdown";

interface VariantFieldsetProps {
  variantIndex: number;
  control: Control<ProductFormInput>;
  errors: FieldErrors<ProductFormInput>;
  setValue: UseFormSetValue<ProductFormInput>;
  onRemove: () => void;
}

export default function VariantFieldset({
  variantIndex,
  control,
  errors,
  setValue,
  onRemove,
}: VariantFieldsetProps) {
  return (
    <div className="border border-black p-6 space-y-4 relative">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-3 right-3 p-1 text-red-600 hover:bg-red-50 rounded"
        title="Remove variant"
      >
        <Trash2 size={18} />
      </button>

      <h3 className="text-sm font-semibold mb-4">
        Color Variant {variantIndex + 1}
      </h3>

      {}
      <div className="max-w-xs">
        <ColorDropdown
          control={control}
          name={`variants.${variantIndex}.color`}
          label="Color"
        />
      </div>

      {}
      <div>
        <label className="block text-xs mb-2">
          Variant Images (Color-specific)
        </label>
        <ImageUploader
          control={control}
          errors={errors}
          setValue={setValue}
          name={`variants.${variantIndex}.images` as Path<ProductFormSchema>}
          label=""
          maxFiles={5}
          showMainSelector={true}
          isMainFieldName={
            `variants.${variantIndex}.isMain` as Path<ProductFormSchema>
          }
        />
      </div>

      {}
      <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
        <p className="text-xs text-blue-700">
          <strong>Note:</strong> Size variants and stock levels are managed
          separately in the Inventory section after creating the product.
        </p>
      </div>

      {errors.variants?.[variantIndex] && (
        <div className="text-red-600 text-xs mt-2">
          {errors.variants[variantIndex]?.color?.message ||
            errors.variants[variantIndex]?.images?.message ||
            errors.variants[variantIndex]?.isMain?.message}
        </div>
      )}
    </div>
  );
}
