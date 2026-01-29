"use client";

import ApiErrorDisplay from "@/components/feedback/ApiErrorDisplay";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coins, Tag } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import AddButton from "../../../components/atoms/AddButton";
import ImageUploader from "../../../components/atoms/ImageUploader";
import NumberInput from "../../../components/atoms/NumberInput";
import TextAreaInput from "../../../components/atoms/TextAreaInput";
import TextInput from "../../../components/atoms/TextInput";
import { buildProductFormData } from "../utils";
import {
  ProductFormInput,
  ProductFormSchema,
  productFormSchema,
} from "../validations/ProductFormValidation";
import AttributeInputs from "./AttributeInputs";
import BrandDropdown from "./BrandDropdown";
import CategoryDropdown from "./CategoryDropdown";
import MaterialDetailInputs from "./MaterialDetailInputs";
import VariantFieldset from "./VariantFieldset";

interface ProductFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  error?: unknown;
  submitLabel?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  isLoading,
  error,
  submitLabel = "Save",
}) => {
  const form = useForm<ProductFormInput, undefined, ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      slug: "",
      images: [],
      isMain: [],
      price: "",
      newPrice: undefined,
      brand: "",
      category: "",
      subCategory: "",
      description: "",
      detailsAttributes: [],
      sizeFitAttributes: [],
      materialDetails: [],
      type: "",
      subType: "",
      variants: [],
    },
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const {
    fields: variants,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const handleAddVariant = () => {
    append({
      color: "",
      images: [],
      isMain: [],
    });
  };

  const handleRemoveVariant = (index: number) => {
    remove(index);
  };

  const handleFormSubmit = (data: ProductFormSchema) => {
    console.log("handleFormSubmit called!");
    console.log("Form Data Submitted:", data);

    const formData = buildProductFormData(data);
    onSubmit(formData);
  };

  console.log("Form Errors:", errors);

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
    >
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
        <TextInput
          control={control}
          name="slug"
          label="Product Slug"
          placeholder="product-slug"
          Icon={Tag}
        />

        <BrandDropdown control={control} />

        <NumberInput
          control={control}
          name="price"
          label="Price"
          placeholder="99.99"
          required
          step="0.01"
          Icon={Coins}
        />

        <NumberInput
          control={control}
          name="newPrice"
          label="Sale Price"
          placeholder="79.99"
          step="0.01"
          Icon={Coins}
        />

        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <CategoryDropdown
            control={control}
            category="category"
            subCategory="subCategory"
            type="type"
            subType="subType"
          />
        </div>
      </div>
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <TextAreaInput
          control={control}
          name="description"
          label="Description"
          placeholder="Describe your amazing product here..."
          rows={4}
        />

        <ImageUploader
          control={control}
          errors={errors}
          setValue={setValue}
          name="images"
          label="Images"
          maxFiles={5}
          showMainSelector={true}
          isMainFieldName="isMain"
        />
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <AttributeInputs
          control={control}
          name="detailsAttributes"
          label="Product Details"
          error={errors.detailsAttributes?.message}
          tooltipText="Add Product Details"
          namePlaceholder="Key"
          descriptionPlaceholder="Value"
        />

        <AttributeInputs
          control={control}
          name="sizeFitAttributes"
          label="Size & Fit Information"
          error={errors.sizeFitAttributes?.message}
          tooltipText="Add Size & Fit Information"
          namePlaceholder="Key"
          descriptionPlaceholder="Value"
        />
      </div>

      <MaterialDetailInputs
        control={control}
        name="materialDetails"
        error={errors.materialDetails?.message}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-xs">Product Variants</label>
        </div>

        {}
        {variants.length > 0 && (
          <div className="space-y-6">
            {variants.map((variant, variantIndex) => (
              <VariantFieldset
                key={variant.id}
                variantIndex={variantIndex}
                control={control}
                errors={errors}
                setValue={setValue}
                onRemove={() => handleRemoveVariant(variantIndex)}
              />
            ))}
          </div>
        )}

        {}
        <div className="lg:col-span-2">
          <AddButton onClick={handleAddVariant} tooltipText="Add Variant" />
        </div>
      </div>

      <ApiErrorDisplay error={error} />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-black text-white hover:bg-black/80 font-bold rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
