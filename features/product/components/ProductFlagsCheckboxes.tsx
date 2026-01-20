"use client";
import React from "react";
import { Control } from "react-hook-form";
import CheckBox from "../../../components/atoms/CheckBox";
import { UpdateProductFormSchema } from "../validations/UpdateProductFormValidation";

interface ProductFlagsCheckboxesProps {
  control: Control<UpdateProductFormSchema>;
}

const ProductFlagsCheckboxes: React.FC<ProductFlagsCheckboxesProps> = ({
  control,
}) => {
  return (
    <div>
      <label className="block text-xs mb-2">Product Flags</label>
      <div className="grid grid-cols-2 gap-4">
        <CheckBox control={control} name="isFeatured" label="Featured" />
        <CheckBox control={control} name="isNew" label="New" />
        <CheckBox control={control} name="isBestSeller" label="Best Seller" />
        <CheckBox control={control} name="isTrending" label="Trending" />
      </div>
    </div>
  );
};

export default ProductFlagsCheckboxes;
