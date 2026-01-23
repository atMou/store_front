"use client";
import NumberInput from "@/components/atoms/NumberInput";
import FormValidationErrors from "@/components/feedback/FormValidationErrors";
import DropdownMultiSelect from "@/components/molecules/DropdownMultiSelect";
import ImageZoomModal from "@/components/organisms/ImageZoomModal";
import type { InventoryResult } from "@/features/inventory";
import { useGetWarehousesQuery } from "@/features/inventory/api";
import SizeDropdown from "@/features/product/components/SizeDropdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, Warehouse } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import type { ColorVariantResult, WarehouseResult } from "../types";
import {
  updateInventoryFormSchema,
  type UpdateInventoryFormSchema,
  type UpdateInventorySizeSchema,
} from "../validations/UpdateInventoryFormValidation";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

interface ColorVariantSectionProps {
  colorVariant?: ColorVariantResult;
  colorIndex: number;
  control: Control<UpdateInventoryFormSchema>;
  errors: FieldErrors<UpdateInventoryFormSchema>;
  warehouses: WarehouseResult[];
  onRemoveColor: () => void;
}

const ColorVariantSection: React.FC<ColorVariantSectionProps> = ({
  colorVariant,
  colorIndex,
  control,
  errors,
  warehouses,
  onRemoveColor,
}) => {
  // Use field array for size variants within this color
  const {
    fields: sizeVariantFields,
    append: appendSizeVariant,
    update,
    remove: removeSizeVariant,
  } = useFieldArray({
    control,
    name: `colorVariants.${colorIndex}.sizeVariants` as const,
  });

  const addSizeVariant = () => {
    appendSizeVariant({
      sizeVariantId: EMPTY_GUID,
      size: "",
      stock: 0,
      low: 10,
      mid: 50,
      high: 100,
      warehouses: [],
    });
  };

  return (
    <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
      {/* Color Header */}
      <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            {colorVariant?.color?.hex ? (
              <div
                className="w-5 h-5 rounded-full border-2 border-gray-400 shadow-sm"
                style={{ backgroundColor: colorVariant.color.hex }}
                title={`${colorVariant.color.name} - ${colorVariant.color.hex}`}
              />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-400 bg-gray-300" />
            )}
            <span>{colorVariant?.color?.name || "Unknown Color"}</span>
            <span className="text-sm text-gray-500 ml-2">
              ({sizeVariantFields.length} sizes)
            </span>
          </h3>
          <button
            type="button"
            onClick={onRemoveColor}
            className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded hover:bg-red-50"
          >
            Delete Color
          </button>
        </div>
      </div>

      {/* Size Variants for this Color */}
      <div className="p-6 space-y-4 bg-white">
        {sizeVariantFields.map((sizeVariantField, sizeIndex) => {
          const typedField = sizeVariantField as UpdateInventorySizeSchema & {
            id: string;
          };
          const inventorySize = colorVariant?.sizeVariants?.find(
            (s) => s.size.code === typedField.size
          );

          return (
            <div
              key={sizeVariantField.id}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm flex items-center gap-2 text-gray-700 font-medium">
                  <Package size={16} className="text-blue-500" />
                  Size Variant {sizeIndex + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeSizeVariant(sizeIndex)}
                  className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>

              {/* Size Dropdown */}
              <div className="mb-4">
                <SizeDropdown<UpdateInventoryFormSchema>
                  control={control}
                  name={
                    `colorVariants.${colorIndex}.sizeVariants.${sizeIndex}.size` as `colorVariants.${number}.sizeVariants.${number}.size`
                  }
                  label="Select Size"
                />
              </div>

              {/* Stock Fields Grid */}
              {typedField.size && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <NumberInput<UpdateInventoryFormSchema>
                      control={control}
                      name={
                        `colorVariants.${colorIndex}.sizeVariants.${sizeIndex}.stock` as `colorVariants.${number}.sizeVariants.${number}.stock`
                      }
                      label="Stock"
                      placeholder="0"
                      required
                      isInteger
                    />

                    <NumberInput<UpdateInventoryFormSchema>
                      control={control}
                      name={
                        `colorVariants.${colorIndex}.sizeVariants.${sizeIndex}.low` as `colorVariants.${number}.sizeVariants.${number}.low`
                      }
                      label="Low Threshold"
                      placeholder="10"
                      required
                      isInteger
                    />

                    <NumberInput<UpdateInventoryFormSchema>
                      control={control}
                      name={
                        `colorVariants.${colorIndex}.sizeVariants.${sizeIndex}.mid` as `colorVariants.${number}.sizeVariants.${number}.mid`
                      }
                      label="Mid Threshold"
                      placeholder="50"
                      required
                      isInteger
                    />

                    <NumberInput<UpdateInventoryFormSchema>
                      control={control}
                      name={
                        `colorVariants.${colorIndex}.sizeVariants.${sizeIndex}.high` as `colorVariants.${number}.sizeVariants.${number}.high`
                      }
                      label="High Threshold"
                      placeholder="100"
                      required
                      isInteger
                    />
                  </div>

                  {/* Warehouses Multiselect */}
                  <div className="mt-4">
                    <label className="flex items-center gap-2 text-sm mb-2">
                      <Warehouse size={16} className="text-gray-600" />
                      Warehouses
                    </label>
                    <DropdownMultiSelect
                      options={warehouses.map((w) => ({
                        label: `${w.name} (${w.code})`,
                        value: w.code,
                      }))}
                      value={typedField.warehouses || []}
                      onChange={(values) => {
                        update(sizeIndex, {
                          ...typedField,
                          warehouses: values,
                        });
                      }}
                      placeholder="Select warehouses..."
                    />
                  </div>

                  {/* Current Stock Info Display */}
                  {inventorySize && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <span className="text-gray-600 block mb-1">
                            Current Available
                          </span>
                          <span className="font-semibold text-green-600">
                            {inventorySize.availableStock}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 block mb-1">
                            Reserved
                          </span>
                          <span className="font-semibold text-yellow-600">
                            {inventorySize.reserved}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 block mb-1">
                            Current Total
                          </span>
                          <span className="font-semibold text-gray-800">
                            {inventorySize.stock.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Field-level errors */}
              {errors.colorVariants?.[colorIndex]?.sizeVariants?.[
                sizeIndex
              ] && (
                <div className="mt-2 text-sm text-red-600">
                  {errors.colorVariants?.[colorIndex]?.sizeVariants?.[sizeIndex]
                    ?.sizeVariantId && (
                    <p>
                      Internal Error: Invalid ID. Please remove and re-add this
                      size row.
                    </p>
                  )}
                  {/* Show generic message if it's not the hidden ID that's failing (or if there are multiple failures) */}
                  {!errors.colorVariants?.[colorIndex]?.sizeVariants?.[
                    sizeIndex
                  ]?.sizeVariantId && (
                    <p>Please check the fields above for errors.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Add Size Button */}
        <button
          type="button"
          onClick={addSizeVariant}
          className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800"
        >
          + Add Size Variant
        </button>
      </div>

      {/* Color-level errors */}
      {errors.colorVariants?.[colorIndex] && (
        <div className="px-6 pb-4 bg-white">
          <p className="text-sm text-red-600">
            {errors.colorVariants[colorIndex]?.message}
          </p>
        </div>
      )}
    </div>
  );
};

interface UpdateInventoryFormProps {
  inventory: InventoryResult;
  initialValues?: UpdateInventoryFormSchema;
  onSubmit: (data: UpdateInventoryFormSchema) => void;
  isLoading?: boolean;
}

const UpdateInventoryForm: React.FC<UpdateInventoryFormProps> = ({
  inventory,
  onSubmit,
  isLoading,
  initialValues,
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const { data: warehouses = [] } = useGetWarehousesQuery();

  const form = useForm<UpdateInventoryFormSchema>({
    resolver: zodResolver(updateInventoryFormSchema),
    mode: "onChange",
    defaultValues: initialValues || {
      id: "",
      colorVariants: [],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  // Use field array for managing color variants dynamically
  const { fields: colorVariantFields, remove: removeColorVariant } =
    useFieldArray({
      control,
      name: "colorVariants",
    });

  // Populate form with inventory data when it loads
  useEffect(() => {
    if (inventory && !initialValues) {
      const formData: UpdateInventoryFormSchema = {
        id: inventory.id,
        colorVariants: inventory.colorVariants.map((colorVariant) => ({
          colorVariantId: colorVariant.id,
          sizeVariants: colorVariant.sizeVariants.map((sizeVariant) => ({
            sizeVariantId: sizeVariant.id,
            size: sizeVariant.size.code,
            stock: sizeVariant.stock.stock || 0,
            low: sizeVariant.stock.low || 10,
            mid: sizeVariant.stock.mid || 50,
            high: sizeVariant.stock.high || 100,
            warehouses: sizeVariant.warehouses?.map((w) => w.code) || [],
          })),
        })),
      };
      reset(formData, { keepDefaultValues: false });
    }
  }, [inventory, initialValues, reset, form]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Product Info Header */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-start gap-4 mb-4">
          {inventory.imageUrl ? (
            <div
              className="relative w-20 h-20 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsImageModalOpen(true)}
            >
              <Image
                src={inventory.imageUrl}
                alt={inventory.slug}
                fill
                className="object-cover rounded"
              />
            </div>
          ) : (
            <div className="w-20 h-20 shrink-0 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
              No Image
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Product Information
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="block text-sm mb-1 text-gray-600">
              Product Slug
            </label>
            <p className="text-sm font-medium">{inventory.slug}</p>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm mb-1 text-gray-600">Brand</label>
            <p className="text-sm font-medium">{inventory.brand}</p>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm mb-1 text-gray-600">
              Product ID
            </label>
            <p className="text-sm font-medium text-gray-500">
              {inventory.productId}
            </p>
          </div>
        </div>

        {/* Stock Summary */}
        <div className="mt-4 pt-4 border-t border-gray-300">
          <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
            <Warehouse size={16} />
            Stock Summary
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="block text-sm mb-1 text-gray-600">
                Total Stock
              </label>
              <p className="text-sm font-semibold">{inventory.totalStock}</p>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm mb-1 text-gray-600">
                Reserved
              </label>
              <p className="text-sm font-semibold text-yellow-600">
                {inventory.totalReserved}
              </p>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm mb-1 text-gray-600">
                Available
              </label>
              <p className="text-sm font-semibold text-green-600">
                {inventory.totalAvailableStock}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Color Variants Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm">
            Color Variants <span className="text-red-600">*</span>
          </label>
          <p className="text-sm text-gray-500">
            {inventory?.colorVariants?.length || 0} color(s)
          </p>
        </div>

        {colorVariantFields.map((colorVariantField, colorIndex) => {
          const colorVariant = inventory?.colorVariants?.[colorIndex];

          return (
            <ColorVariantSection
              key={colorVariantField.id}
              colorVariant={colorVariant}
              colorIndex={colorIndex}
              control={control}
              errors={errors}
              warehouses={warehouses}
              onRemoveColor={() => removeColorVariant(colorIndex)}
            />
          );
        })}

        {/* Form-level errors */}
        {errors.colorVariants && !Array.isArray(errors.colorVariants) && (
          <p className="text-sm text-red-600 mt-2">
            {errors.colorVariants.message}
          </p>
        )}
      </div>

      {/* Error Display */}
      <FormValidationErrors errors={form.formState.errors} />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full cursor-pointer py-3 bg-black text-white font-medium rounded-none hover:bg-black/80 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
      >
        {isLoading ? "Updating Inventory..." : "Update Inventory"}
      </button>

      {/* Image Zoom Modal */}
      <ImageZoomModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={inventory.imageUrl}
        alt={inventory.slug}
      />
    </form>
  );
};

export default UpdateInventoryForm;
