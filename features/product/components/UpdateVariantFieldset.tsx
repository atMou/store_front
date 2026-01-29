"use client";

import {
  ArrowUpDown,
  MoveUpRight,
  PackagePlus,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Control,
  FieldErrors,
  Path,
  UseFormSetValue,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import ImagePreview from "../../../components/atoms/ImagePreview";
import ImageUploader from "../../../components/atoms/ImageUploader";
import NumberInput from "../../../components/atoms/NumberInput";
import { UpdateProductFormSchema } from "../validations/UpdateProductFormValidation";
import ColorDropdown from "./ColorDropdown";
import SizeDropdown from "./SizeDropdown";

interface UpdateVariantFieldsetProps {
  variantIndex: number;
  control: Control<UpdateProductFormSchema>;
  errors: FieldErrors<UpdateProductFormSchema>;
  setValue: UseFormSetValue<UpdateProductFormSchema>;
  onRemove: () => void;
  onRemoveExistingImage: (imageId: string) => void;
  onSetMainImage: (imageId: string) => void;
}

export default function UpdateVariantFieldset({
  variantIndex,
  control,
  errors,
  setValue,
  onRemove,
  onRemoveExistingImage,
  onSetMainImage,
}: UpdateVariantFieldsetProps) {
  const variantImageDtos =
    useWatch({
      control,
      name: `variants.${variantIndex}.imageDtos`,
    }) || [];

  const variantId = useWatch({
    control,
    name: `variants.${variantIndex}.variantId`,
  });

  const variant = useWatch({
    control,
    name: `variants.${variantIndex}`,
  });

  const {
    fields: sizeVariants,
    append: appendSizeVariant,
    remove: removeSizeVariant,
  } = useFieldArray({
    control,
    name: `variants.${variantIndex}.sizeVariants`,
  });

  const handleAddSizeVariant = () => {
    appendSizeVariant({
      sizeVariantId: undefined,
      size: "",
      stock: "" as unknown as number,
      stockLow: "" as unknown as number,
      stockMid: "" as unknown as number,
      stockHigh: "" as unknown as number,
      isDeleted: false,
    });
  };

  const isNewVariant = !variantId;

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
      {variantImageDtos.filter((img) => !img.isDeleted).length > 0 && (
        <div>
          <label className="block text-xs mb-2 font-medium">
            Existing Images
          </label>
          <ImagePreview
            previews={variantImageDtos
              .filter((img) => !img.isDeleted)
              .map((img) => ({
                id: img.productImageId,
                url: img.url,
                altText: img.altText,
                isMain: img.isMain,
              }))}
            name={`variant-${variantIndex}-existing-images`}
            showMainSelector={true}
            enableDragDrop={false}
            onRemove={(index) => {
              const activeImages = variantImageDtos.filter(
                (img) => !img.isDeleted
              );
              onRemoveExistingImage(activeImages[index]?.productImageId);
            }}
            onSelectMain={(index) => {
              const activeImages = variantImageDtos.filter(
                (img) => !img.isDeleted
              );
              onSetMainImage(activeImages[index]?.productImageId);
            }}
          />
        </div>
      )}

      {}
      <div>
        <label className="block text-xs mb-2">
          Add New Images (Color-specific)
        </label>
        <ImageUploader
          control={control}
          errors={errors}
          setValue={setValue}
          name={
            `variants.${variantIndex}.images` as Path<UpdateProductFormSchema>
          }
          label=""
          maxFiles={5}
          showMainSelector={true}
          isMainFieldName={
            `variants.${variantIndex}.isMain` as Path<UpdateProductFormSchema>
          }
        />
      </div>

      {}
      {isNewVariant ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium">Size Variants</label>
            <button
              type="button"
              onClick={handleAddSizeVariant}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 hover:bg-green-100 rounded"
            >
              <PackagePlus size={14} />
              Add Size
            </button>
          </div>

          {sizeVariants.map((field, sizeIndex) => (
            <div key={field.id} className="bg-gray-50 p-4 rounded space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium">Size {sizeIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeSizeVariant(sizeIndex)}
                  className="text-red-600 hover:text-red-800"
                  title="Remove size variant"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="max-w-xs">
                <SizeDropdown
                  control={control}
                  name={`variants.${variantIndex}.sizeVariants.${sizeIndex}.size`}
                  label="Size"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <NumberInput
                  control={control}
                  name={`variants.${variantIndex}.sizeVariants.${sizeIndex}.stock`}
                  label="Current Stock"
                  Icon={PackagePlus}
                />
                <NumberInput
                  control={control}
                  name={`variants.${variantIndex}.sizeVariants.${sizeIndex}.stockLow`}
                  label="Stock Low"
                  Icon={ArrowUpDown}
                />
                <NumberInput
                  control={control}
                  name={`variants.${variantIndex}.sizeVariants.${sizeIndex}.stockMid`}
                  label="Stock Mid"
                  Icon={MoveUpRight}
                />
                <NumberInput
                  control={control}
                  name={`variants.${variantIndex}.sizeVariants.${sizeIndex}.stockHigh`}
                  label="Stock High"
                  Icon={Plus}
                />
              </div>

              {errors.variants?.[variantIndex]?.sizeVariants?.[sizeIndex] && (
                <p className="text-xs text-red-600">
                  {errors.variants[variantIndex].sizeVariants![sizeIndex]?.size
                    ?.message ||
                    errors.variants[variantIndex].sizeVariants![sizeIndex]
                      ?.stock?.message ||
                    errors.variants[variantIndex].sizeVariants![sizeIndex]
                      ?.stockLow?.message}
                </p>
              )}
            </div>
          ))}

          {errors.variants?.[variantIndex]?.sizeVariants && (
            <p className="text-xs text-red-600">
              {typeof errors.variants[variantIndex].sizeVariants === "object" &&
              "message" in errors.variants[variantIndex].sizeVariants!
                ? (
                    errors.variants[variantIndex].sizeVariants as {
                      message?: string;
                    }
                  ).message
                : null}
            </p>
          )}
        </div>
      ) : (
        variant?.sizeVariants &&
        variant.sizeVariants.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-medium">
              Size Variants (Read-only)
            </label>
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-xs text-blue-800 mb-2">
                📦 Size variants are managed in the <strong>Inventory</strong>{" "}
                page.
              </p>
              <div className="space-y-1">
                {variant.sizeVariants
                  .filter((sv) => !sv.isDeleted)
                  .map((sv, idx: number) => (
                    <div
                      key={idx}
                      className="text-xs text-gray-700 flex justify-between"
                    >
                      <span>
                        <strong>Size:</strong> {sv.size}
                      </span>
                      <span>
                        <strong>Stock:</strong> {sv.stock ?? "N/A"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
