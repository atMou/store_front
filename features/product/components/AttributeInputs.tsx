"use client";
import { BookmarkPlus, Tag, Trash2 } from "lucide-react";
import {
  ArrayPath,
  Control,
  FieldArray,
  FieldValues,
  Path,
  useFieldArray,
} from "react-hook-form";
import AddButton from "../../../components/atoms/AddButton";
import TextInput from "../../../components/atoms/TextInput";

interface ProductAttributeInputsProps<T extends FieldValues> {
  control: Control<T>;
  name: ArrayPath<T>;
  label: string;
  tooltipText?: string;
  namePlaceholder?: string;
  descriptionPlaceholder?: string;
  error?: string;
}

const AttributeInputs = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  tooltipText,
  namePlaceholder,
  descriptionPlaceholder,
}: ProductAttributeInputsProps<T>) => {
  const { fields, append, remove } = useFieldArray<T>({
    control,
    name,
  });

  return (
    <div>
      <label className="block text-xs mb-3">{label}</label>
      {fields && fields.length > 0 && (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={"id" in field ? field.id : index}
              className="grid grid-cols-2 gap-3 p-3 border border-gray-300 rounded-none relative"
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
                name={`${name}.${index}.name` as Path<T>}
                label="Name"
                placeholder={namePlaceholder}
                Icon={Tag}
              />
              <TextInput
                control={control}
                name={`${name}.${index}.description` as Path<T>}
                label="Description"
                placeholder={descriptionPlaceholder}
                Icon={BookmarkPlus}
              />
            </div>
          ))}
          {error && <p className="text-xs pl-2 mb-2 text-red-600">{error}</p>}
        </div>
      )}

      <AddButton
        onClick={() =>
          append({ name: "", description: "" } as FieldArray<T, ArrayPath<T>>)
        }
        tooltipText={tooltipText}
      />
    </div>
  );
};

export default AttributeInputs;
