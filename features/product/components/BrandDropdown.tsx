"use client";
import { ShieldHalf } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";
import DropdownControl from "../../../components/atoms/DropdownControl";
import { useGetBrandsQuery } from "../api";

interface BrandDropdownProps<T extends FieldValues> {
  control: Control<T>;
  name?: Path<T>;
}

function BrandDropdown<T extends FieldValues>({
  control,
  name = "brand" as Path<T>,
}: BrandDropdownProps<T>) {
  const { data: brands, isLoading } = useGetBrandsQuery();

  const options = (brands || []).map((brand) => ({
    value: brand,
    label: brand,
  }));

  return (
    <DropdownControl
      control={control}
      name={name}
      label="Brand"
      placeholder="Select a brand"
      options={options}
      isLoading={isLoading}
      Icon={ShieldHalf}
    />
  );
}

export default BrandDropdown;
