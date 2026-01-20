"use client";
import { Boxes, Percent, Tag, Trash2 } from "lucide-react";
import { useMemo } from "react";
import {
  ArrayPath,
  Control,
  FieldArray,
  FieldValues,
  Path,
  useFieldArray,
} from "react-hook-form";
import AddButton from "../../../components/atoms/AddButton";
import DropdownControl from "../../../components/atoms/DropdownControl";
import NumberInput from "../../../components/atoms/NumberInput";
import TextInput from "../../../components/atoms/TextInput";
import { useGetMarerialsQuery } from "../api";

interface MaterialDetailInputsProps<T extends FieldValues> {
  control: Control<T>;
  name: ArrayPath<T>;
  error?: string;
}

const MaterialDetailInputs = <T extends FieldValues>({
  control,
  name,
  error,
}: MaterialDetailInputsProps<T>) => {
  const { fields, append, remove } = useFieldArray<T>({
    control,
    name,
  });

  const { data: materials = [], isLoading } = useGetMarerialsQuery();

  const materialOptions = useMemo(
    () => materials.map((material) => ({ value: material, label: material })),
    [materials]
  );

  return (
    <div>
      <label className="block text-xs mb-3">Material Details</label>
      {fields && fields.length > 0 && (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={"id" in field ? field.id : index}
              className="grid grid-cols-3 gap-3 p-3 border border-gray-300 rounded-none relative"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>

              <TextInput
                control={control}
                name={`${name}.${index}.detail` as Path<T>}
                label="Detail"
                placeholder="Key"
                Icon={Tag}
              />
              <DropdownControl
                control={control}
                name={`${name}.${index}.material` as Path<T>}
                label="Material"
                placeholder="Select material"
                options={materialOptions}
                isLoading={isLoading}
                required
                Icon={Boxes}
              />

              <NumberInput
                control={control}
                name={`${name}.${index}.percentage` as Path<T>}
                label="Percentage (%)"
                placeholder="0-100"
                step="0.1"
                Icon={Percent}
              />
            </div>
          ))}
          {error && <p className="text-xs pl-2 mb-2 text-red-600">{error}</p>}
        </div>
      )}
      <AddButton
        onClick={() =>
          append({
            material: "",
            percentage: undefined,
            detail: "",
          } as FieldArray<T, ArrayPath<T>>)
        }
        tooltipText="Add Material Detail"
      />
    </div>
  );
};

export default MaterialDetailInputs;
