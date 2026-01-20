"use client";
import { COLORS } from "@/constants";
import { Palette } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";
import DropdownControl from "../../../components/atoms/DropdownControl";

interface ColorDropdownProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

function ColorDropdown<T extends FieldValues>({
  control,
  name,
  label = "Color",
}: ColorDropdownProps<T>) {
  const options = COLORS.map((color) => ({
    value: color.name,
    label: color.name,
    color: color.hex,
  }));

  return (
    <DropdownControl
      control={control}
      name={name}
      label={label}
      placeholder="Select a color"
      options={options}
      Icon={Palette}
    />
  );
}

export default ColorDropdown;
