"use client";

import {
  ImagePreview,
  ImageUploader,
  NumberInput,
  TextAreaInput,
  TextInput,
} from "@/components/atoms";
import FormValidationErrors from "@/components/feedback/FormValidationErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag } from "lucide-react";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  UpdateProductFormSchema,
  updateProductFormSchema,
  UpdateVariantFormSchema,
} from "../validations/UpdateProductFormValidation";
import AttributeInputs from "./AttributeInputs";
import BrandDropdown from "./BrandDropdown";
import CategoryDropdown from "./CategoryDropdown";
import MaterialDetailInputs from "./MaterialDetailInputs";
import ProductFlagsCheckboxes from "./ProductFlagsCheckboxes";
import UpdateVariantFieldset from "./UpdateVariantFieldset";

interface UpdateProductFormProps {
  initialData?: UpdateProductFormSchema;
}

const UpdateProductForm: React.FC<UpdateProductFormProps> = ({
  initialData,
}) => {
  // const [updateProduct, { isLoading, error }] = useUpdateProductMutation();

  const form = useForm<UpdateProductFormSchema>({
    resolver: zodResolver(updateProductFormSchema),
    defaultValues: initialData,
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = form;

  const formVariants = useWatch({ control, name: "variants" }) || [];
  const formImageDtos = useWatch({ control, name: "imageDtos" }) || [];

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleAddVariant = () => {
    const newVariant: UpdateVariantFormSchema = {
      variantId: undefined,
      color: "",
      sizeVariants: [
        {
          sizeVariantId: undefined,
          size: "",
          stock: "" as unknown as number,
          stockLow: "" as unknown as number,
          stockMid: "" as unknown as number,
          stockHigh: "" as unknown as number,
          isDeleted: false,
        },
      ],
      images: [],
      isMain: [],
      imageDtos: [],
      isDeleted: false,
    };
    const updatedVariants = [...formVariants, newVariant];
    setValue("variants", updatedVariants, {
      shouldValidate: false,
    });
  };

  const handleRemoveVariant = (index: number) => {
    const variant = formVariants[index];
    // If variant has ID (existing), mark as deleted
    if (variant.variantId) {
      setValue(`variants.${index}.isDeleted`, true, { shouldValidate: true });
    } else {
      // If no ID (new), remove from array
      const updatedVariants = formVariants.filter((_, i) => i !== index);
      setValue("variants", updatedVariants, {
        shouldValidate: true,
      });
    }
  };

  const handleRemoveExistingProductImage = (imageId: string) => {
    const updatedImages = formImageDtos.map((img) =>
      img.productImageId === imageId ? { ...img, isDeleted: true } : img
    );
    setValue("imageDtos", updatedImages, { shouldValidate: true });
  };

  const handleSetMainProductImage = (imageId: string) => {
    const updatedImages = formImageDtos.map((img) => ({
      ...img,
      isMain: img.productImageId === imageId,
    }));
    setValue("imageDtos", updatedImages, { shouldValidate: true });
  };

  const onSubmit = async (data: UpdateProductFormSchema) => {
    console.log("Submitting update with data:", data);
    // try {
    //   const formData = buildUpdateProductFormData(data);

    //   await updateProduct({ data: formData }).unwrap();
    //   console.log("Product updated successfully");
    // } catch (err) {
    //   console.log("Error updating product:", err);
    // }
  };
  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <TextInput
        control={control}
        name="slug"
        label="Product Slug"
        placeholder="product-slug"
        Icon={Tag}
      />

      <div className="grid grid-cols-3 gap-6">
        <BrandDropdown control={control} />

        <NumberInput
          control={control}
          name="price"
          label="Price"
          placeholder="99.99"
          step="0.01"
          isInteger
        />

        <NumberInput
          control={control}
          name="newPrice"
          label="Sale Price (Optional)"
          placeholder="79.99"
          step="0.01"
          isInteger
        />
      </div>

      <CategoryDropdown control={control} />

      <TextAreaInput
        control={control}
        name="description"
        label="Description"
        placeholder="Describe your amazing product here..."
        required
        rows={4}
      />

      {/* Product Attributes */}
      <AttributeInputs
        control={control}
        name="detailsAttributes"
        label="Product Details"
        error={errors.detailsAttributes?.message}
      />

      {/* Size & Fit Attributes */}
      <AttributeInputs
        control={control}
        name="sizeFitAttributes"
        label="Size & Fit Information"
        error={errors.sizeFitAttributes?.message}
      />

      {/* Material Details */}
      <MaterialDetailInputs
        control={control}
        name="materialDetails"
        error={errors.materialDetails?.message}
      />

      {/* Existing Product Images */}
      {formImageDtos.filter((img) => !img.isDeleted).length > 0 && (
        <div>
          <label className="block text-xs mb-2">
            Existing Product Images (Select Main Image)
          </label>
          <ImagePreview
            previews={formImageDtos
              .filter((img) => !img.isDeleted)
              .map((img) => ({
                id: img.productImageId,
                url: img.url,
                altText: img.altText,
                isMain: img.isMain,
              }))}
            name="existingProductImages"
            showMainSelector
            enableDragDrop={true}
            onReorder={(newOrder) => {
              const activeImages = formImageDtos.filter(
                (img) => !img.isDeleted
              );
              const deletedImages = formImageDtos.filter(
                (img) => img.isDeleted
              );
              setValue(
                "imageDtos",
                [
                  ...newOrder.map((item, index) => {
                    const originalImg = activeImages.find(
                      (img) => img.productImageId === item.id
                    );
                    return originalImg
                      ? { ...originalImg, isMain: item.isMain ?? false }
                      : activeImages[index];
                  }),
                  ...deletedImages,
                ],
                { shouldValidate: true }
              );
            }}
            onRemove={(index) => {
              const activeImages = formImageDtos.filter(
                (img) => !img.isDeleted
              );
              handleRemoveExistingProductImage(
                activeImages[index].productImageId
              );
            }}
            onSelectMain={(index) => {
              const activeImages = formImageDtos.filter(
                (img) => !img.isDeleted
              );
              handleSetMainProductImage(activeImages[index].productImageId);
            }}
          />
          {errors?.isMain && (
            <p className="text-xs text-red-600 mt-2">{errors.isMain.message}</p>
          )}
        </div>
      )}

      {/* New Product Images Upload */}
      <div>
        <ImageUploader
          control={control}
          errors={errors}
          setValue={setValue}
          label="Upload New Product Images (Max 5)"
          name="images"
          maxFiles={5}
          showMainSelector
        />
      </div>

      {/* Product Flags */}
      <ProductFlagsCheckboxes control={control} />

      {/* Variants */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-xs">
            Product Variants <span className="text-red-600">*</span>
          </label>
          <button
            type="button"
            onClick={handleAddVariant}
            className="px-4 py-2 bg-black text-white text-xs font-medium rounded-none hover:bg-black/80"
          >
            Add Variant
          </button>
        </div>

        {formVariants.length > 0 && (
          <div className="space-y-6">
            {formVariants.map((variant, index) => {
              if (variant.isDeleted) return null;

              return (
                <UpdateVariantFieldset
                  key={variant.variantId || `new-${index}`}
                  variantIndex={index}
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  onRemove={() => handleRemoveVariant(index)}
                  onRemoveExistingImage={(imageId) => {
                    const updatedVariants = [...formVariants];
                    const variantImageDtos =
                      updatedVariants[index].imageDtos || [];
                    updatedVariants[index] = {
                      ...updatedVariants[index],
                      imageDtos: variantImageDtos.map((img) =>
                        img.productImageId === imageId
                          ? { ...img, isDeleted: true }
                          : img
                      ),
                    };
                    setValue("variants", updatedVariants, {
                      shouldValidate: true,
                    });
                  }}
                  onSetMainImage={(imageId) => {
                    const updatedVariants = [...formVariants];
                    const variantImageDtos =
                      updatedVariants[index].imageDtos || [];
                    updatedVariants[index] = {
                      ...updatedVariants[index],
                      imageDtos: variantImageDtos.map((img) => ({
                        ...img,
                        isMain: img.productImageId === imageId,
                      })),
                    };
                    setValue("variants", updatedVariants, {
                      shouldValidate: true,
                    });
                  }}
                />
              );
            })}
          </div>
        )}
        {errors?.variants && !Array.isArray(errors.variants) && (
          <p className="text-xs text-red-600 mt-2">{errors.variants.message}</p>
        )}
      </div>

      {/* Form Validation Errors */}
      <FormValidationErrors errors={form.formState.errors} />

      <button
        type="submit"
        onClick={() => {
          console.log("form", form.getValues());
          console.log("errors", form.formState.errors);
        }}
        className="w-full cursor-pointer py-3 bg-black text-white font-medium rounded-none hover:bg-black/80 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
      >
        Update Product
      </button>
    </form>
  );
};

export default UpdateProductForm;
