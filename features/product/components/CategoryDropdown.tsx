"use client";
import { useGetCategoriesQuery } from "@/features/category/api";
import { Box, Boxes, PackageSearch, ScanBarcode } from "lucide-react";
import { Control, FieldValues, Path, useWatch } from "react-hook-form";
import DropdownControl from "../../../components/atoms/DropdownControl";

interface CategoryDropdownProps<T extends FieldValues> {
  control: Control<T>;
  category?: Path<T>;
  subCategory?: Path<T>;
  type?: Path<T>;
  subType?: Path<T>;
}

function CategoryDropdown<T extends FieldValues>({
  control,
  category = "category" as Path<T>,
  subCategory = "subCategory" as Path<T>,
  type = "type" as Path<T>,
  subType = "subType" as Path<T>,
}: CategoryDropdownProps<T>) {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  const mainValue = useWatch({ control, name: category });
  const subValue = useWatch({ control, name: subCategory });
  const typeValue = useWatch({ control, name: type });

  // Main categories - all unique main values
  const mainOptions = [
    ...new Set(categories.map((cat) => cat.main).filter(Boolean)),
  ].map((main) => ({ value: main, label: main }));

  // Sub categories - filtered by selected main
  const subOptions = mainValue
    ? [
        ...new Set(
          categories
            .filter((cat) => cat.main === mainValue)
            .map((cat) => cat.sub)
            .filter(Boolean)
        ),
      ].map((sub) => ({ value: sub, label: sub }))
    : [];

  // Product types - from the matching category
  const selectedCategory = categories.find(
    (cat) => cat.main === mainValue && cat.sub === subValue
  );
  const typeOptions = selectedCategory
    ? selectedCategory.productTypes.map((pt) => ({
        value: pt.type,
        label: pt.type,
      }))
    : [];

  // Sub types - from the matching product type
  const selectedProductType = selectedCategory?.productTypes.find(
    (pt) => pt.type === typeValue
  );
  const subTypeOptions = selectedProductType
    ? selectedProductType.subTypes.map((st) => ({ value: st, label: st }))
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Main Category Dropdown */}
      <DropdownControl
        control={control}
        name={category}
        label="Main Category"
        placeholder="Select main category"
        options={mainOptions}
        isLoading={isLoading}
        required
        Icon={Box}
      />

      {/* Sub Category Dropdown */}
      <DropdownControl
        control={control}
        name={subCategory}
        label="Sub Category"
        placeholder="Select sub category"
        options={subOptions}
        isLoading={isLoading}
        disabled={!mainValue}
        required
        Icon={Boxes}
      />

      <DropdownControl
        control={control}
        name={type}
        label="Product Type"
        placeholder="Select product type"
        options={typeOptions}
        isLoading={isLoading}
        disabled={!subValue}
        required
        Icon={ScanBarcode}
      />

      <DropdownControl
        control={control}
        name={subType}
        label="Product Sub-Type"
        placeholder="Select sub-type"
        options={subTypeOptions}
        isLoading={isLoading}
        disabled={!typeValue}
        required
        Icon={PackageSearch}
      />
    </div>
  );
}

export default CategoryDropdown;
