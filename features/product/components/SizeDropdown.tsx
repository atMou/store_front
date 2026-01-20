"use client";
import { SIZES } from "@/constants";
import { RulerDimensionLine } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";
import DropdownControl from "../../../components/atoms/DropdownControl";

interface SizeDropdownProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

function SizeDropdown<T extends FieldValues>({
  control,
  name,
  label = "Size",
}: SizeDropdownProps<T>) {
  const options = SIZES.map((size) => ({
    value: size,
    label: size,
  }));

  return (
    <DropdownControl
      control={control}
      name={name}
      label={label}
      placeholder="Select size"
      options={options}
      required
      Icon={RulerDimensionLine}
    />
  );
}

export default SizeDropdown;
